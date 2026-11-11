// Small helpers shared by the public site components (client- and server-safe).
import imageMap from './image-map.json' with { type: 'json' };

/** Resolve an original upload path ("2025/07/foo.jpg") to the optimised local file. */
export const img = (rel) => imageMap[rel] || `/images/${rel}`;

/** "2026-04-17" (or "2026-04-17 14:00:00") -> "April 17, 2026", parsed as a local date so it never shifts a day. */
export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}
