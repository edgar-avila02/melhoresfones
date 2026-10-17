import posts from '../data/posts.json' with { type: 'json' };
import pages from '../data/pages.json' with { type: 'json' };
import categories from '../data/categories.json' with { type: 'json' };
import media from '../data/media.json' with { type: 'json' };

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

  // Ensure HTTPS on all internal URLs
  cleaned = cleaned.replace(/http:\/\/melhoresfones\.com/g, 'https://melhoresfones.com');

  return cleaned;
}

export function getFeaturedImage(item) {
  if (item.featured_media && media[item.featured_media]) {
    return media[item.featured_media];
  }
  // Try extracting first img tag
  if (item.content?.rendered) {
    const m = item.content.rendered.match(/<img[^>]+(?:data-src|src)=(["'])(.*?)\1/i);
    if (m && m[2]) {
      const altMatch = item.content.rendered.match(/<img[^>]+alt=(["'])(.*?)\1/i);
      return {
        url: m[2].replace('http://', 'https://'),
        alt: altMatch ? altMatch[2] : item.title?.rendered || '',
        width: 1200,
        height: 800
      };
    }
  }
  return {
    url: 'https://melhoresfones.com/wp-content/uploads/2024/03/Logo-do-melhores-fones.webp',
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
