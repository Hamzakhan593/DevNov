import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { agency } from '../src/data/agencyData.js';

const args = process.argv.slice(2);
const publishing = args[0] === 'publish';
if (!['draft','publish'].includes(args[0])) { console.error('Usage: node scripts/seo.mjs draft | publish https://your-domain.com'); process.exit(1); }
let url = '';
if (publishing) {
  try {
    const parsed = new URL(args[1]);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/' || /(^localhost$|\.local$|\.example$|\.test$|^127\.)/i.test(parsed.hostname)) throw new Error('Requires real HTTPS domain root.');
    url = parsed.origin + '/';
  } catch { console.error('Please pass a verified production HTTPS domain, e.g. https://your-real-domain.com (without paths).'); process.exit(1); }
}
const safe = (value) => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const title = `${agency.brandName} | Custom Software, Web Apps & AI Automation`;
const description = String(agency.summary || 'Digital product engineering and AI automation services.').slice(0, 155);
const path = 'index.html';
let html = readFileSync(path, 'utf8');
if (!html.includes('</head>') || !html.includes('<title>')) throw new Error('Expected standard Vite HTML head.');
html = html.replace(/<title>[^<]*<\/title>/i, `<title>${safe(title)}</title>`);
html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/i, `<meta name="description" content="${safe(description)}" />`);
html = html.replace(/\s*<!-- Devnov SEO managed:start -->[\s\S]*?<!-- Devnov SEO managed:end -->/g, '');
const seo = [
  '    <!-- Devnov SEO managed:start -->',
  `    <meta name="robots" content="${publishing ? 'index,follow' : 'noindex,nofollow'}" />`,
  '    <meta property="og:type" content="website" />',
  `    <meta property="og:title" content="${safe(title)}" />`,
  `    <meta property="og:description" content="${safe(description)}" />`,
  '    <meta name="twitter:card" content="summary" />',
  ...(publishing ? [`    <link rel="canonical" href="${safe(url)}" />`, `    <meta property="og:url" content="${safe(url)}" />`] : []),
  '    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
  '    <!-- Devnov SEO managed:end -->',
].join('\n');
html = html.replace('</head>', `${seo}\n  </head>`);
writeFileSync(path, html);
const robots = publishing ? 'User-agent: *\nAllow: /\nSitemap: ' + url + 'sitemap.xml\n' : 'User-agent: *\nDisallow: /\n';
writeFileSync('public/robots.txt', robots);
if (publishing) {
  writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${safe(url)}</loc></url></urlset>\n`);
} else if (existsSync('public/sitemap.xml')) unlinkSync('public/sitemap.xml');
console.log(publishing ? `SEO: Production indexing enabled for ${url}` : 'SEO: Draft mode / noindex enabled.');