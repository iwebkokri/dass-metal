// Helpers for the "request a quote" flow (browser side). Products are passed in (they come from the CMS database).

/** URL of the quote form pre-filled for one product, e.g. /contact?product=j-track&o.Gauge=20&qty=500#quote */
export function quoteHref(slug, options = {}, qty = '') {
  const q = new URLSearchParams({ product: slug });
  Object.entries(options).forEach(([label, value]) => { if (value) q.set(`o.${label}`, value); });
  if (String(qty).trim()) q.set('qty', String(qty).trim());
  return `/contact?${q.toString()}#quote`;
}

let n = 0;
export const newLineId = () => `line-${Date.now()}-${n++}`;

/**
 * Quote lines described by a URL query string. Only known products and option values that really exist on that product are accepted.
 * @param {URLSearchParams} params
 * @param {Record<string, {specs: {label: string, values: string[]}[]}>} bySlug
 */
export function linesFromParams(params, bySlug) {
  const slug = params.get('product');
  const product = slug && bySlug[slug];
  if (!product) return [];
  const opts = {};
  for (const spec of product.specs || []) {
    const v = params.get(`o.${spec.label}`);
    if (v && spec.values.includes(v)) opts[spec.label] = v;
  }
  return [{ id: newLineId(), slug, opts, qty: (params.get('qty') || '').slice(0, 40), notes: '' }];
}

/** The lines as the server expects them (JSON in the form field `products`). */
export function linesPayload(lines) {
  return JSON.stringify(
    lines.map((l) => ({ slug: l.slug, options: Object.fromEntries(Object.entries(l.opts).filter(([, v]) => v)), quantity: l.qty, notes: l.notes })),
  );
}
