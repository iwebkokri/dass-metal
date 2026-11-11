import { productBySlug } from '../data/catalog.js';

/** URL of the quote form pre-filled for one product, e.g. /contact?product=j-track&o.Gauge=20&qty=500#quote */
export function quoteHref(slug, options = {}, qty = '') {
  const q = new URLSearchParams({ product: slug });
  Object.entries(options).forEach(([label, value]) => { if (value) q.set(`o.${label}`, value); });
  if (String(qty).trim()) q.set('qty', String(qty).trim());
  return `/contact?${q.toString()}#quote`;
}

let n = 0;
export const newLineId = () => `line-${Date.now()}-${n++}`;

/** Quote lines described by the URL query string (only known products / valid option values are accepted). */
export function linesFromParams(params) {
  const slug = params.get('product');
  const product = slug && productBySlug[slug];
  if (!product) return [];
  const opts = {};
  for (const spec of product.specs) {
    const v = params.get(`o.${spec.label}`);
    if (v && spec.values.includes(v)) opts[spec.label] = v;
  }
  return [{ id: newLineId(), slug, opts, qty: (params.get('qty') || '').slice(0, 40), notes: '' }];
}

/** Plain-text summary of one quote line, used for the email fallback / submission. */
export function describeLine(line, i) {
  const p = productBySlug[line.slug];
  const opts = Object.entries(line.opts).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  return [`${i + 1}. ${p ? p.title : line.slug}`, ...opts.map((o) => `   ${o}`), `   Quantity: ${line.qty}`, line.notes ? `   Notes: ${line.notes}` : null]
    .filter(Boolean)
    .join('\n');
}
