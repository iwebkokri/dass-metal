// Safe HTML for long-form content (blog posts, product descriptions). SERVER / CLI ONLY (uses sanitize-html). Plain .mjs so the seed script can use it too.
//
// Everything an editor saves AND everything that is rendered goes through sanitizeRichHtml(): only the tags and attributes below survive,
// links / images / videos may only use http(s) (or a site path), and `javascript:` / `data:` addresses are removed. Layout classes are limited
// to the two the site styles: `gallery` and `cols`.
import sanitizeHtml from 'sanitize-html';

const TAGS = [
  'p', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 'sup', 'sub', 'a', 'br', 'hr', 'blockquote', 'code', 'pre',
  'figure', 'figcaption', 'img', 'video', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'dl', 'dt', 'dd',
];

/** @param {unknown} input @returns {string} */
export function sanitizeRichHtml(input) {
  const html = String(input ?? '').replace(/\u0000/g, '');
  return sanitizeHtml(html, {
    allowedTags: TAGS,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      video: ['src', 'controls', 'preload', 'playsinline', 'poster', 'muted', 'loop'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      div: ['class'],
    },
    allowedClasses: { div: ['gallery', 'cols'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'], video: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      // links that leave the site open in a new tab and never leak the opener
      a: (tag, attribs) => {
        const href = attribs.href || '';
        const external = /^https?:\/\//i.test(href);
        const out = { ...attribs };
        if (external) { out.target = '_blank'; out.rel = 'noopener noreferrer'; } else { delete out.target; delete out.rel; }
        return { tagName: 'a', attribs: out };
      },
      img: (tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy' } }),
      video: (tag, attribs) => ({ tagName: 'video', attribs: { ...attribs, controls: 'controls', preload: 'none', playsinline: 'playsinline' } }),
    },
    // an empty paragraph / heading left behind by the editor is noise
    exclusiveFilter: (frame) => ['p', 'h2', 'h3', 'h4'].includes(frame.tag) && !frame.text.trim() && !frame.mediaChildren?.length,
    disallowedTagsMode: 'discard',
  }).trim();
}

/** Plain text of an HTML body (for excerpts, search and AI-readable exports). */
/** @param {string} html @returns {string} */
export function htmlToText(html) {
  return sanitizeHtml(String(html ?? ''), { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();
}
