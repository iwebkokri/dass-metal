import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import posts from '../data/blog-index.json';
import { usePageMeta } from '../lib/helpers.js';
import { CtaBand, Icon, PageHero, PostCard } from '../components/ui.jsx';

const PER_PAGE = 12;

function pageWindow(cur, total) {
  const set = new Set([1, total, cur, cur - 1, cur + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push('…'); out.push(n); });
  return out;
}

export default function Blogs() {
  usePageMeta('Blog', 'Explore our Metal Studs & Framing Tips blog for industry insights and expert advice. Stay informed on the latest trends and best practices.');
  const [params, setParams] = useSearchParams();
  const urlQ = params.get('q') || '';

  // The box is driven by local state so typing is never dropped (router URL updates are applied as
  // deferred transitions); the URL follows a moment later so results stay shareable / back-button friendly.
  const [text, setText] = useState(urlQ);
  const written = useRef(urlQ);
  const q = text.trim();

  useEffect(() => {
    if (text === written.current) return undefined;
    const t = setTimeout(() => {
      written.current = text;
      const next = new URLSearchParams();
      if (text.trim()) next.set('q', text);
      setParams(next, { replace: true }); // a new search starts back on page 1
    }, 250);
    return () => clearTimeout(t);
  }, [text, setParams]);

  // the URL changed from outside (e.g. the "view all posts" link or the back button): show it in the box
  useEffect(() => {
    if (urlQ !== written.current) { written.current = urlQ; setText(urlQ); }
  }, [urlQ]);

  const searchPending = q !== urlQ.trim(); // typed, but the URL has not caught up yet
  const requested = searchPending ? 1 : Math.max(1, parseInt(params.get('page') || '1', 10) || 1);

  const filtered = useMemo(() => {
    if (!q) return posts;
    const needle = q.toLowerCase();
    return posts.filter((p) => `${p.title} ${p.excerpt}`.toLowerCase().includes(needle));
  }, [q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(requested, pages);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hrefFor = (n) => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (n > 1) next.set('page', String(n));
    const s = next.toString();
    return s ? `/blogs?${s}` : '/blogs';
  };
  const toTop = () => document.getElementById('posts')?.scrollIntoView({ behavior: 'auto', block: 'start' });

  return (
    <>
      <PageHero title="Our Blog" lead="Metal studs & framing tips, product guides and company news." />

      <section className="section" id="posts">
        <div className="container stack-48">
          <div className="blog-tools">
            <form role="search" className="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="blog-search" className="sr-only">Search the blog</label>
              <Icon.Search />
              <input
                id="blog-search"
                type="search"
                placeholder="Search posts"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </form>
            <p className="muted" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}{q ? ` matching “${q}”` : ''}
            </p>
          </div>

          {slice.length ? (
            <div className="card-grid card-grid--300 gap-24">
              {slice.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
            </div>
          ) : (
            <p className="lead">No posts match “{q}”. Try a different word, or <Link to="/blogs">view all posts</Link>.</p>
          )}

          {pages > 1 && (
            <nav className="pager" aria-label="Blog pages">
              {page > 1 ? <Link className="pager__step" to={hrefFor(page - 1)} onClick={toTop} rel="prev">Previous</Link> : <span className="pager__step is-disabled" aria-disabled="true">Previous</span>}
              <ol>
                {pageWindow(page, pages).map((n, i) => (
                  <li key={`${n}-${i}`}>
                    {n === '…' ? <span className="pager__gap">…</span> : (
                      <Link to={hrefFor(n)} onClick={toTop} aria-current={n === page ? 'page' : undefined} className={n === page ? 'is-current' : ''}>{n}</Link>
                    )}
                  </li>
                ))}
              </ol>
              {page < pages ? <Link className="pager__step" to={hrefFor(page + 1)} onClick={toTop} rel="next">Next</Link> : <span className="pager__step is-disabled" aria-disabled="true">Next</span>}
            </nav>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
