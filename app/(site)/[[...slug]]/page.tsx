// Every public page is a builder document stored in the database. Home is slug [] ; /about is ['about'] ; nested paths work too.
// A single-segment address that is not a page is looked up as a blog article (/<article-slug>), then as a redirect.
// Static routes (admin, api, uploads, products/[slug]) take precedence over this catch-all.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/builder/PageShell';
import ArticleView from '@/components/site/ArticleView';
import { getCurrentUser } from '@/lib/auth';
import { nowUtc } from '@/lib/page-admin';
import { getPageByPath, normPath, pageDoc } from '@/lib/pages';
import { followRedirect } from '@/lib/site-redirect';
import { can } from '@/lib/roles';
import { getPostBySlug } from '@/lib/content';
import { pageJsonLd, pageMetadata, postJsonLd, postMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug?: string[] }>; searchParams: Promise<{ preview?: string }> };

async function load(slug: string[] | undefined, wantsPreview = false) {
  const path = normPath((slug || []).map(decodeURIComponent).join('/'));
  const user = await getCurrentUser();
  const preview = can(user, 'edit_pages');
  const page = getPageByPath(path, preview);
  // draft or scheduled (only editors get this far): shown, but never indexed
  const draft = !!page && (page.status !== 'published' || (!!page.published_at && page.published_at > nowUtc()));
  let post = null as ReturnType<typeof getPostBySlug>;
  let postPreview = false;
  if (!page && path && !path.includes('/')) {
    post = getPostBySlug(path);
    // ?preview=1: a signed-in author (or an editor of others' posts) also sees drafts and scheduled articles, never indexed
    if (!post && wantsPreview && user && can(user, 'edit_posts')) {
      const d = getPostBySlug(path, { preview: true });
      if (d && (d.author_id === user.id || can(user, 'edit_others_posts'))) {
        post = d;
        postPreview = true;
      }
    }
  }
  return { path, page, draft, post, postPreview };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { page, draft, post, postPreview } = await load((await params).slug, (await searchParams).preview === '1');
  if (post) return postMetadata(post as any, { preview: postPreview });
  if (!page) return { title: 'Page not found', robots: { index: false, follow: false } };
  return pageMetadata(page, { draft });
}

export default async function Page({ params, searchParams }: Props) {
  const { path, page, draft, post, postPreview } = await load((await params).slug, (await searchParams).preview === '1');
  if (!page && post) {
    return (
      <PageShell path={post.slug} nodes={[]} edit={{ label: 'Edit this post', href: `/admin/posts/${post.id}` }} jsonld={postPreview ? [] : postJsonLd({ ...(post as any), tags: post.tags })}>
        <ArticleView post={post} preview={postPreview} />
      </PageShell>
    );
  }
  if (!page) {
    followRedirect(path);
    notFound(); // (the 404 page records the hit for SEO → 404 monitor)
  }
  const nodes = pageDoc(page).nodes;
  return <PageShell path={page.path} nodes={nodes} layout={page.layout} page={page} jsonld={draft ? [] : pageJsonLd(page, nodes)} />;
}
