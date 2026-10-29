import fs from 'node:fs';
import path from 'node:path';

const csvPath = path.resolve('src/data/pretty-links.csv');
let lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/);

const mapping = {
  'qcy-t13': '245,qcy-t13,https://www.amazon.com.br/dp/B09C1K95LB?tag=melhoresfon05-20,qcy-t13,,301,0,1,1,0,0,admin,"2025-06-14 23:04:58","2025-06-14 23:04:58",438,438',
  'qcy-ht05-melobuds': '122,qcy-ht05-melobuds,https://www.amazon.com.br/dp/B0BMKJ9HGT?tag=melhoresfon05-20,qcy-ht05-melobuds,,301,0,1,1,0,0,admin,"2024-05-29 16:07:06","2024-05-29 16:07:06",1423,1410',
  'qcy-h3': '168,qcy-h3,https://www.amazon.com.br/dp/B0CGV5GD8F?tag=melhoresfon05-20,qcy-h3,,301,0,1,1,0,0,admin,"2024-06-19 23:31:24","2024-06-19 23:31:24",911,904',
  'qcy-ht07': '166,qcy-ht07,https://www.amazon.com.br/dp/B0BY2JJW31?tag=melhoresfon05-20,qcy-ht07,,301,0,1,1,0,0,admin,"2024-06-19 23:22:47","2024-06-19 23:22:47",1443,1435',
  'qcy-t20': '164,qcy-t20,https://www.amazon.com.br/dp/B0B4DPV38K?tag=melhoresfon05-20,qcy-t20,,301,0,1,1,0,0,admin,"2024-06-19 23:15:56","2024-06-19 23:15:56",1184,1172'
};

// Filtra linhas corrompidas ou antigas desses slugs
lines = lines.filter(l => {
  for (const s of Object.keys(mapping)) {
    if (l.startsWith(s + ',') || l.includes(',' + s + ',')) return false;
  }
  return true;
});

// Adiciona as linhas limpas
for (const s of Object.keys(mapping)) {
  lines.push(mapping[s]);
}

fs.writeFileSync(csvPath, lines.filter(Boolean).join('\n') + '\n', 'utf8');
console.log('Linhas QCY atualizadas com sucesso em pretty-links.csv');
