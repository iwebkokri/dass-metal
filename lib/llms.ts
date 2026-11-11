// llms.txt (llmstxt.org) and llms-full.txt: a clean, link-rich map of the site for AI assistants and answer engines.
// Built from the database on every request: published, indexable pages and posts only (never drafts, trash, scheduled or noindex).
import * as siteCopy from './site-content.mjs';
import { all } from './db';
import { getSeo } from './seo';
import { nowUtc } from './page-admin';
import { nowStamp } from './post-time';
import { parseDoc, walk } from './builder/tree.mjs';
import { pageUrl } from './builder/seo-schema.mjs';
import { extractContent, toMarkdown } from './builder/content-text.mjs';

type PageRow = { path: string; title: string; seo_description: string; answer_summary: string; content: string; canonical_url: string; updated_at: string };
type PostRow = { slug: string; title: string; excerpt: string; body: string; seo_description: string; answer_summary: string; published_at: string; author: string | null };

const MAX_FULL = 1_500_000;
const one = (s: string) => String(s ?? '').replace(/\s+/g, ' ').trim();

function publishedPages(): PageRow[] {
  return all<PageRow>(
    `SELECT path, title, seo_description, answer_summary, content, canonical_url, updated_at FROM pages
      WHERE status = 'published' AND noindex = 0 AND (published_at IS NULL OR published_at <= ?) ORDER BY path`,
    nowUtc()
  );
}

function publishedPosts(): PostRow[] {
  return all<PostRow>(
    `SELECT p.slug, p.title, p.excerpt, p.body, p.seo_description, p.answer_summary, p.published_at, COALESCE(NULLIF(u.name, ''), u.email) AS author
       FROM posts p LEFT JOIN users u ON u.id = p.author_id
      WHERE p.status = 'published' AND p.external_url = '' AND p.noindex = 0 AND p.published_at <= ? ORDER BY p.published_at DESC, p.id DESC`,
    nowStamp()
  );
}

function header(seo: ReturnType<typeof getSeo>): string[] {
  const name = seo.entity.name || seo.site.title;
  const summary = one(seo.llms.intro.split(/\n{2,}/)[0] || seo.entity.description || seo.site.description);
  const details = seo.llms.intro.includes('\n\n') ? seo.llms.intro.split(/\n{2,}/).slice(1).join('\n\n').trim() : '';
  const out = [`# ${name}`, '', `> ${summary}`];
  if (details) out.push('', details);
  return out;
}

function contact(seo: ReturnType<typeof getSeo>): string[] {
  const e = seo.entity;
  const addr = [e.street, e.city, e.region, e.postal, e.country].filter(Boolean).join(', ');
  const items = [e.email && `- Email: ${e.email}`, e.phone && `- Phone: ${e.phone}`, addr && `- Address: ${addr}`, e.hours.length && `- Hours: ${e.hours.join('; ')}`, e.areas.length && `- Service area: ${e.areas.join(', ')}`, `- Website: ${seo.base}/`].filter(Boolean) as string[];
  return ['## Contact', '', ...items];
}

/** null = llms.txt is switched off (or the whole site is hidden from search engines). */
export function buildLlmsTxt(): string | null {
  const seo = getSeo();
  if (!seo.llms.enabled || seo.general.noindexSite) return null;
  const out = header(seo);
  const pages = publishedPages();
  if (pages.length) {
    out.push('', '## Pages', '');
    for (const p of pages) {
      const note = one(p.answer_summary || p.seo_description);
      out.push(`- [${one(p.title) || p.path || 'Home'}](${pageUrl(seo.base, p.path)})${note ? `: ${note}` : ''}`);
    }
  }
  const posts = publishedPosts();
  if (posts.length) {
    out.push('', '## Blog', '');
    for (const p of posts) {
      const note = one(p.answer_summary || p.seo_description || p.excerpt);
      out.push(`- [${one(p.title)}](${seo.base}/${p.slug})${note ? `: ${note}` : ''}`);
    }
  }
  out.push('', ...contact(seo), '');
  return out.join('\n');
}

