// Server component: renders a builder page on the public site — header, content, footer — loading only the data it needs.
import { getCurrentUser } from '@/lib/auth';
import { can } from '@/lib/roles';
import { getActiveTemplate } from '@/lib/pages';
import { collectNeeds } from '@/lib/builder/tree.mjs';
import { loadBuilderData } from '@/lib/builder/data';
import type { BNode } from '@/lib/builder/types';
import { RenderDoc } from './Render';
import AdminBar from './AdminBar';
import Anim from './Anim';
import JsonLd from './JsonLd';
import Attribution from '@/components/site/Attribution';
import { SiteFooterBar, SiteHeaderBar } from '@/components/site/SiteChrome';
import PopupHost from '@/components/site/PopupHost';
import { popupsForPage } from '@/lib/popups';

type Props = {
  path: string;
  nodes: BNode[];
  layout?: 'default' | 'canvas';
  page?: { id: number; title: string; status: string };
  /** Admin-bar link for pages that are not builder pages (edit this product / post). */
  edit?: { label: string; href: string };
  /** Structured data (schema.org) objects, each output as its own application/ld+json script. */
  jsonld?: object[];
  /** Rendered between the page content and the footer (used by the post template). */
  after?: React.ReactNode;
  /** Rendered instead of the builder content when set (used by built-in pages like a single post). */
  children?: React.ReactNode;
};

export default async function PageShell({ path, nodes, layout = 'default', page, edit, jsonld, after, children }: Props) {
  const header = layout === 'canvas' ? null : getActiveTemplate('header');
  const footer = layout === 'canvas' ? null : getActiveTemplate('footer');
  const user = await getCurrentUser();
  // Popups for this page: the server filters by status / schedule / page rules / signed-in visitors; the browser decides when (PopupHost).
  const popups = popupsForPage(path, { signedIn: !!user, staff: !!user && can(user, 'edit_pages'), refs: JSON.stringify([nodes, header?.doc.nodes, footer?.doc.nodes]) });
  const needs = new Set<string>();
  for (const list of [nodes, header?.doc.nodes, footer?.doc.nodes, ...popups.map((p) => p.nodes)]) if (list) collectNeeds(list, needs);
  const ctx = { data: loadBuilderData(needs), path };

  return (
    <>
      {user && can(user, 'edit_pages') ? <AdminBar user={user} pageId={page?.id} title={page?.title} status={page?.status} edit={edit} /> : user ? <AdminBar user={user} edit={edit} /> : null}
      {/* .dm = the Dass Metal public design (components/site/site.css). A header / footer saved in the builder replaces the built-in ones. */}
      <div className="dm">
        {layout === 'canvas' ? null : header ? <RenderDoc nodes={header.doc.nodes} ctx={ctx} /> : <SiteHeaderBar />}
        <main id="main" tabIndex={-1}>
          {children ?? <RenderDoc nodes={nodes} ctx={ctx} />}
          {after}
        </main>
        {layout === 'canvas' ? null : footer ? <RenderDoc nodes={footer.doc.nodes} ctx={ctx} /> : <SiteFooterBar />}
      </div>
      {jsonld?.length ? <JsonLd data={jsonld} /> : null}
      <Anim />
      <Attribution />
      {popups.length ? <PopupHost items={popups.map((p) => ({ id: p.id, slug: p.slug, name: p.name, s: p.s, preview: p.preview, autoOk: p.autoOk, node: <RenderDoc nodes={p.nodes} ctx={ctx} /> }))} /> : null}
    </>
  );
}
