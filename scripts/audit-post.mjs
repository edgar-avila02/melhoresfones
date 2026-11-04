import fs from 'node:fs';

const filePath = process.argv[2] || 'src/content/posts/como-saber-se-o-airpods-esta-carregado.md';
const content = fs.readFileSync(filePath, 'utf8');

// Extract frontmatter
const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!fmMatch) {
  console.error('Frontmatter not found');
  process.exit(1);
}

const fm = fmMatch[1];
const titleMatch = fm.match(/title:\s*"(.*?)"/);
const descMatch = fm.match(/description:\s*"(.*?)"/);

const title = titleMatch ? titleMatch[1] : '';
const desc = descMatch ? descMatch[1] : '';

console.log('--- AUDITORIA DE METADADOS ---');
console.log(`Arquivo: ${filePath}`);
console.log(`Title: "${title}" (${title.length} caracteres - Meta: 50 a 60)`);
console.log(`Description: "${desc}" (${desc.length} caracteres - Meta: 120 a 140)`);

// Body text
const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
const cleanBody = body
  .replace(/<[^>]+>/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[#*|`-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const words = cleanBody.split(/\s+/).filter(w => w.length > 1);
console.log(`Total de Palavras do Corpo: ${words.length} palavras`);

// Check paragraphs length
const paragraphs = body
  .split(/\r?\n\r?\n/)
  .map(p => p.trim())
  .filter(p => p.length > 0 && !p.startsWith('#') && !p.startsWith('<') && !p.startsWith('|') && !p.startsWith('---'));

console.log(`Total de parágrafos de texto: ${paragraphs.length}`);
const pWordCounts = paragraphs.map(p => p.split(/\s+/).length);
const avgWordsPerP = Math.round(pWordCounts.reduce((a, b) => a + b, 0) / pWordCounts.length);
console.log(`Média de palavras por parágrafo: ${avgWordsPerP} palavras (Ideal: 25 a 45 palavras)`);
