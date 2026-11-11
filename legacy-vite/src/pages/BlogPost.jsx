import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import posts from '../data/blog-index.json';
import { formatDate, usePageMeta } from '../lib/helpers.js';
import { CtaBand, Icon, PostCard, SlotBar } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

const indexOf = new Map(posts.map((p, i) => [p.slug, i]));

function Post({ slug }) {
  const i = indexOf.get(slug);
  const meta = posts[i];
  const [post, setPost] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let off = false;
    fetch(`/blog/${slug}.json`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d) => { if (!off) setPost(d); })
      .catch(() => { if (!off) setFailed(true); });
    return () => { off = true; };
  }, [slug]);

  usePageMeta(meta.title, post?.description || meta.excerpt);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const enc = encodeURIComponent;
  const share = [
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, I: Icon.Facebook },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, I: Icon.Linkedin },
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(meta.title)}`, I: Icon.X },
  ];

  // newer / older neighbours (index is sorted newest first) and a few more to read
  const newer = i > 0 ? posts[i - 1] : null;
  const older = i < posts.length - 1 ? posts[i + 1] : null;
  const more = posts.filter((_, n) => n !== i).slice(Math.max(0, i - 1), Math.max(0, i - 1) + 3);

  return (
    <>
      <section className="page-hero page-hero--post">
        <div className="container page-hero__inner">
          <nav aria-label="Breadcrumb" className="crumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li aria-current="page">{meta.title}</li>
            </ol>
          </nav>
          <h1 className="page-hero__title page-hero__title--post">{meta.title}</h1>
          <p className="post-meta">
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{meta.minutes} min read</span>
          </p>
        </div>
        <SlotBar className="slot-bar--bottom" />
      </section>

      <article className="section post">
        <div className="container container--narrow">
          {post ? (
            <>
              {post.image && <img className="post__cover" src={post.image} alt="" decoding="async" />}
              <div className="prose prose--post" dangerouslySetInnerHTML={{ __html: post.html }} />
            </>
          ) : failed ? (
            <p className="lead">Sorry — this article couldn’t be loaded. Please <Link to="/blogs">return to the blog</Link> and try again.</p>
          ) : (
            <div className="post__loading" role="status" aria-label="Loading article"><span /><span /><span /></div>
          )}

          <aside className="share" aria-label="Share this article">
            <strong>Share on:</strong>
            <ul>
              {share.map(({ name, href, I }) => (
                <li key={name}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${name}`}><I width={18} height={18} /></a></li>
              ))}
            </ul>
          </aside>

          <nav className="post-nav" aria-label="More articles">
            {newer ? <Link to={`/${newer.slug}`} rel="prev"><span className="tag">Newer</span>{newer.title}</Link> : <span />}
            {older ? <Link to={`/${older.slug}`} rel="next" className="post-nav__next"><span className="tag">Older</span>{older.title}</Link> : <span />}
          </nav>
        </div>
      </article>

      <section className="section band-light">
        <div className="container stack-40">
          <h2 className="h2 h2--sm">Keep reading</h2>
          <div className="card-grid card-grid--300 gap-24">
            {more.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

/** Live-site post URLs sit at the site root (/some-post-slug). Anything else is a 404. */
export default function BlogPost() {
  const { slug } = useParams();
  return indexOf.has(slug) ? <Post key={slug} slug={slug} /> : <NotFound />;
}
