import posts from '../src/data/posts.json' with { type: 'json' };

console.log('=== TÍTULOS DOS POSTS COM LETRAS MAIÚSCULAS INTERNAS ===');
posts.forEach(p => {
  const words = p.title.rendered.split(' ');
  const uppercaseWords = words.filter((w, i) => i > 0 && /^[A-ZÁÉÍÓÚÂÊÔÃÕ][a-záéíóúâêôãõ]+$/.test(w) && !['QCY', 'JBL', 'KZ', 'Sony', 'Apple', 'Samsung', 'Huawei', 'Edifier', 'Beats', 'Bose', 'AirPods', 'Galaxy', 'Buds', 'Buds2', 'ANC', 'TWS', 'Bluetooth', 'Hi-Res', 'LDAC', 'Android', 'iOS', 'Windows', 'Type-C', 'iPhone', 'USP'].includes(w));
  if (uppercaseWords.length > 0) {
    console.log(`- "${p.title.rendered}" -> palavras com maiúsculas: [${uppercaseWords.join(', ')}]`);
  }
});
