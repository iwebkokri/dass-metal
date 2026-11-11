import { headers } from 'next/headers';
import PageShell from '@/components/builder/PageShell';
import NotFoundBlock from '@/components/site/NotFoundBlock.jsx';
import { log404 } from '@/lib/seo-log';

export default async function NotFound() {
  // Every public "page not found" ends up here (the catch-all page, a missing article, …): record it for SEO → 404 monitor.
  const h = await headers();
  if (h.get('x-dr-surface') === 'site') log404(h.get('x-dr-path') ?? '', h.get('referer') ?? '');
  return (
    <PageShell path="404" nodes={[]}>
      <NotFoundBlock />
    </PageShell>
  );
}
