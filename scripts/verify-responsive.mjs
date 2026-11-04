import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Use an existing Playwright installation; this check adds no project dependency.
const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
const { chromium } = await import(modulePath ? pathToFileURL(resolve(modulePath)).href : 'playwright');
const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:5173';
const outputDir = resolve(process.env.QA_OUTPUT_DIR || 'reports/responsive-qa');
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL || 'chrome' });
const results = { baseUrl, generatedAt: new Date().toISOString(), viewports: [], interactions: [], errors: [] };
let compactBaseline = [];
try {
  compactBaseline = JSON.parse(await readFile(resolve('reports/responsive-qa/baseline-compact/measurements.json'), 'utf8'));
} catch { /* Height comparisons are optional when running outside the original QA workspace. */ }
const widths = (process.env.QA_WIDTHS || '320,360,375,390,430,680,681,768,1023,1024,1440').split(',').map(Number);
const sectionScreenshotStyle = '.devnov-header, .dn-mobile-menu-trigger, .skip-link { visibility: hidden !important; }';
const check = (ok, name, details = null) => {
  results.interactions.push({ name, ok: Boolean(ok), details });
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
};

try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => results.errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('#contact').waitFor();
  await page.waitForFunction(() => !document.querySelector('#work [aria-busy="true"]'), { timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);
  // Warm lazy screenshots through ordinary scrolling before full-section captures.
  for (const image of await page.locator('#work article img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(el => el.complete && el.naturalWidth > 0 ? Promise.resolve() : new Promise((resolveImage, rejectImage) => {
      el.addEventListener('load', resolveImage, { once: true });
      el.addEventListener('error', () => rejectImage(new Error(`Project screenshot failed to load: ${el.alt}`)), { once: true });
    }));
  }
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(250);
    const geometry = await page.evaluate(() => {
      const box = el => {
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
      };
      const headings = [...document.querySelectorAll('h1,h2')].map(el => ({ text: el.textContent.trim(), ...box(el), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }));
      const overflow = [...document.querySelectorAll('main *, footer *')].filter(el => {
        const style = getComputedStyle(el);
        if (style.position === 'absolute' || style.position === 'fixed' || style.visibility === 'hidden') return false;
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;
        // Descendants inside deliberate horizontal scrollers do not cause page overflow.
        for (let parent = el.parentElement; parent; parent = parent.parentElement) {
          if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(parent).overflowX)) return false;
        }
        return rect.right > innerWidth + 1 || rect.left < -1;
      }).slice(0, 12).map(el => ({ tag: el.tagName, className: el.className, text: el.textContent.slice(0, 90), ...box(el) }));
      const ctas = [...document.querySelectorAll('.dn15-cta-row > a')].map(box);
      const heroCards = [...document.querySelectorAll('.dn21-hero-proof, .dn15-highlight, .dn15-capability')].map(el => ({ text: el.textContent.trim(), ...box(el) }));
      const overlaps = heroCards.flatMap((a, i) => heroCards.slice(i + 1).filter(b => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1).map(b => [a.text, b.text]));
      const projectImages = [...document.querySelectorAll('#work article img')].map(el => ({ fit: getComputedStyle(el).objectFit, complete: el.complete, naturalWidth: el.naturalWidth }));
      const workCtas = [...document.querySelectorAll('.dn-work-ctas > a')].map(box);
      const serviceCards = [...document.querySelectorAll('#services article')].map(el => ({ title: el.querySelector('h3')?.textContent, ...box(el) }));
      const projectCards = [...document.querySelectorAll('#work article')].map(el => ({ title: el.querySelector('h3')?.textContent, ...box(el) }));
      const technologyGrids = [...document.querySelectorAll('.dn17-grid')].map(el => ({ columns: getComputedStyle(el).gridTemplateColumns.split(' ').length, ...box(el) }));
      const technologyLabels = [...document.querySelectorAll('.dn17-chip-name')].map(el => ({ text: el.textContent.trim(), clipped: el.scrollWidth > el.clientWidth + 1, ...box(el) }));
      const footerLinks = [...document.querySelectorAll('footer a')].map(el => ({ text: el.textContent.trim() || el.getAttribute('aria-label'), href: el.getAttribute('href'), ...box(el) }));
      return {
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        headings, overflow, ctas, heroCards, overlaps,
        projects: document.querySelectorAll('#work article').length,
        projectImages, workCtas, serviceCards, projectCards, technologyGrids, technologyLabels, footerLinks,
        stackHeight: document.querySelector('.dn17-stack')?.getBoundingClientRect().height,
        footerHeight: document.querySelector('footer')?.getBoundingClientRect().height,
        projectLinks: [...document.querySelectorAll('#work article a')].map(el => ({ text: el.textContent.trim(), href: el.href, target: el.target, rel: el.rel })),
      };
    });
    const baseline = compactBaseline.find(item => item.width === width);
    const meanHeight = cards => cards.reduce((sum, card) => sum + card.height, 0) / cards.length;
    if (baseline && width <= 430) {
      geometry.compactness = {
        serviceBefore: meanHeight(baseline.serviceCards), serviceAfter: meanHeight(geometry.serviceCards),
        projectBefore: meanHeight(baseline.projectCards), projectAfter: meanHeight(geometry.projectCards),
        stackBefore: baseline.stackHeight, stackAfter: geometry.stackHeight,
      };
      geometry.compactness.ok = geometry.compactness.serviceAfter < geometry.compactness.serviceBefore && geometry.compactness.projectAfter < geometry.compactness.projectBefore && geometry.compactness.stackAfter < geometry.compactness.stackBefore;
    }
    geometry.ok = geometry.documentWidth <= width && geometry.overlaps.length === 0 && geometry.heroCards.every(card => card.x >= -1 && card.right <= width + 1) && geometry.headings.every(h => h.scrollWidth <= h.clientWidth + 1 && h.right <= width + 1 && h.x >= -1) && geometry.ctas.length === 2 && Math.abs(geometry.ctas[0].y - geometry.ctas[1].y) < 1 && geometry.workCtas.length === 2 && Math.abs(geometry.workCtas[0].y - geometry.workCtas[1].y) < 1;
    geometry.ok = geometry.ok && geometry.technologyGrids.every(grid => grid.columns >= 2) && geometry.technologyLabels.every(label => !label.clipped && label.x >= -1 && label.right <= width + 1) && geometry.footerLinks.every(link => link.height >= 43.9 && link.x >= -1 && link.right <= width + 1) && geometry.compactness?.ok !== false;
    results.viewports.push({ width, ...geometry });
    console.log(`${geometry.ok ? 'PASS' : 'FAIL'}: ${width}px (document ${geometry.documentWidth}px; card overlaps ${geometry.overlaps.length}; projects ${geometry.projects})`);
    await page.screenshot({ path: resolve(outputDir, `viewport-top-${width}.png`) });
    await page.screenshot({ path: resolve(outputDir, `page-${width}.png`), fullPage: true });
    await page.locator('.dn15-hero').screenshot({ path: resolve(outputDir, `hero-${width}.png`), style: sectionScreenshotStyle });
    await page.locator('.dn15-hero-art').screenshot({ path: resolve(outputDir, `art-${width}.png`), style: sectionScreenshotStyle });
    await page.locator('#services').screenshot({ path: resolve(outputDir, `services-${width}.png`), style: sectionScreenshotStyle });
    await page.locator('.dn17-stack').screenshot({ path: resolve(outputDir, `stack-${width}.png`), style: sectionScreenshotStyle });
    await page.locator('#work').screenshot({ path: resolve(outputDir, `work-${width}.png`), style: sectionScreenshotStyle });
    await page.locator('footer').screenshot({ path: resolve(outputDir, `footer-${width}.png`), style: sectionScreenshotStyle });
    if ([320, 390, 1440].includes(width)) {
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await page.screenshot({ path: resolve(outputDir, `viewport-footer-${width}.png`) });
      await page.evaluate(() => window.scrollTo({ top: document.querySelector('.dn17-stack').offsetTop - 80, behavior: 'instant' }));
      await page.screenshot({ path: resolve(outputDir, `viewport-stack-${width}.png`) });
    }
    if (width === 390) {
      await page.evaluate(() => window.scrollTo({ top: document.querySelector('#work').offsetTop - 80, behavior: 'instant' }));
      await page.screenshot({ path: resolve(outputDir, 'viewport-work-heading-390.png') });
      await page.evaluate(() => window.scrollTo({ top: document.querySelector('#work article').getBoundingClientRect().top + scrollY - 80, behavior: 'instant' }));
      await page.screenshot({ path: resolve(outputDir, 'viewport-first-card-390.png') });
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  check(await page.locator('.skip-link').evaluate(el => el.getBoundingClientRect().bottom < 0 && el !== document.activeElement), 'Skip link stays hidden until keyboard focus');
  const trigger = page.getByRole('button', { name: 'Open navigation', exact: true });
  const sheet = page.locator('#devnov-mobile-menu');
  check(await trigger.isVisible() && await page.locator('header button').count() === 0 && await page.locator('header').getByRole('link', { name: "Let's Talk" }).isVisible(), 'Mobile header has logo/CTA and separate bottom menu trigger');
  await trigger.click();
  await sheet.waitFor({ state: 'visible' });
  check(await sheet.evaluate(el => el.open && el.matches(':modal')), 'Bottom sheet is a native modal dialog');
  check(await sheet.getByRole('button', { name: 'Close navigation' }).evaluate(el => el === document.activeElement), 'Opening focuses the close control');
  const scrollState = await page.evaluate(() => ({ body: document.body.style.overflow, root: document.documentElement.style.overflow, y: scrollY }));
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(100);
  check(scrollState.body === 'hidden' && scrollState.root === 'hidden' && await page.evaluate(() => scrollY) === scrollState.y, 'Sheet locks background scrolling');
  const sheetFocusables = sheet.locator('a[href], button:not([disabled])');
  await sheetFocusables.first().focus();
  await page.keyboard.press('Shift+Tab');
  check(await sheetFocusables.last().evaluate(el => el === document.activeElement), 'Native dialog contains backward keyboard focus');
  await page.keyboard.press('Tab');
  check(await sheetFocusables.first().evaluate(el => el === document.activeElement), 'Native dialog contains forward keyboard focus');
  await page.screenshot({ path: resolve(outputDir, 'mobile-sheet-390.png') });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.screenshot({ path: resolve(outputDir, 'mobile-sheet-320.png') });
  check(await sheet.evaluate(el => el.scrollWidth <= innerWidth && el.getBoundingClientRect().bottom <= innerHeight), 'Small mobile sheet fits short viewport');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.keyboard.press('Escape');
  await sheet.waitFor({ state: 'detached' });
  check(await trigger.evaluate(el => el === document.activeElement) && await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'Escape dismisses sheet and restores focus/scroll');
  await trigger.click();
  await sheet.getByRole('button', { name: 'Close navigation' }).click();
  await sheet.waitFor({ state: 'detached' });
  check(true, 'Close control dismisses sheet');
  await trigger.click();
  await page.mouse.click(10, 100);
  await sheet.waitFor({ state: 'detached' });
  check(true, 'Backdrop dismisses sheet');
  for (const [name, id] of [['Services', 'services'], ['Work', 'work'], ['About', 'why-devnov'], ['Process', 'process'], ['FAQ', 'faq'], ['Home', 'top']]) {
    await trigger.click();
    await sheet.getByRole('link', { name, exact: true }).click();
    await sheet.waitFor({ state: 'detached' });
    await page.waitForTimeout(100);
    const targetTop = await page.locator(`#${id}`).evaluate(el => el.getBoundingClientRect().top);
    const headerBottom = await page.locator('header').evaluate(el => el.getBoundingClientRect().bottom);
    check(new URL(page.url()).hash === `#${id}` && (id === 'top' || targetTop >= headerBottom - 1), `${name} navigation closes sheet and clears sticky header`, { targetTop, headerBottom });
  }
  await trigger.click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await sheet.waitFor({ state: 'detached' });
  check(!await trigger.isVisible() && await page.locator('.dn15-nav-links').isVisible() && await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'Desktop resize dismisses mobile sheet and restores desktop navigation');

  await page.setViewportSize({ width: 390, height: 844 });
  const filters = page.locator('.dn-work-filter');
  const categoryNames = await filters.allTextContents();
  const allCards = await page.locator('#work article').count();
  check(categoryNames.length > 1 && allCards > 0, 'Published backend projects/categories loaded', { categories: categoryNames, allCards });
  for (const category of categoryNames.slice(1)) {
    await filters.filter({ hasText: category }).click();
    const categories = await page.locator('.dn-project-category').allTextContents();
    check(categories.length > 0 && categories.every(label => label.includes(category)), `Project filter: ${category}`, { categories });
  }
  await filters.filter({ hasText: /^All$/ }).click();
  check(await page.locator('#work article').count() === allCards, 'All filter restores project listing');
  const filterGeometry = await page.locator('.dn-work-filters').evaluate(el => ({ width: el.clientWidth, scrollWidth: el.scrollWidth, wrapping: getComputedStyle(el).flexWrap }));
  check(filterGeometry.scrollWidth > filterGeometry.width && filterGeometry.wrapping === 'nowrap', 'Mobile filters form one horizontal scroll row', filterGeometry);
  check(await page.locator('.dn-work-filter-controls button').count() === 0, 'Project filters have no arrow controls');
  const filterRow = page.locator('.dn-work-filters');
  await filterRow.evaluate(el => { el.scrollLeft = 0; el.scrollIntoView({ block: 'center', behavior: 'instant' }); });
  const rowBox = await filterRow.boundingBox();
  const swipeSession = await context.newCDPSession(page);
  await swipeSession.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  const swipeStart = rowBox.x + rowBox.width - 20;
  const swipeEnd = rowBox.x + 20;
  const swipeY = rowBox.y + rowBox.height / 2;
  await swipeSession.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: swipeStart, y: swipeY, id: 1 }] });
  for (let step = 1; step <= 10; step++) {
    await swipeSession.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: swipeStart + (swipeEnd - swipeStart) * step / 10, y: swipeY, id: 1 }] });
    await page.waitForTimeout(16);
  }
  await swipeSession.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(150);
  const swipedLeft = await filterRow.evaluate(el => el.scrollLeft);
  check(swipedLeft > 10, 'Finger swipe scrolls the filter categories', { scrollLeft: swipedLeft });
  await swipeSession.send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await swipeSession.detach();
  await filters.last().focus();
  const keyboardFilter = await filters.last().evaluate(el => {
    const button = el.getBoundingClientRect();
    const row = el.parentElement.getBoundingClientRect();
    return { visible: button.left >= row.left - 1 && button.right <= row.right + 1, label: el.textContent.trim() };
  });
  check(keyboardFilter.visible, 'Keyboard focus reveals the last filter category', keyboardFilter);
  await page.keyboard.press('Enter');
  check(await filters.last().getAttribute('aria-pressed') === 'true', 'Keyboard activation still filters projects');
  await filters.first().click();
  const workCtaDestinations = await page.locator('.dn-work-ctas a').evaluateAll(links => links.map(link => link.getAttribute('href')));
  check(workCtaDestinations.join(',') === '#contact,#services', 'Featured Work CTA destinations preserved');
  const heroCtaDestinations = await page.locator('.dn15-cta-row a').evaluateAll(links => links.map(link => link.getAttribute('href')));
  check(heroCtaDestinations.join(',') === '#contact,#work', 'Hero CTA destinations preserved');
  const links = await page.locator('#work article a').evaluateAll(links => links.map(link => ({ href: link.href, target: link.target, rel: link.rel })));
  check(links.length > 0 && links.every(link => link.href.startsWith('https://') && link.target === '_blank' && link.rel.includes('noopener')), 'Project/source links retain secure external destinations', { count: links.length });
  results.externalDestinations = await Promise.all([...new Set(links.map(link => link.href))].map(async url => {
    try {
      const response = await context.request.get(url, { timeout: 12000, failOnStatusCode: false });
      return { url, status: response.status(), ok: response.ok() };
    } catch (error) {
      return { url, ok: false, error: error.message.split('\n')[0] };
    }
  }));
  for (const destination of results.externalDestinations) console.log(`INFO: External destination ${destination.status || destination.error}: ${destination.url}`);
  const detailsButton = page.locator('.dn-project-primary').first();
  await detailsButton.click();
  const caseStudy = page.getByRole('dialog');
  await caseStudy.waitFor({ state: 'visible' });
  check(new URL(page.url()).searchParams.has('project') && await caseStudy.locator('h2').isVisible(), 'Read case study opens existing modal and shareable project URL');
  await page.screenshot({ path: resolve(outputDir, 'case-study-390.png') });
  await page.keyboard.press('Escape');
  await caseStudy.waitFor({ state: 'detached' });
  check(!new URL(page.url()).searchParams.has('project') && await detailsButton.evaluate(el => el === document.activeElement), 'Case study Escape preserves URL cleanup and focus return');
  const previewButton = page.locator('.dn-project-preview').first();
  await previewButton.click();
  await caseStudy.waitFor({ state: 'visible' });
  check(true, 'Project screenshot preview opens existing case study');
  await caseStudy.getByRole('button', { name: 'Close case study' }).click();
  await caseStudy.waitFor({ state: 'detached' });
  const faq = page.locator('#faq button').first();
  const wasExpanded = await faq.getAttribute('aria-expanded');
  await faq.click();
  check(await faq.getAttribute('aria-expanded') !== wasExpanded, 'FAQ interaction preserved');
  const footerAnchors = await page.locator('footer a').evaluateAll(links => links.map(link => ({ href: link.getAttribute('href'), targetExists: !link.hash || Boolean(document.getElementById(link.hash.slice(1))) })));
  check(footerAnchors.every(link => link.targetExists), 'Footer anchor links point to existing sections', footerAnchors);
  const footerNavigation = page.getByRole('navigation', { name: 'Footer navigation' });
  check(await footerNavigation.getByRole('link').count() === 6, 'Footer retains all six navigation destinations');
  await footerNavigation.getByRole('link', { name: 'Services', exact: true }).click();
  check(new URL(page.url()).hash === '#services', 'Footer navigation still works');
  const adminPage = await context.newPage();
  await adminPage.goto(`${baseUrl}/admin`, { waitUntil: 'domcontentloaded' });
  await adminPage.locator('input[type="email"]').waitFor();
  check(await adminPage.locator('input[type="password"]').isVisible(), 'Admin route still renders its existing sign-in screen');
  await adminPage.close();
  await context.close();

  const motionContext = await browser.newContext({ viewport: { width: 320, height: 360 }, reducedMotion: 'no-preference' });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  const motionTrigger = motionPage.getByRole('button', { name: 'Open navigation', exact: true });
  await motionTrigger.click();
  const motionSheet = motionPage.locator('#devnov-mobile-menu');
  await motionSheet.waitFor({ state: 'visible' });
  await motionPage.waitForTimeout(400);
  const shortSheet = await motionPage.locator('.dn-mobile-sheet').evaluate(el => {
    el.scrollTop = el.scrollHeight;
    const rect = el.getBoundingClientRect();
    const cta = el.querySelector('.dn-mobile-sheet-cta').getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, height: rect.height, viewport: innerHeight, scrollHeight: el.scrollHeight, ctaBottom: cta.bottom, transform: getComputedStyle(el).transform };
  });
  check(shortSheet.top >= 0 && shortSheet.bottom <= 361 && shortSheet.ctaBottom <= 361 && shortSheet.scrollHeight > shortSheet.height, 'Short 320x360 sheet scrolls to CTA within viewport', shortSheet);
  check(shortSheet.transform === 'none' || shortSheet.transform === 'matrix(1, 0, 0, 1, 0, 0)', 'Normal-motion sheet finishes slide animation');
  await motionPage.screenshot({ path: resolve(outputDir, 'mobile-sheet-320x360.png') });
  await motionPage.keyboard.press('Escape');
  await motionSheet.waitFor({ state: 'detached' });
  check(await motionTrigger.evaluate(el => el === document.activeElement) && await motionPage.evaluate(() => document.body.style.overflow !== 'hidden'), 'Normal-motion sheet closes and restores keyboard focus/scroll');
  await motionContext.close();
} finally {
  await browser.close();
  await writeFile(resolve(outputDir, 'results.json'), JSON.stringify(results, null, 2));
}
if (results.errors.length || results.viewports.some(result => !result.ok) || results.interactions.some(result => !result.ok)) process.exitCode = 1;
