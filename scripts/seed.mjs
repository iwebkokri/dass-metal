// Fill a NEW database with the Dass Metal content (products, projects, blog posts, pages, settings, media library, redirects).
//   npm run seed
// Safe to re-run: anything that already exists is left alone, so edits made in the admin are never overwritten.
//   npm run seed -- --reset-pages        rewrite every page, the header and the footer from the built-in design (settings, products, posts are still left alone)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { openDatabase, getDatabasePath } from '../lib/db-core.mjs';
import { slugify } from '../lib/slug.mjs';
import { sanitizeDoc } from '../lib/builder/sanitize.mjs';
import { sanitizeRichHtml, htmlToText } from '../lib/rich-html.mjs';
import { parseDoc, walk } from '../lib/builder/tree.mjs';
import { BLOCK_DOCS, PAGE_DOCS, footerDoc, headerDoc } from '../db/site-pages.mjs';
import { FEATURED_POSTS, PAGE_SEO, PRODUCT_MENU, SETTINGS } from '../db/seed-data.mjs';

const root = process.cwd();
const db = openDatabase();
const report = [];
const json = (file) => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
const resetPages = process.argv.includes('--reset-pages');

function tx(fn) {
  db.exec('BEGIN');
  try {
    fn();
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

// ---------------------------------------------------------------- settings
{
  const add = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  let n = 0;
  for (const [k, v] of Object.entries(SETTINGS)) n += Number(add.run(k, v).changes);
  report.push(`settings: ${n} added`);
}

// ---------------------------------------------------------------- products
{
  const products = json('db/content/products.json');
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const have = db.prepare('SELECT 1 FROM products WHERE slug = ?');
  const insert = db.prepare(
    `INSERT INTO products (slug, name, category, group_title, sort_order, published, description, image, gallery, specs, custom_note, desc_title, body, seo_description)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  let order = 0;
  let added = 0;
  const missing = [];
  tx(() => {
    for (const cat of PRODUCT_MENU) {
      for (const [group, slugs] of cat.groups) {
        for (const slug of slugs) {
          order += 10;
          const p = bySlug[slug];
          if (!p) { missing.push(slug); continue; }
          if (have.get(slug)) continue;
          insert.run(
            slug, p.title, cat.category, group, order,
            String(p.excerpt || '').slice(0, 400),
            p.image,
            JSON.stringify(p.galleryFull?.length ? p.galleryFull : p.gallery),
            JSON.stringify(p.specs || []),
            p.custom || '',
            p.descTitle || '',
            sanitizeRichHtml(p.descHtml || ''),
            String(p.seoDescription || '').slice(0, 320)
          );
          added++;
        }
      }
    }
  });
  report.push(`products: ${added} added${missing.length ? ` (MISSING in products.json: ${missing.join(', ')})` : ''}`);
}

// ---------------------------------------------------------------- projects
{
  const projects = json('db/content/projects.json');
  const have = db.prepare('SELECT 1 FROM projects WHERE slug = ?');
  const insert = db.prepare('INSERT INTO projects (slug, title, location, images, featured, sort_order, published) VALUES (?, ?, ?, ?, 1, ?, 1)');
  let added = 0;
  const used = new Set();
  tx(() => {
    projects.forEach((p, i) => {
      // several projects share a name ("Storage Units"): the place makes the address unique
      let slug = slugify(`${p.title} ${p.location}`.replace(/,.*$/, '')) || `project-${i + 1}`;
      for (let n = 2; used.has(slug); n++) slug = `${slugify(p.title)}-${slugify(p.location.split(',')[0])}-${n}`;
      used.add(slug);
      if (have.get(slug)) return;
      insert.run(slug, p.title, p.location, JSON.stringify(p.images.map((x) => x.src)), (i + 1) * 10);
      added++;
    });
  });
  report.push(`projects: ${added} added`);
}

// ---------------------------------------------------------------- blog posts
{
  const dir = path.join(root, 'db', 'content', 'posts');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  const have = db.prepare('SELECT 1 FROM posts WHERE slug = ?');
  const insert = db.prepare(
    `INSERT INTO posts (slug, title, category, excerpt, body, cover_image, external_url, published_at, status, featured, comments_enabled, seo_description)
     VALUES (?, ?, '', ?, ?, ?, '', ?, 'published', ?, 0, ?)`
  );
  let added = 0;
  tx(() => {
    for (const f of files) {
      const p = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
      if (!p.slug || have.get(p.slug)) continue;
      const body = sanitizeRichHtml(p.html);
      let excerpt = htmlToText(body).slice(0, 190);
      if (excerpt.length >= 190) excerpt = excerpt.replace(/\s+\S*$/, '') + '…';
      insert.run(
        p.slug, p.title, excerpt, body, p.image || '',
        `${p.date} 14:00:00`, // UTC; mid-afternoon keeps the date the same in Toronto
        FEATURED_POSTS.includes(p.slug) ? 1 : 0,
        String(p.description || '').slice(0, 300)
      );
      added++;
    }
  });
  report.push(`posts: ${added} added (of ${files.length} files)`);
}

// ---------------------------------------------------------------- pages, header and footer
// Every public page is a real page-builder document (section > row > column > widgets), so each section, row, text, image and link
// can be edited in the builder. What a run does to a page:
//   - missing                       -> created
//   - still the old one-widget "site-block" page -> converted in place. Sections an editor added around it are kept, and the old
//                                  version is stored as a revision (builder > Page tab > Revisions) so it can be restored
//   - already converted / edited    -> left alone (your edits are never overwritten)        --reset-pages rewrites them all
{
  const clean = (nodes) => sanitizeDoc({ v: 1, nodes }, { isAdmin: true }).doc;
  const read = db.prepare('SELECT id, title, content FROM pages WHERE path = ?');
  const revise = db.prepare("INSERT INTO revisions (entity, entity_id, title, content, note) VALUES (?, ?, ?, ?, ?)");
  let created = 0;
  let converted = 0;
  let rewritten = 0;
  tx(() => {
    for (const [pagePath, build] of Object.entries(PAGE_DOCS)) {
      const seo = PAGE_SEO[pagePath];
      const existing = read.get(pagePath);
      if (!existing) {
        db.prepare("INSERT INTO pages (path, title, status, layout, content, seo_title, seo_description, published_at) VALUES (?, ?, 'published', 'default', ?, ?, ?, datetime('now'))")
          .run(pagePath, seo.title, JSON.stringify(clean(build())), seo.seoTitle || '', seo.seoDescription || '');
        created++;
        continue;
      }
      const old = parseDoc(existing.content);
      if (resetPages) {
        revise.run('page', existing.id, existing.title, existing.content, 'Before the built-in design was restored');
        db.prepare("UPDATE pages SET content = ?, updated_at = datetime('now') WHERE id = ?").run(JSON.stringify(clean(build())), existing.id);
        rewritten++;
        continue;
      }
      // convert each top-level section that holds an old "site-block" widget
      let changed = false;
      const nodes = old.nodes.flatMap((sec) => {
        let key = null;
        walk([sec], (n) => { if (n.type === 'site-block') { key = n.props?.block; return false; } return true; });
        if (!key || !BLOCK_DOCS[key]) return [sec];
        changed = true;
        return BLOCK_DOCS[key]();
      });
      if (changed) {
        revise.run('page', existing.id, existing.title, existing.content, 'Before the page was converted into editable sections');
        db.prepare("UPDATE pages SET content = ?, updated_at = datetime('now') WHERE id = ?").run(JSON.stringify(clean(nodes)), existing.id);
        converted++;
      }
    }

    // header and footer: only created when the site has none (an existing one is the editor's to change)
    const tpl = (kind, name, build) => {
      const have = db.prepare('SELECT id FROM templates WHERE kind = ? ORDER BY active DESC, id DESC LIMIT 1').get(kind);
      const content = JSON.stringify(clean(build()));
      if (!have) { db.prepare('INSERT INTO templates (kind, name, content, active) VALUES (?, ?, ?, 1)').run(kind, name, content); return 'created'; }
      if (resetPages) {
        revise.run('template', have.id, name, db.prepare('SELECT content FROM templates WHERE id = ?').get(have.id).content, 'Before the built-in design was restored');
        db.prepare("UPDATE templates SET content = ?, active = 1, updated_at = datetime('now') WHERE id = ?").run(content, have.id);
        return 'rewritten';
      }
      return 'kept';
    };
    report.push(`header: ${tpl('header', 'Dass Metal header', headerDoc)}`);
    report.push(`footer: ${tpl('footer', 'Dass Metal footer', footerDoc)}`);
  });
  report.push(`pages: ${created} created, ${converted} converted to editable sections, ${rewritten} rewritten`);
}

// ---------------------------------------------------------------- redirects
{
  const add = db.prepare('INSERT OR IGNORE INTO redirects (from_path, to_url, code, enabled) VALUES (?, ?, 301, 1)');
  let n = 0;
  for (const [from, to] of [['/products', '/our-products']]) n += Number(add.run(from, to).changes);
  report.push(`redirects: ${n} added`);
}

// ---------------------------------------------------------------- media library: register what ships in /public (the files stay where they are)
{
  const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.pdf': 'application/pdf' };
  const have = db.prepare('SELECT 1 FROM media WHERE url = ?');
  const insert = db.prepare("INSERT INTO media (url, storage, filename, original_name, mime, kind, size, title, folder) VALUES (?, 'public', ?, ?, ?, ?, ?, ?, ?)");
  let added = 0;
  function walk(dir, urlBase, skip = []) {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) {
        if (!skip.includes(name)) walk(full, `${urlBase}/${name}`, skip);
        continue;
      }
      const mime = MIME[path.extname(name).toLowerCase()];
      if (!mime) continue;
      const url = `${urlBase}/${name}`;
      if (have.get(url)) continue;
      const folder = urlBase.replace(/^\/(images|documents)\/?/, '') || (urlBase.includes('documents') ? 'documents' : '');
      insert.run(url, name, name, mime, mime === 'application/pdf' ? 'file' : 'image', statSync(full).size, name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), folder);
      added++;
    }
  }
  tx(() => {
    walk(path.join(root, 'public', 'images'), '/images', ['thumbs', 'icons']); // thumbnails and icon masks are derived files, not for picking
    walk(path.join(root, 'public', 'documents'), '/documents');
  });
  report.push(`media: ${added} registered`);
}

console.log(`Database: ${getDatabasePath()}`);
for (const line of report) console.log(`  ${line}`);
console.log('\nNext: create your admin login ->  npm run admin:create -- you@example.com');
