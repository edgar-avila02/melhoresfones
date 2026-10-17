import fs from 'fs';

const indexHtml = fs.readFileSync('src/pages/index.astro', 'utf8');

const regex = /<(h[1-4]|span|strong|a)[^>]*>([\s\S]*?)<\/\1>/gi;
let m;
console.log('=== ELEMENTOS EM INDEX.ASTRO ===');
while ((m = regex.exec(indexHtml)) !== null) {
  const tag = m[1];
  const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (['h1', 'h2', 'h3', 'h4'].includes(tag.toLowerCase())) {
    console.log(`[${tag.toUpperCase()}] ${text}`);
  }
}