/** Plain sentences found anywhere in a block of site copy (skips addresses, image paths and short labels). */
const flatText = (v: unknown, out: string[] = []): string[] => {
  if (typeof v === 'string') {
    if (v.length > 24 && /\s/.test(v) && !/^(\/|https?:)/.test(v)) out.push(v);
  } else if (Array.isArray(v)) v.forEach((x) => flatText(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => flatText(x, out));
  return out;
};

/** Data the dynamic widgets and the designed site blocks show on a page (products, projects, About / Standards copy) — flattened so the text exists for AI tools too. */
function widgetData(types: Set<string>, blocks: Set<string>): string[] {
  const out: string[] = [];
  if (types.has('products') || types.has('dm-products-catalog') || types.has('dm-product-grid') || blocks.has('products') || blocks.has('home')) {
    const rows = all<{ slug: string; name: string; category: string; description: string; specs: string }>("SELECT slug, name, category, description, specs FROM products WHERE published = 1 AND slug <> '' ORDER BY sort_order, id");
    if (rows.length) {
      out.push(rows.map((r) => {
        let opts = '';
        try { opts = (JSON.parse(r.specs || '[]') as { label: string; values: string[] }[]).map((x) => `${x.label}: ${x.values.join(', ')}`).join('; '); } catch { /* ignore */ }
        return `- **${one(r.name)}**${r.category ? ` (${one(r.category)})` : ''}${r.description ? `: ${one(r.description)}` : ''}${opts ? ` — ${one(opts)}` : ''}`;
      }).join('\n'));
    }
  }
  if (types.has('projects') || types.has('dm-projects-gallery') || blocks.has('projects')) {
    const rows = all<{ title: string; category: string; location: string; address: string }>('SELECT title, category, location, address FROM projects WHERE published = 1 ORDER BY sort_order, id');
    if (rows.length) out.push(rows.map((r) => `- ${one(r.title)}${[r.category, r.address || r.location].filter(Boolean).length ? ` — ${[r.category, r.address || r.location].filter(Boolean).map(one).join(', ')}` : ''}`).join('\n'));
  }
  if (blocks.has('about')) out.push(flatText(siteCopy.about).map((t) => one(t)).join('\n\n'));
  if (blocks.has('standards')) out.push(flatText(siteCopy.standards).map((t) => one(t)).join('\n\n'));
  return out.filter(Boolean);
}

const postText = (body: string) => (/<\s*(p|h[1-6]|ul|ol)\b/i.test(body) ? toMarkdown([{ type: 'text', props: { html: body } }]) : body.replace(/\r\n?/g, '\n').trim());

export function buildLlmsFull(): string | null {
  const seo = getSeo();
  if (!seo.llms.enabled || seo.general.noindexSite) return null;
  const out = [...header(seo), ''];
  for (const p of publishedPages()) {
    const doc = parseDoc(p.content);
    const types = new Set<string>();
    const blocks = new Set<string>();
    walk(doc.nodes, (n: { type: string; props?: Record<string, unknown> }) => {
      types.add(n.type);
      if (n.type === 'site-block') blocks.add(String(n.props?.block || 'home'));
    });
    const summary = one(p.answer_summary || p.seo_description);
    const body = toMarkdown(doc.nodes);
    const extra = widgetData(types, blocks);
    out.push(`---`, '', `# ${one(p.title) || 'Home'}`, '', `URL: ${pageUrl(seo.base, p.path)}`, '');
    if (summary) out.push(`> ${summary}`, '');
    if (body) out.push(body, '');
    for (const e of extra) out.push(e, '');
    if (extractContent(doc.nodes).words === 0 && !extra.length && !summary) out.push('_(no text content)_', '');
  }
  for (const p of publishedPosts()) {
    const summary = one(p.answer_summary || p.seo_description || p.excerpt);
    out.push('---', '', `# ${one(p.title)}`, '', `URL: ${seo.base}/${p.slug}`, `Published: ${p.published_at.slice(0, 10)}${p.author ? ` · By ${p.author}` : ''}`, '');
    if (summary) out.push(`> ${summary}`, '');
    const text = postText(p.body);
    if (text) out.push(text, '');
  }
  out.push('---', '', ...contact(seo), '');
  const text = out.join('\n');
  return text.length > MAX_FULL ? text.slice(0, MAX_FULL) + '\n\n_(truncated)_\n' : text;
}
