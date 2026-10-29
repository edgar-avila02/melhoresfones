import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

function getRedirectTarget(pathname) {
  try {
    const file = fs.readFileSync(path.resolve('public/_redirects'), 'utf8');
    const lines = file.split(/\r?\n/);
    const cleanPath = decodeURIComponent(pathname).toLowerCase();
    const withSlash = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/';
    const noSlash = cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        const from = parts[0].toLowerCase();
        if (from === cleanPath || from === withSlash || from === noSlash) {
          return parts[1];
        }
      }
    }
  } catch (e) {}
  return null;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://melhoresfones.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [
      {
        name: 'dev-redirects',
        configureServer(server) {
          server.middlewares.stack.unshift({
            route: '',
            handle(req, res, next) {
              if (req.url) {
                const urlPath = req.url.split('?')[0];
                const target = getRedirectTarget(urlPath);
                if (target) {
                  res.writeHead(301, { Location: target });
                  res.end();
                  return;
                }
              }
              next();
            }
          });
        }
      }
    ]
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404')
    })
  ]
});
