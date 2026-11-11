// The Dass Metal design widgets (see lib/builder/defs/site.mjs for what each one lets an editor change).
// These wrappers run on the server for the public site and in the browser inside the builder canvas. They hand the client
// components only the props and the slice of data each needs (the product list is large, so it is slimmed per widget).
import type { ComponentType } from 'react';
import type { BuilderData, WidgetProps } from '@/lib/builder/types';
import { Editing } from '@/components/site/edit.jsx';
import { groupProducts } from '@/lib/product-menu.js';
import * as Content from '@/components/site/widgets/content.jsx';
import * as Bands from '@/components/site/widgets/bands.jsx';
import * as Data from '@/components/site/widgets/data.jsx';
import * as Contact from '@/components/site/widgets/contact.jsx';
import * as Chrome from '@/components/site/widgets/chrome.jsx';

type Pick = (d: BuilderData, p: Record<string, any>) => Record<string, any> | null;

/** One widget: its props `p`, plus whatever `pick` extracts from the loaded data. `pick` returning null renders nothing. */
function make(Comp: any, pick?: Pick): ComponentType<WidgetProps> {
  return function DassMetalWidget({ node, ctx }: WidgetProps) {
    const p = node.props || {};
    const extra = pick ? pick(ctx.data, p) : {};
    if (!extra) return null;
    return (
      <Editing node={node} edit={ctx.edit}>
        <Comp p={p} {...extra} />
      </Editing>
    );
  };
}

const card = (x: any) => ({ slug: x.slug, name: x.name, image: x.image, description: x.description, category: x.category, group_title: x.group_title });
const forQuote = (x: any) => ({ slug: x.slug, name: x.name, image: x.image, category: x.category, specs: x.specs, custom_note: x.custom_note });
const company: Pick = (d) => (d.company ? { company: d.company } : null);

export const SITE_COMPONENTS: Record<string, ComponentType<WidgetProps>> = {
  'dm-hero-slider': make(Bands.DmHeroSlider),
  'dm-page-hero': make(Content.DmPageHero),
  'dm-facts': make(Content.DmFacts),
  'dm-ticker': make(Bands.DmTicker, (d) => ({ products: (d.products || []).map((x: any) => ({ name: x.name })) })),
  'dm-feature-row': make(Bands.DmFeatureRow),
  'dm-cta-band': make(Content.DmCtaBand),
  'dm-heading': make(Content.DmHeading),
  'dm-text': make(Content.DmText),
  'dm-image': make(Content.DmImage),
  'dm-button': make(Content.DmButton),
  'dm-quote': make(Content.DmQuote),
  'dm-icon-list': make(Content.DmIconList),
  'dm-feature-cards': make(Content.DmFeatureCards),
  'dm-logos': make(Content.DmLogos),
  'dm-photo-strip': make(Content.DmPhotoStrip),
  'dm-standards-table': make(Content.DmStandardsTable),
  'dm-notice': make(Content.DmNotice, company),
  'dm-product-grid': make(Data.DmProductGrid, (d) => ({ products: (d.products || []).map(card) })),
  'dm-products-catalog': make(Data.DmProductsCatalog, (d) => ({ products: (d.products || []).map(card) })),
  'dm-post-grid': make(Data.DmPostGrid, (d) => ({ posts: d.postsIndex || [] })),
  'dm-blog-index': make(Data.DmBlogIndex, (d) => ({ posts: d.postsIndex || [] })),
  'dm-projects-gallery': make(Data.DmProjectsGallery, (d) => {
    const pr = d.projects;
    const all = pr ? [...pr.featured, ...pr.others].sort((a: any, b: any) => a.sort_order - b.sort_order || a.id - b.id) : [];
    return { projects: all.filter((x: any) => x.images.length).map((x: any) => ({ title: x.title, location: x.location, images: x.images.map((src: string) => ({ src })) })) };
  }),
  'dm-contact-info': make(Contact.DmContactInfo, company),
  'dm-quote-form': make(Contact.DmQuoteForm, (d) => (d.company ? { company: d.company, products: (d.products || []).map(forQuote) } : null)),
  'dm-topbar': make(Chrome.DmTopbar, company),
  'dm-header': make(Chrome.DmHeader, (d) => (d.company ? { company: d.company, menu: groupProducts(d.products || []).map((c: any) => ({ title: c.title, groups: c.groups.map((g: any) => ({ title: g.title, items: g.items.map((x: any) => ({ slug: x.slug, name: x.name })) })) })) } : null)),
  'dm-footer': make(Chrome.DmFooter, company),
};
