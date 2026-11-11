'use client';

// Widgets whose content comes from the admin lists (products, posts, projects). Their cards and galleries are built from the
// database; what is edited here is which items to show and the labels around them.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { groupProducts } from '@/lib/product-menu.js';
import { Icon, PostCard, ProductCard } from '../ui.jsx';
import { Reveal } from '../Reveal.jsx';
import Lightbox from '../Lightbox.jsx';
import { list, useEditAttrs } from '../edit.jsx';

export function DmProductGrid({ p, products = [] }) {
  const { editing } = useEditAttrs();
  const bySlug = Object.fromEntries(products.map((x) => [x.slug, x]));
  let shown;
  if (p.source === 'category') shown = products.filter((x) => (x.category || '').toLowerCase() === String(p.category || '').trim().toLowerCase());
  else if (p.source === 'all') shown = products;
  else shown = list(p.items).map((it) => bySlug[it.slug]).filter(Boolean);
  if (p.source !== 'selected' && p.source !== undefined && Number(p.limit) > 0) shown = shown.slice(0, Number(p.limit));
  if (!shown.length) return editing ? <div className="dr-empty">Product cards — choose products in the panel →</div> : null;
  return (
    <div className={`card-grid ${p.size === 'standard' ? 'card-grid--300' : 'card-grid--home'} gap-24`}>
      {shown.map((pr, i) => <ProductCard key={pr.slug} product={pr} index={i} />)}
    </div>
  );
}

