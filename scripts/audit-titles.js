import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      res.push(...walk(p));
    } else if (p.endsWith('.astro')) {
      res.push(p);
    }
  }
  return res;
}

const files = walk('src/pages').concat(walk('src/layouts'));

console.log('=== AUDITORIA DE TÍTULOS NAS PÁGINAS ===');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const headings = content.match(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/gi) || [];
  const baseLayoutTitle = content.match(/title=["']([^"']+)["']/i);
  
  console.log(`\n📄 [${file}]`);
  if (baseLayoutTitle) {
    console.log(`  TITLE PROP: "${baseLayoutTitle[1]}"`);
  }
  headings.forEach(h => {
    const clean = h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (clean) console.log(`  HEADING: "${clean}"`);
  });
});
