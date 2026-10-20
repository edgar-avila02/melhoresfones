import fs from 'node:fs';

const posts = JSON.parse(fs.readFileSync('src/data/posts.json', 'utf8'));

console.log(`========================================================================`);
console.log(` AUDITORIA COMPLETA DE SEO (META TITLE <= 50 | META DESCRIPTION <= 150) `);
console.log(`========================================================================\n`);

let failed = false;
let maxTitleLen = 0;
let maxDescLen = 0;
let minTitleLen = 1000;
let minDescLen = 1000;

posts.forEach((p, i) => {
  const h1 = p.title.rendered.replace(/&#8211;/g, '–');
  const title = p.seo_title || '';
  const desc = p.seo_description || '';
  const titleLen = title.length;
  const descLen = desc.length;

  if (titleLen > maxTitleLen) maxTitleLen = titleLen;
  if (titleLen < minTitleLen) minTitleLen = titleLen;
  if (descLen > maxDescLen) maxDescLen = descLen;
  if (descLen < minDescLen) minDescLen = descLen;

  const titleValid = titleLen > 0 && titleLen <= 50;
  const descValid = descLen > 0 && descLen <= 150;

  if (!titleValid || !descValid) {
    failed = true;
    console.error(`❌ [${i + 1}/${posts.length}] FALHA em ${p.slug}:`);
    if (!titleValid) console.error(`   Título (${titleLen} ch): "${title}"`);
    if (!descValid) console.error(`   Descrição (${descLen} ch): "${desc}"`);
  }
});

if (!failed) {
  console.log(`✅ TODOS OS ${posts.length} ARTIGOS APROVADOS COM SUCESSO!`);
  console.log(`- Faixa de caracteres dos Títulos: de ${minTitleLen} até ${maxTitleLen} (Limite máximo: 50)`);
  console.log(`- Faixa de caracteres das Descrições: de ${minDescLen} até ${maxDescLen} (Limite máximo: 150)\n`);

  console.log(`Exemplos amostrais:`);
  [0, 10, 25, 45, 60, 72].forEach(idx => {
    const p = posts[idx];
    console.log(`\n📄 Post #${idx + 1}: ${p.slug}`);
    console.log(`   H1 original: "${p.title.rendered.replace(/&#8211;/g, '–')}"`);
    console.log(`   SEO Title (${p.seo_title.length} ch): "${p.seo_title}"`);
    console.log(`   SEO Description (${p.seo_description.length} ch): "${p.seo_description}"`);
  });
} else {
  process.exit(1);
}
