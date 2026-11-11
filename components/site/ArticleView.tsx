// A blog article on the public site (server component): the Dass Metal article design + the CMS comment thread and form.
import './site.css';
import './site-cms.css';
import PostCommentForm from '@/components/PostCommentForm';
import { getThread } from '@/lib/comments';
import { getAdjacentPosts, type PostCard } from '@/lib/content';
import { cardDate } from '@/lib/format';
import { stampToLocalDate } from '@/lib/post-time';
import { sanitizeRichHtml } from '@/lib/rich-html.mjs';
import { getSeo } from '@/lib/seo';
import { getPostsIndexCards, readMinutes } from '@/lib/site-data';
import ArticleBlock from './blocks/ArticleBlock.jsx';

const card = (p: PostCard) => ({ slug: p.slug, title: p.title, date: p.published_at.slice(0, 10), image: p.thumb, excerpt: p.excerpt });

export default function ArticleView({ post, preview = false }: { post: PostCard; preview?: boolean }) {
  // Bodies are sanitised when saved; once more here so nothing unexpected (older rows, imports) ever reaches the page.
  const html = sanitizeRichHtml(post.body);
  const { prev, next } = getAdjacentPosts(post);
  const more = getPostsIndexCards().filter((p) => p.slug !== post.slug).slice(0, 3);
  const thread = getThread(post.id);

  return (
    <ArticleBlock
      post={{ title: post.title, date: post.published_at.slice(0, 10), cover: post.cover_image, html, minutes: readMinutes(html), preview }}
      url={`${getSeo().base}/${post.slug}`}
      newer={next ? card(next) : null}
      older={prev ? card(prev) : null}
      more={more}
    >
      {(thread.length > 0 || !!post.comments_enabled) && (
        <section id="comments" className="comments" aria-labelledby="comments-h">
          <h2 id="comments-h" className="h2 h2--sm">{thread.length > 0 ? `${thread.length} comment${thread.length === 1 ? '' : 's'}` : 'Comments'}</h2>
          {thread.length > 0 && (
            <ol className="comments__list">
              {thread.map((c) => (
                <li key={c.id} id={`comment-${c.id}`} style={{ marginLeft: `${c.depth * 28}px` }}>
                  <div className="comments__head">
                    <strong>{c.author_name}</strong>
                    <span>{cardDate(stampToLocalDate(c.created_at))}</span>
                  </div>
                  {/* plain text only — React escapes it; line breaks are kept */}
                  <p>{c.body}</p>
                </li>
              ))}
            </ol>
          )}
          {post.comments_enabled && !preview ? (
            <div className="comments__form">
              <h3 className="h3">Leave a comment</h3>
              <PostCommentForm slug={post.slug} />
            </div>
          ) : !post.comments_enabled ? (
            <p className="muted">Comments are closed on this article.</p>
          ) : null}
        </section>
      )}
    </ArticleBlock>
  );
}
