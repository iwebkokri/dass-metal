// Pure helper (safe in the browser and on the server): arrange products as category -> group -> products.
// Order = the order the products are arranged in the admin; the first appearance of a category / group wins.
export function groupProducts(products) {
  const cats = [];
  for (const p of products) {
    const ct = p.category || 'Products';
    let cat = cats.find((c) => c.title === ct);
    if (!cat) cats.push((cat = { title: ct, groups: [] }));
    const gt = p.group_title || '';
    let g = cat.groups.find((x) => x.title === gt);
    if (!g) cat.groups.push((g = { title: gt, items: [] }));
    g.items.push(p);
  }
  return cats;
}
