import fs from 'node:fs';
import path from 'node:path';

async function fetchAll(endpoint) {
  let page = 1;
  let all = [];
  while (true) {
    const url = `https://melhoresfones.com/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}`;
    console.log(`Fetching ${url}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 400 || res.status === 404) break;
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      all.push(...data);
      console.log(`Fetched page ${page} (${data.length} items)`);
      if (data.length < 100) break;
      page++;
    } catch (err) {
      console.error(err);
      break;
    }
  }
  return all;
}

async function main() {
  const dataDir = path.resolve('src/data');
  fs.mkdirSync(dataDir, { recursive: true });

  const posts = await fetchAll('posts');
  fs.writeFileSync(path.join(dataDir, 'posts.json'), JSON.stringify(posts, null, 2));
  console.log(`Saved ${posts.length} posts to src/data/posts.json`);

  const pages = await fetchAll('pages');
  fs.writeFileSync(path.join(dataDir, 'pages.json'), JSON.stringify(pages, null, 2));
  console.log(`Saved ${pages.length} pages to src/data/pages.json`);

  const categories = await fetchAll('categories');
  fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2));
  console.log(`Saved ${categories.length} categories to src/data/categories.json`);
}

main().catch(console.error);
