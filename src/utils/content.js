import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import yaml from 'yaml';
import rawPosts from '../data/posts.json' with { type: 'json' };
import pages from '../data/pages.json' with { type: 'json' };
import categories from '../data/categories.json' with { type: 'json' };
import media from '../data/media.json' with { type: 'json' };

function loadMarkdownPosts() {
  const postsDir = path.resolve('src/content/posts');
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const mdPosts = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');

    const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) continue;

    const rawYaml = match[1];
    const rawBody = match[2];
    let frontmatter = {};
    try {
      frontmatter = yaml.parse(rawYaml) || {};
    } catch (e) {
      console.error(`Erro ao processar frontmatter de ${file}:`, e);
      continue;
    }

    const slug = frontmatter.slug || file.replace(/\.(md|mdx)$/, '');
    const title = frontmatter.title || slug;
    const description = frontmatter.description || '';
    const category = frontmatter.category === 'duvidas' ? 21 : 17;
    const date = frontmatter.pubDate || new Date().toISOString();
    const modified = frontmatter.modDate || date;
    const renderedHtml = marked.parse(rawBody);

    mdPosts.push({
      id: 99000 + i,
      date,
      modified,
      slug,
      status: 'publish',
      type: 'post',
      title: { rendered: title },
      content: { rendered: renderedHtml },
      excerpt: { rendered: `<p>${description}</p>` },
      categories: [category],
      featured_media: null,
      featured_image_url: frontmatter.image || '/wp-content/uploads/2024/03/Logo-do-melhores-fones.webp',
      featured_image_alt: frontmatter.imageAlt || title
    });
  }

  return mdPosts;
}

const markdownPosts = loadMarkdownPosts();
const mdSlugs = new Set(markdownPosts.map(p => p.slug));
const posts = [...markdownPosts, ...rawPosts.filter(p => !mdSlugs.has(p.slug))];

export { posts, pages, categories, media };

export function cleanContent(html) {
  if (!html) return '';
  let cleaned = html;

  // Restore real image src, srcset and sizes from lazyload data-attributes
  cleaned = cleaned.replace(/<img([^>]+)>/gi, (match, attrs) => {
    let newAttrs = attrs;

    // Check data-src
    const dataSrcMatch = newAttrs.match(/\sdata-src=(["'])(.*?)\1/i);
    if (dataSrcMatch && dataSrcMatch[2]) {
      const realSrc = dataSrcMatch[2];
      if (/\ssrc=(["']).*?\1/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/\ssrc=(["']).*?\1/i, ` src="${realSrc}"`);
      } else {
        newAttrs = ` src="${realSrc}"${newAttrs}`;
      }
    }

    // Check data-srcset
    const dataSrcsetMatch = newAttrs.match(/\sdata-srcset=(["'])(.*?)\1/i);
    if (dataSrcsetMatch && dataSrcsetMatch[2]) {
      const realSrcset = dataSrcsetMatch[2];
      if (/\ssrcset=(["']).*?\1/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/\ssrcset=(["']).*?\1/i, ` srcset="${realSrcset}"`);
      } else {
        newAttrs = ` srcset="${realSrcset}"${newAttrs}`;
      }
    }

    // Check data-sizes
    const dataSizesMatch = newAttrs.match(/\sdata-sizes=(["'])(.*?)\1/i);
    if (dataSizesMatch && dataSizesMatch[2]) {
      const realSizes = dataSizesMatch[2];
      if (/\ssizes=(["']).*?\1/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/\ssizes=(["']).*?\1/i, ` sizes="${realSizes}"`);
      } else {
        newAttrs = ` sizes="${realSizes}"${newAttrs}`;
      }
    }

    // Fallback onerror
    if (!/onerror=/i.test(newAttrs)) {
      newAttrs = ` onerror="this.src='/wp-content/uploads/2024/12/Icone-de-fone-de-ouvido.webp'"${newAttrs}`;
    }

    // Native loading="lazy" and decoding="async"
    if (!/loading=/i.test(newAttrs)) {
      newAttrs = ` loading="lazy"${newAttrs}`;
    }
    if (!/decoding=/i.test(newAttrs)) {
      newAttrs = ` decoding="async"${newAttrs}`;
    }

    // Remove lazyload class references
    newAttrs = newAttrs.replace(/\blazyload(ing|ed)?\b/gi, '').trim();

    // Clean obsolete inline styles on images (e.g. smush placeholders or fixed pixel overrides)
    newAttrs = newAttrs.replace(/\sstyle=(["']).*?\1/gi, '');

    return `<img ${newAttrs}>`;
  });

  // Remove obsolete/harsh inline styles from WordPress affiliate plugin blocks
  cleaned = cleaned.replace(/(<div class="[^"]*wp-block-afpb-[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<div class="[^"]*afpb__product_info[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<div class="[^"]*afpb__props_cons[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<div class="[^"]*afpb__badge[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<h[23] class="[^"]*title_tag[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<div class="[^"]*afpb__icon[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<div class="[^"]*afpb__props_list[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<div class="[^"]*afpb__cons_list[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<a [^>]*class="[^"]*afpb__btn[^"]*")[^>]*style="[^"]*"/gi, '$1');
  cleaned = cleaned.replace(/(<div class="[^"]*product_description[^"]*")[^>]*style="[^"]*"/gi, '$1');

  // Clean empty artifacts or empty paragraphs from WordPress plugins
  cleaned = cleaned.replace(/<div class="afpb__props_list"[^>]*>\s*<ul>\s*<li>\s*<\/li>\s*<\/ul>\s*<\/div>/gi, '');
  cleaned = cleaned.replace(/<div class="product_description"[^>]*>\s*<p>\s*<p>\s*<\/p>\s*<\/p>\s*<\/div>/gi, '');
  cleaned = cleaned.replace(/<p>\s*<p>\s*<\/p>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');

  // Ensure root-relative paths for all wp-content uploads
  cleaned = cleaned.replace(/https?:\/\/melhoresfones\.com\/wp-content\/uploads\//gi, '/wp-content/uploads/');
  cleaned = cleaned.replace(/http:\/\/melhoresfones\.com/g, 'https://melhoresfones.com');

  return cleaned;
}

export function getFeaturedImage(item) {
  if (item.featured_image_url) {
    return {
      url: item.featured_image_url,
      alt: item.featured_image_alt || item.title?.rendered || '',
      width: 1200,
      height: 800
    };
  }
  if (item.featured_media && media[item.featured_media]) {
    const m = media[item.featured_media];
    return {
      ...m,
      url: (m.url || '').replace(/^https?:\/\/melhoresfones\.com/, '')
    };
  }
  // Try extracting first img tag
  if (item.content?.rendered) {
    const m = item.content.rendered.match(/<img[^>]+(?:data-src|src)=(["'])(.*?)\1/i);
    if (m && m[2]) {
      const altMatch = item.content.rendered.match(/<img[^>]+alt=(["'])(.*?)\1/i);
      return {
        url: m[2].replace(/^https?:\/\/melhoresfones\.com/, ''),
        alt: altMatch ? altMatch[2] : item.title?.rendered || '',
        width: 1200,
        height: 800
      };
    }
  }
  return {
    url: '/wp-content/uploads/2024/03/Logo-do-melhores-fones.webp',
    alt: item.title?.rendered || 'Melhores Fones',
    width: 300,
    height: 300
  };
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
