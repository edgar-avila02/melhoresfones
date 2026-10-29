import fs from 'node:fs';
import path from 'node:path';

// Carrega os redirects de public/_redirects para funcionar no ambiente local (astro dev)
let redirectsMap = null;

function getRedirectsMap() {
  if (import.meta.env.PROD && redirectsMap) return redirectsMap;
  redirectsMap = new Map();
  try {
    const file = fs.readFileSync(path.resolve('public/_redirects'), 'utf8');
    const lines = file.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        const from = parts[0].toLowerCase();
        const to = parts[1];
        redirectsMap.set(from, to);
        if (from.endsWith('/')) {
          redirectsMap.set(from.slice(0, -1), to);
        } else {
          redirectsMap.set(from + '/', to);
        }
      }
    }
  } catch (e) {
    console.error('Erro ao ler public/_redirects no middleware:', e);
  }
  return redirectsMap;
}

export async function onRequest({ url, redirect }, next) {
  const rawPath = decodeURIComponent(url.pathname).toLowerCase();
  const pathname = rawPath.endsWith('/') ? rawPath : rawPath + '/';
  const pathnameNoSlash = rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  const map = getRedirectsMap();
  
  if (map.has(rawPath)) {
    return redirect(map.get(rawPath), 301);
  }
  if (map.has(pathname)) {
    return redirect(map.get(pathname), 301);
  }
  if (map.has(pathnameNoSlash)) {
    return redirect(map.get(pathnameNoSlash), 301);
  }
  return next();
}
