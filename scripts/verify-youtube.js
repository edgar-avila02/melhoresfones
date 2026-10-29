import https from 'node:https';

/**
 * Validador Oficial de Vídeos do YouTube via oEmbed
 * Garante HTTP 200 e permissão de embed antes de inserir em qualquer artigo.
 * 
 * Uso:
 *   node scripts/verify-youtube.js <VIDEO_ID_OU_URL>
 * Exemplos:
 *   node scripts/verify-youtube.js -GXr_zx5deI
 *   node scripts/verify-youtube.js "https://www.youtube.com/watch?v=-GXr_zx5deI"
 */

function extractVideoId(input) {
  if (!input) return null;
  const cleanInput = input.trim();
  // Se já for apenas o ID (ex: 11 caracteres)
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanInput)) {
    return cleanInput;
  }
  // Se for URL completa ou encurtada
  const match = cleanInput.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export function checkYouTubeOEmbed(videoId) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({
              valid: true,
              statusCode: 200,
              videoId,
              title: json.title,
              author: json.author_name,
              embedHtml: json.html
            });
          } catch {
            resolve({ valid: false, statusCode: res.statusCode, error: 'JSON parse error' });
          }
        } else {
          resolve({ valid: false, statusCode: res.statusCode });
        }
      });
    }).on('error', (e) => resolve({ valid: false, error: e.message }));
  });
}

const inputArg = process.argv[2];

if (!inputArg) {
  console.log(`
Uso: node scripts/verify-youtube.js <VIDEO_ID_OU_URL>
Exemplo: node scripts/verify-youtube.js -GXr_zx5deI
`);
  process.exit(1);
}

const videoId = extractVideoId(inputArg);

if (!videoId) {
  console.error(`❌ ID do YouTube inválido ou formato não reconhecido: "${inputArg}"`);
  process.exit(1);
}

const result = await checkYouTubeOEmbed(videoId);

if (result.valid) {
  console.log(`\n✅ [VÍDEO 100% ATIVO E DISPONÍVEL]`);
  console.log(`- ID: ${result.videoId}`);
  console.log(`- Título: ${result.title}`);
  console.log(`- Canal: ${result.author}`);
  console.log(`- Embed Autorizado: Sim (HTTP 200 OK)\n`);
  process.exit(0);
} else {
  console.error(`\n❌ [VÍDEO INDISPONÍVEL OU PRIVADO]`);
  console.error(`- ID Consultado: ${videoId}`);
  console.error(`- Status HTTP: ${result.statusCode || 'Erro de conexão'}`);
  console.error(`- Motivo: O vídeo não existe, foi excluído, é privado ou tem restrição de incorporação.`);
  console.error(`- AÇÃO OBRIGATÓRIA: Escolha outro vídeo ativo antes de prosseguir!\n`);
  process.exit(1);
}