export function DmProductsCatalog({ p, products = [] }) {
  const all = p.allLabel || 'All';
  const [filter, setFilter] = useState(null); // null = everything
  const cats = useMemo(() => groupProducts(products).map((c) => ({ title: c.title, products: c.groups.flatMap((g) => g.items) })), [products]);
  const shown = filter === null ? cats : cats.filter((c) => c.title === filter);
  return (
    <div className="stack-48">
      <div className="filters" role="group" aria-label={p.filterLabel || 'Filter products by category'}>
        {[null, ...cats.map((c) => c.title)].map((t) => (
          <button key={t ?? '__all'} type="button" className={`filter ${filter === t ? 'is-active' : ''}`} aria-pressed={filter === t} onClick={() => setFilter(t)}>
            {t ?? all}
          </button>
        ))}
      </div>
      <div className="stack-48" aria-live="polite">
        {shown.map((c) => (
          <section key={c.title} aria-labelledby={`cat-${c.title.replace(/\W+/g, '-')}`}>
            <div className="cat-head">
              <h3 className="h3 h3--lg" id={`cat-${c.title.replace(/\W+/g, '-')}`}>{c.title}</h3>
              <span className="muted small">{c.products.length} {c.products.length === 1 ? 'product' : 'products'}</span>
            </div>
            <div className="card-grid card-grid--300 gap-24">
              {c.products.map((pr, i) => <ProductCard key={pr.slug} product={pr} index={i} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function DmPostGrid({ p, posts = [] }) {
  const { editing } = useEditAttrs();
  const featured = posts.filter((x) => x.featured);
  const pool = p.source !== 'latest' && featured.length ? featured : posts;
  const shown = pool.slice(0, Math.max(1, Number(p.limit) || 3));
  if (!shown.length) return editing ? <div className="dr-empty">Blog post cards — no posts published yet</div> : null;
  return (
    <div className="card-grid card-grid--300 gap-24">
      {shown.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
    </div>
  );
}

function pageWindow(cur, total) {
  const set = new Set([1, total, cur, cur - 1, cur + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push('…'); out.push(n); });
  return out;
}

/** Blog list with instant search and pagination over every published post (light index: no bodies). */
export function DmBlogIndex({ p, posts = [] }) {
  const perPage = Math.max(3, Number(p.perPage) || 12);
  const params = useSearchParams();
  // the box and the page number live in local state (so typing is never dropped); the address bar follows a moment later
  const [text, setText] = useState(params.get('q') || '');
  const [page, setPage] = useState(Math.max(1, parseInt(params.get('page') || '1', 10) || 1));
  const q = text.trim();

  const filtered = useMemo(() => {
    if (!q) return posts;
    const needle = q.toLowerCase();
    return posts.filter((x) => `${x.title} ${x.excerpt}`.toLowerCase().includes(needle));
  }, [q, posts]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * perPage, current * perPage);

  // keep the address bar in step (no navigation: it just makes the search / page shareable and survives a reload)
  useEffect(() => {
    const t = setTimeout(() => {
      const url = new URL(window.location.href);
      if (q) url.searchParams.set('q', text); else url.searchParams.delete('q');
      if (current > 1) url.searchParams.set('page', String(current)); else url.searchParams.delete('page');
      window.history.replaceState(window.history.state, '', url);
    }, 250);
    return () => clearTimeout(t);
  }, [text, q, current]);

  const go = (n) => {
    setPage(n);
    document.getElementById('posts')?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  return (
    <div className="stack-48">
      <div className="blog-tools">
        <form role="search" className="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="blog-search" className="sr-only">Search the blog</label>
          <Icon.Search />
          <input id="blog-search" type="search" placeholder={p.placeholder || 'Search posts'} value={text} onChange={(e) => { setText(e.target.value); setPage(1); }} />
        </form>
        <p className="muted" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}{q ? ` matching “${q}”` : ''}
        </p>
      </div>

      {slice.length ? (
        <div className="card-grid card-grid--300 gap-24">
          {slice.map((x, i) => <PostCard key={x.slug} post={x} index={i} />)}
        </div>
      ) : (
        <p className="lead">No posts match “{q}”. Try a different word, or <button type="button" className="linklike" onClick={() => { setText(''); setPage(1); }}>view all posts</button>.</p>
      )}

      {pages > 1 && (
        <nav className="pager" aria-label="Blog pages">
          {current > 1 ? <button type="button" className="pager__step" onClick={() => go(current - 1)} rel="prev">Previous</button> : <span className="pager__step is-disabled" aria-disabled="true">Previous</span>}
          <ol>
            {pageWindow(current, pages).map((n, i) => (
              <li key={`${n}-${i}`}>
                {n === '…' ? <span className="pager__gap">…</span> : (
                  <button type="button" onClick={() => go(n)} aria-current={n === current ? 'page' : undefined} className={n === current ? 'is-current' : ''}>{n}</button>
                )}
              </li>
            ))}
          </ol>
          {current < pages ? <button type="button" className="pager__step" onClick={() => go(current + 1)} rel="next">Next</button> : <span className="pager__step is-disabled" aria-disabled="true">Next</span>}
        </nav>
      )}
    </div>
  );
}

/** Every project that has photos, each with a click-to-enlarge gallery. */
export function DmProjectsGallery({ projects = [] }) {
  const [view, setView] = useState(null); // { project, index }
  const lastTrigger = useRef(null);

  const open = (project, index, el) => { lastTrigger.current = el; setView({ project, index }); };
  const close = () => { setView(null); lastTrigger.current?.focus(); };
  const step = (d) => setView((v) => v && ({ ...v, index: (v.index + d + v.project.images.length) % v.project.images.length }));

  const pr = view?.project;
  return (
    <>
      <div className="stack-48">
        {projects.map((proj, i) => (
          <Reveal as="article" className="project" key={`${proj.title}-${proj.location}-${i}`}>
            <header className="project__head">
              <span className="project__num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="h3 h3--lg">{proj.title}</h2>
                <p className="muted">{proj.location}</p>
              </div>
            </header>
            <ul className="project__grid" style={{ '--cols': proj.images.length === 4 ? 4 : proj.images.length >= 5 ? 3 : proj.images.length }}>
              {proj.images.map((im, n) => (
                <Reveal as="li" key={im.src} variant="scale" delay={n * 70}>
                  <button type="button" onClick={(e) => open(proj, n, e.currentTarget)} aria-label={`View photo ${n + 1} of ${proj.images.length}: ${proj.title}, ${proj.location}`}>
                    <img src={im.src} alt="" loading="lazy" decoding="async" />
                  </button>
                </Reveal>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <Lightbox
        items={pr ? pr.images.map((im, n) => ({ src: im.src, alt: `${pr.title}, ${pr.location} — photo ${n + 1}` })) : null}
        index={view?.index ?? 0}
        label={pr ? `${pr.title}, ${pr.location}` : 'Project photo'}
        caption={pr && <><strong>{pr.title}</strong> · {pr.location}</>}
        onClose={close}
        onStep={step}
      />
    </>
  );
}
