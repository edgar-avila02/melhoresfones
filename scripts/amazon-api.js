import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

// Carrega variáveis do arquivo .env local
function loadEnv() {
  const envPath = path.resolve('.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const PARTNER_TAG = env.AMAZON_PARTNER_TAG || 'melhoresfon05-20';
const MARKETPLACE = env.AMAZON_MARKETPLACE || 'www.amazon.com.br';

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache'
    };

    https.get(url, { headers }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = `https://${MARKETPLACE}${redirectUrl}`;
        }
        return fetchHtml(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

export function extractAsin(input) {
  if (!input) return null;
  const str = String(input).trim();
  const match = str.match(/(?:dp\/|gp\/product\/|d\/|product\/|asin=)([A-Z0-9]{10})/i);
  if (match) return match[1].toUpperCase();
  if (/^[A-Z0-9]{10}$/i.test(str)) return str.toUpperCase();
  return null;
}

export function buildAffiliateUrl(asin, tag = PARTNER_TAG) {
  return `https://${MARKETPLACE}/dp/${asin}?tag=${tag}`;
}

export async function checkProduct(asinOrUrl) {
  const asin = extractAsin(asinOrUrl);
  if (!asin) {
    return { success: false, error: 'ASIN não identificado na URL ou entrada fornecida.' };
  }

  const url = `https://${MARKETPLACE}/dp/${asin}`;
  try {
    const { statusCode, html } = await fetchHtml(url);

    if (statusCode === 404 || html.includes('Não conseguimos encontrar essa página') || html.includes('Page Not Found')) {
      return {
        success: true,
        asin,
        status: 'UNAVAILABLE',
        available: false,
        reason: 'Página não encontrada ou produto descontinuado na Amazon (404).',
        affiliateUrl: buildAffiliateUrl(asin)
      };
    }

    // Título do produto
    let title = 'Produto Amazon';
    const titleMatch = html.match(/<span[^>]*id="productTitle"[^>]*>([\s\S]*?)<\/span>/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // Primeira Imagem Principal (landingImage / colorImages)
    let primaryImage = '';
    const imgMatch = html.match(/data-old-hires="([^"]+)"/i) ||
                     html.match(/"large":"([^"]+)"/i) ||
                     html.match(/"hiRes":"([^"]+)"/i) ||
                     html.match(/id="landingImage"[^>]*src="([^"]+)"/i);
    if (imgMatch) {
      primaryImage = imgMatch[1];
    }

    // Preço
    let price = null;
    const priceWhole = html.match(/<span class="a-price-whole">([0-9.,]+)<\/span>/i);
    const priceFraction = html.match(/<span class="a-price-fraction">([0-9]+)<\/span>/i);
    if (priceWhole) {
      price = `R$ ${priceWhole[1]}${priceFraction ? ',' + priceFraction[1] : ''}`;
    }

    // Disponibilidade / Estoque
    let available = true;
    let status = 'AVAILABLE';
    const isOutOfStock = html.includes('Não disponível no momento') ||
                         html.includes('Em falta') ||
                         html.includes('Currently unavailable') ||
                         html.includes('Não temos previsão de quando este produto estará novamente em estoque');

    if (isOutOfStock) {
      available = false;
      status = 'UNAVAILABLE';
    }

    return {
      success: true,
      asin,
      title,
      price,
      available,
      status,
      primaryImage,
      affiliateUrl: buildAffiliateUrl(asin)
    };
  } catch (err) {
    return {
      success: false,
      asin,
      error: `Erro ao auditar produto na Amazon: ${err.message}`,
      affiliateUrl: buildAffiliateUrl(asin)
    };
  }
}

export async function searchSimilar(query, limit = 5) {
  const encoded = encodeURIComponent(query);
  const searchUrl = `https://${MARKETPLACE}/s?k=${encoded}`;

  try {
    const { html } = await fetchHtml(searchUrl);
    const asinMatches = html.match(/data-asin="([A-Z0-9]{10})"/g) || [];
    const uniqueAsins = [];

    for (const raw of asinMatches) {
      const asin = raw.replace('data-asin="', '').replace('"', '').trim();
      if (asin && asin !== '0000000000' && !uniqueAsins.includes(asin)) {
        uniqueAsins.push(asin);
      }
      if (uniqueAsins.length >= limit) break;
    }

    const items = [];
    for (const asin of uniqueAsins) {
      const prod = await checkProduct(asin);
      if (prod.success && prod.available) {
        items.push({
          asin: prod.asin,
          title: prod.title,
          price: prod.price,
          primaryImage: prod.primaryImage,
          available: prod.available,
          affiliateUrl: prod.affiliateUrl
        });
      }
    }

    return {
      success: true,
      query,
      resultsCount: items.length,
      products: items
    };
  } catch (err) {
    return {
      success: false,
      query,
      error: `Erro ao buscar similares na Amazon: ${err.message}`
    };
  }
}

// CLI Execution Support
if (process.argv[1] && process.argv[1].endsWith('amazon-api.js')) {
  const cmd = process.argv[2];
  const param = process.argv.slice(3).join(' ');

  if (cmd === 'check' && param) {
    checkProduct(param).then(res => console.log(JSON.stringify(res, null, 2)));
  } else if (cmd === 'search' && param) {
    searchSimilar(param).then(res => console.log(JSON.stringify(res, null, 2)));
  } else {
    console.log('Uso: node scripts/amazon-api.js check <ASIN|URL> | search <termo>');
  }
}
