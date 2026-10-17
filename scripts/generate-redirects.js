import fs from 'node:fs';
import path from 'node:path';

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  const headerLine = lines[0];
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // CSV parser respecting quotes
    const tokens = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        tokens.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    tokens.push(current.trim());

    if (tokens.length >= 6) {
      const id = tokens[0];
      const slug = tokens[1].replace(/^"|"$/g, '');
      const url = tokens[2].replace(/^"|"$/g, '');
      const status = tokens[5].replace(/^"|"$/g, '') || '301';
      rows.push({ id, slug, url, status });
    }
  }
  return rows;
}

function generateRedirects() {
  const csvPath = path.resolve('src/data/pretty-links.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const links = parseCSV(csvContent);

  // Map<fromPath, { targetUrl, statusCode }> para garantir unicidade absoluta por caminho
  const redirectsMap = new Map();

  for (const item of links) {
    if (!item.slug || !item.url) continue;

    const targetUrl = item.url.trim();
    const statusCode = item.status === '307' ? '307' : '301';
    const rawSlug = item.slug.trim().replace(/^\/+|\/+$/g, '');

    // Formats:
    // 1. Raw slug encoded with encodeURI (e.g. spaces -> %20, accents -> %C3%A7)
    const encodedSlug = encodeURI(rawSlug);
    // 2. Spaces encoded only, accents preserved
    const spaceOnlyEncoded = rawSlug.replace(/\s+/g, '%20');
    // 3. Normalized hyphens if spaces
    const hyphenated = rawSlug.toLowerCase().replace(/\s+/g, '-');

    const variants = new Set([
      `/${encodedSlug}`,
      `/${encodedSlug}/`,
      `/${spaceOnlyEncoded}`,
      `/${spaceOnlyEncoded}/`
    ]);

    if (hyphenated !== rawSlug.toLowerCase()) {
      variants.add(`/${hyphenated}`);
      variants.add(`/${hyphenated}/`);
    }

    for (const v of variants) {
      // Como o CSV pode ter múltiplos links com o mesmo slug, o mais recente sobrescreve
      redirectsMap.set(v, { targetUrl, statusCode });
    }
  }

  const outputLines = [
    '# ==============================================================================',
    '# Cloudflare Pages Redirects - Melhores Fones (Pretty Links Mapeados)',
    '# ==============================================================================',
    ''
  ];

  for (const [fromPath, { targetUrl, statusCode }] of redirectsMap.entries()) {
    outputLines.push(`${fromPath} ${targetUrl} ${statusCode}`);
  }

  const finalContent = outputLines.join('\n') + '\n';
  fs.writeFileSync(path.resolve('public/_redirects'), finalContent, 'utf8');
  console.log(`Generated public/_redirects with ${redirectsMap.size} unique redirect rules from ${links.length} Pretty Links entries.`);

  if (fs.existsSync(path.resolve('dist'))) {
    fs.writeFileSync(path.resolve('dist/_redirects'), finalContent, 'utf8');
    console.log(`Updated dist/_redirects with ${redirectsMap.size} unique redirect rules.`);
  }
}

generateRedirects();
