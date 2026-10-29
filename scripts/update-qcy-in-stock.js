import fs from 'node:fs';
import path from 'node:path';

const csvPath = path.resolve('src/data/pretty-links.csv');
const content = fs.readFileSync(csvPath, 'utf8');

const newLinks = [
  { slug: 'qcy-t13-pro-anc', name: 'QCY T13 Pro ANC', target: 'https://www.amazon.com.br/dp/B0HGYCPX86?tag=melhoresfon05-20' },
  { slug: 'qcy-t13', name: 'QCY T13 Pro ANC', target: 'https://www.amazon.com.br/dp/B0HGYCPX86?tag=melhoresfon05-20' },
  { slug: 'qcy-melobuds-pro', name: 'QCY MeloBuds Pro', target: 'https://www.amazon.com.br/dp/B0F8HZ11R4?tag=melhoresfon05-20' },
  { slug: 'qcy-ht05-melobuds', name: 'QCY MeloBuds Pro', target: 'https://www.amazon.com.br/dp/B0F8HZ11R4?tag=melhoresfon05-20' },
  { slug: 'qcy-h3', name: 'QCY H3 ANC', target: 'https://www.amazon.com.br/dp/B0CFZST5DV?tag=melhoresfon05-20' },
  { slug: 'qcy-melobuds-n20', name: 'QCY MeloBuds N20', target: 'https://www.amazon.com.br/dp/B0FZVC6PMD?tag=melhoresfon05-20' },
  { slug: 'qcy-ht07', name: 'QCY MeloBuds N20', target: 'https://www.amazon.com.br/dp/B0FZVC6PMD?tag=melhoresfon05-20' },
  { slug: 'qcy-melobuds-a30', name: 'QCY MeloBuds A30', target: 'https://www.amazon.com.br/dp/B0H5JH96RV?tag=melhoresfon05-20' },
  { slug: 'qcy-t20', name: 'QCY MeloBuds A30', target: 'https://www.amazon.com.br/dp/B0H5JH96RV?tag=melhoresfon05-20' }
];

let lines = content.split(/\r?\n/).filter(Boolean);
let currentId = 9100;

for (const item of newLinks) {
  lines = lines.filter(l => {
    const parts = l.split(',');
    const s = parts[1] ? parts[1].replace(/"/g, '').trim() : '';
    return s !== item.slug;
  });
  const row = [
    `"${currentId++}"`,
    `"${item.slug}"`,
    `"${item.target}"`,
    `"${item.name}"`,
    '""',
    '"301"',
    '""',
    '"0"',
    '"0"',
    '"0"',
    '"0"',
    '"0"',
    '""',
    '""',
    '"2026-10-29 18:00:00"',
    '""'
  ].join(',');
  lines.push(row);
}

fs.writeFileSync(csvPath, lines.join('\n') + '\n', 'utf8');
console.log('pretty-links.csv atualizado com sucesso. Total de linhas:', lines.length);
