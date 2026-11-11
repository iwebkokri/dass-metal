'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/site-helpers.mjs';
import { CtaBand, Icon, PostCard, SlotBar } from '../ui.jsx';

/**
 * A blog article. `html` is already sanitised on the server (lib/rich-html.mjs); `url` is the article's absolute address for sharing.
 * newer / older / more are card data ({ slug, title, date, image, excerpt }).
 */
export default function ArticleBlock({ post, url, newer, older, more = [], children }) {
  const enc = encodeURIComponent;
  const share = [
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, I: Icon.Facebook },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, I: Icon.Linkedin },
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(post.title)}`, I: Icon.X },
  ];

  return (
    <>
      <section className="page-hero page-hero--post">
        <div className="container page-hero__inner">
          <nav aria-label="Breadcrumb" className="crumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blogs">Blogs</Link></li>
              <li aria-current="page">{post.title}</li>
            </ol>
          </nav>
          <h1 className="page-hero__title page-hero__title--post">{post.title}</h1>
          <p className="post-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.minutes} min read</span>
            {post.preview && <><span aria-hidden="true">·</span><strong>Preview — not published</strong></>}
          </p>
        </div>
        <SlotBar className="slot-bar--bottom" />
      </section>

      <article className="section post">
        <div className="container container--narrow">
          {post.cover && <img className="post__cover" src={post.cover} alt="" decoding="async" />}
          <div className="prose prose--post" dangerouslySetInnerHTML={{ __html: post.html }} />

          <aside className="share" aria-label="Share this article">
            <strong>Share on:</strong>
            <ul>
              {share.map(({ name, href, I }) => (
                <li key={name}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${name}`}><I width={18} height={18} /></a></li>
              ))}
            </ul>
          </aside>

          <nav className="post-nav" aria-label="More articles">
            {newer ? <Link href={`/${newer.slug}`} rel="prev"><span className="tag">Newer</span>{newer.title}</Link> : <span />}
            {older ? <Link href={`/${older.slug}`} rel="next" className="post-nav__next"><span className="tag">Older</span>{older.title}</Link> : <span />}
          </nav>

          {children}
        </div>
      </article>

      {more.length > 0 && (
        <section className="section band-light">
          <div className="container stack-40">
            <h2 className="h2 h2--sm">Keep reading</h2>
            <div className="card-grid card-grid--300 gap-24">
              {more.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
