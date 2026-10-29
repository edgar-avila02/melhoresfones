import https from 'node:https';

function checkYouTubeOEmbed(videoId) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({ valid: true, title: json.title, author: json.author_name, videoId });
          } catch {
            resolve({ valid: false, statusCode: res.statusCode });
          }
        } else {
          resolve({ valid: false, statusCode: res.statusCode });
        }
      });
    }).on('error', (e) => resolve({ valid: false, error: e.message }));
  });
}

const candidates = [
  '6qfKLkKvcw8',
  'W5ZqkmZHEig',
  'Kk2_5Y7s6MA',
  'QhxV57bENkM',
  'QLyWEHnXS-A',
  'GHnvPNbAgwU',
  '-GXr_zx5deI',
  'UgdY26tI1oY'
];

async function run() {
  for (const id of candidates) {
    const res = await checkYouTubeOEmbed(id);
    if (res.valid) {
      console.log(`[VÁLIDO 200] ID: ${id} | Título: ${res.title} | Canal: ${res.author}`);
    } else {
      console.log(`[INVÁLIDO] ID: ${id} | Status: ${res.statusCode}`);
    }
  }
}

run();
