// Expõe /sitemap.xml (endereço padrão buscado pelo Google e por ferramentas de SEO).
// Aponta para os sitemaps gerados pelo @astrojs/sitemap (sitemap-0.xml, ...).
export function buildSitemapIndex(site) {
  const base = String(site).replace(/\/$/, '');
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap-0.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>
`;
}

export function GET({ site }) {
  return new Response(buildSitemapIndex(site), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
