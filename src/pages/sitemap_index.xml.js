// Expõe /sitemap_index.xml (endereço usado pelo antigo WordPress/Yoast/Rank Math,
// possivelmente já cadastrado no Google Search Console).
import { buildSitemapIndex } from './sitemap.xml.js';

export function GET({ site }) {
  return new Response(buildSitemapIndex(site), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
