import { useEffect } from 'react';
import imageMap from '../data/image-map.json';

/** Resolve an original upload path ("2025/07/foo.jpg") to the optimised local file. */
export const img = (rel) => imageMap[rel] || `/images/${rel}`;

/** "2026-04-17" -> "April 17, 2026" (parsed as a local date so it never shifts a day). */
export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

const SITE = 'Dass Metal Products';
const DEFAULT_DESC =
  'Get quality steel studs, tracks, and framing systems made in Canada. Trusted by builders across Ontario for on-time delivery and precision.';

/** Sets <title> and the meta description for the current page. */
export function usePageMeta(title, description = DEFAULT_DESC) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `Steel Studs & Metal Framing | ${SITE}`;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }, [title, description]);
}
