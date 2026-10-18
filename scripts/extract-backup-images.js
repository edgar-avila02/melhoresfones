import fs from 'node:fs';
import path from 'node:path';

const BACKUP_FILE = 'C:\\Users\\edgar\\OneDrive\\Área de Trabalho\\Melhores fones novo\\Backup\\melhoresfones-com 10.02.26';
const DEST_BASE = path.resolve('public', 'wp-content', 'uploads');

if (!fs.existsSync(BACKUP_FILE)) {
  console.error(`Arquivo de backup não encontrado: ${BACKUP_FILE}`);
  process.exit(1);
}

fs.mkdirSync(DEST_BASE, { recursive: true });

console.log(`Abrindo arquivo de backup: ${BACKUP_FILE}`);
const fd = fs.openSync(BACKUP_FILE, 'r');
const stat = fs.fstatSync(fd);
console.log(`Tamanho do arquivo: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);

let offset = 0;
let totalFiles = 0;
let extractedFiles = 0;
let skippedFiles = 0;
let errorFiles = 0;
let bytesExtracted = 0;

const headerBuf = Buffer.alloc(4377);

while (offset < stat.size) {
  const bytesRead = fs.readSync(fd, headerBuf, 0, 4377, offset);
  if (bytesRead < 4377) break;

  const filename = headerBuf.subarray(0, 255).toString('ascii').replace(/\0/g, '').trim();
  const sizeStr = headerBuf.subarray(255, 269).toString('ascii').replace(/\0/g, '').trim();
  const prefix = headerBuf.subarray(281, 4377).toString('ascii').replace(/\0/g, '').trim();
  const size = parseInt(sizeStr, 10);

  if (isNaN(size) || size < 0) {
    console.log(`Fim dos registros ou término do arquivo no offset ${offset}`);
    break;
  }

  const fullPath = prefix ? `${prefix}/${filename}` : filename;
  totalFiles++;

  // Verificar se o arquivo pertence a uploads
  const isUpload = fullPath.includes('uploads/');
  const isCache = fullPath.includes('cache/min') || fullPath.includes('wpr-addons');

  if (isUpload && !isCache && size > 0) {
    let relPath = fullPath;
    if (relPath.includes('wp-content/uploads/')) {
      relPath = relPath.substring(relPath.indexOf('wp-content/uploads/') + 'wp-content/uploads/'.length);
    } else if (relPath.startsWith('uploads/')) {
      relPath = relPath.substring('uploads/'.length);
    }

    // Limpar caracteres de controle inválidos para Windows
    relPath = relPath.replace(/[\x00-\x1f\x7f]/g, '');

    const destPath = path.join(DEST_BASE, relPath);
    const destDir = path.dirname(destPath);

    try {
      if (fs.existsSync(destPath) && fs.statSync(destPath).size === size) {
        extractedFiles++;
        bytesExtracted += size;
      } else {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        const contentBuf = Buffer.alloc(size);
        fs.readSync(fd, contentBuf, 0, size, offset + 4377);
        fs.writeFileSync(destPath, contentBuf);

        extractedFiles++;
        bytesExtracted += size;
      }
    } catch (err) {
      errorFiles++;
      console.warn(`Erro ao salvar ${relPath}: ${err.message}`);
    }

    if (extractedFiles % 200 === 0) {
      console.log(`Processados ${extractedFiles} arquivos... (${(bytesExtracted / (1024 * 1024)).toFixed(1)} MB)`);
    }
  } else {
    skippedFiles++;
  }

  offset += 4377 + size;
}

fs.closeSync(fd);

console.log('\n--- Extração concluída com sucesso! ---');
console.log(`Total de arquivos no backup: ${totalFiles}`);
console.log(`Arquivos de imagem/upload extraídos: ${extractedFiles}`);
console.log(`Erros em arquivos: ${errorFiles}`);
console.log(`Volume total extraído: ${(bytesExtracted / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Arquivos ignorados (código/cache): ${skippedFiles}`);
