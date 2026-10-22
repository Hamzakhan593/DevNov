/** DevNov social SEO enhancer. Run AFTER 'node scripts/seo.mjs publish https://domain/'. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const file = resolve(root, 'index.html');
let html = readFileSync(file, 'utf8');
const canonical = html.match(/<link\s+rel="canonical"\s+href="(https:\/\/[^"<>]+)"\s*\/?\s*>/i)?.[1] || '';
const published = /<meta name="robots" content="index,follow"\s*\/?\s*>/.test(html);
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const blockStart = '<!-- DevNov share managed:start -->';
const blockEnd = '<!-- DevNov share managed:end -->';
html = html.replace(/\s*<!-- DevNov share managed:start -->[\s\S]*?<!-- DevNov share managed:end -->/g, '');
let additions = '';
if (published && canonical && existsSync(resolve(root, 'public/social-card.png'))) {
  try {
    const u = new URL(canonical);
    if (u.protocol !== 'https:' || u.username || u.password || u.pathname !== '/' || u.search || u.hash) throw new Error('Invalid canonical root.');
    const ogImage = `${u.origin}/social-card.png`;
    const jsonLd = JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'DevNov',url:u.origin + '/',logo:`${u.origin}/favicon.svg`}).replaceAll('<','\\u003c');
    additions = [blockStart,
      `<meta property="og:image" content="${escape(ogImage)}" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      '<meta property="og:image:alt" content="DevNov software development and AI automation" />',
      `<meta name="twitter:image" content="${escape(ogImage)}" />`,
      `<script type="application/ld+json">${jsonLd}</script>`,
      blockEnd].join('\n    ');
  } catch (error) { console.error('Not adding social meta:', error.message); process.exitCode = 1; }
} else {
  console.log('Draft/unknown canonical: no absolute social preview URLs emitted. Publish SEO first.');
}
if (additions) {
  html = html.replace(/(<meta name="twitter:card" content=")[^"]*(" \/>)/i, '$1summary_large_image$2');
  html = html.replace('</head>', `    ${additions}\n  </head>`);
} else {
  html = html.replace(/(<meta name="twitter:card" content=")[^"]*(" \/>)/i, '$1summary$2');
}
writeFileSync(file, html, 'utf8');
console.log(additions ? 'DevNov sharing/structured data updated for verified HTTPS canonical.' : 'DevNov draft metadata remains safe.');
