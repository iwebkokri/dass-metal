// Server-side helpers that turn database rows into the small objects the Dass Metal public components use.
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { all } from './db';
import { nowStamp } from './post-time';

let thumbs: Set<string> | null = null;

/** Blog cards use a small thumbnail when one was generated for the post (public/images/thumbs/<slug>.webp); otherwise the cover photo. */
export function postThumb(slug: string, cover: string): string {
  if (!thumbs) {
    try {
      thumbs = new Set(readdirSync(path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'images', 'thumbs')));
    } catch {
      thumbs = new Set();
    }
  }
  return thumbs.has(`${slug}.webp`) ? `/images/thumbs/${slug}.webp` : cover;
}

export type PostCardData = { slug: string; title: string; date: string; image: string; excerpt: string; featured: boolean };

/** Every published post as a light card (no body) — the blog list searches and pages through these in the browser. */
export function getPostsIndexCards(): PostCardData[] {
  return all<{ slug: string; title: string; excerpt: string; cover_image: string; published_at: string; featured: number }>(
    `SELECT slug, title, excerpt, cover_image, published_at, featured FROM posts
      WHERE status = 'published' AND external_url = '' AND published_at <= ? ORDER BY published_at DESC, id DESC`,
    nowStamp()
  ).map((p) => ({ slug: p.slug, title: p.title, date: p.published_at.slice(0, 10), image: postThumb(p.slug, p.cover_image), excerpt: p.excerpt, featured: !!p.featured }));
}

/** Reading time in minutes for an HTML body (about 210 words a minute). */
export function readMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 210));
}
