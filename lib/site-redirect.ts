// Follow a saved redirect (Studio CMS > Redirects) for an address that has no page of its own. Server only.
import { permanentRedirect, redirect } from 'next/navigation';
import { findRedirect } from './redirects';

/** Sends the visitor on when `path` (no leading slash, e.g. "products/old-name") has a redirect; otherwise returns so the caller can 404. */
export function followRedirect(path: string): void {
  const r = findRedirect(path);
  if (!r) return;
  const target = /^https?:\/\//i.test(r.to) || r.to.startsWith('/') ? r.to : `/${r.to}`;
  if (r.code === 301 || r.code === 308) permanentRedirect(target);
  redirect(target);
}
