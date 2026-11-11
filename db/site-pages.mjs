// The Dass Metal pages, header and footer as page-builder documents (section > row > column > widget).
//
// Used by the seed script (to create / convert the pages in the database) and by the old all-in-one "site-block" widget (so a page that
// has not been converted yet still renders). Node ids are deterministic ("hm001", "ab014" …) so the server and the browser agree.
// All words and pictures come from lib/site-content.mjs; the section colours / spacing here are ordinary builder settings, so editors
// can change every one of them in the Style tab.
import { WIDGETS, defaultProps } from '../lib/builder/schema.mjs';
import { about, footerDefaults, headerDefaults, home, standards } from '../lib/site-content.mjs';

const CHARCOAL = '#252932';
const LIGHT = '#E3E1DE';
const PAPER = '#F3F2F0';

/** Node factory with ids that are unique inside one document (prefix + counter). */
function builder(prefix) {
  let n = 0;
  const node = (type, props = {}, children) => {
    const def = WIDGETS[type];
    if (!def) throw new Error(`Unknown widget type: ${type}`);
    const out = { id: prefix + (++n).toString(36).padStart(3, '0'), type, props: { ...defaultProps(type), ...props } };
    if (def.container) out.children = children || [];
    return out;
  };
  const flat = (xs) => xs.flat().filter(Boolean);
  const section = (props, ...rows) => node('section', props, flat(rows));
  const row = (props, ...cols) => node('row', props, flat(cols));
  const col = (props, ...kids) => node('column', { span: { d: 12, t: 12, m: 12 }, ...props }, flat(kids));
  const w = new Proxy({}, { get: (_t, type) => (props) => node(String(type), props) });

  // ---- shapes the design uses over and over
  const pad = (d = 96, m = 64) => ({ d: { t: d, r: 0, b: d, l: 0 }, m: { t: m, r: 0, b: m, l: 0 } });
  const gap = (px) => ({ d: `${px}px` });
  /** A normal content band: boxed, 96px above and below (64px on phones), widgets stacked with a gap. */
  const band = (extra, stackGap, ...widgets) => section({ padding: pad(), ...extra }, row({}, col({ gap: gap(stackGap) }, ...widgets)));
  /** Edge-to-edge band with no padding (hero, photo bands, CTA). */
  const full = (extra, ...widgets) => section({ contentMode: 'full', ...extra }, row({}, col({ gap: gap(0) }, ...widgets)));
  /** Two columns side by side (stacked on phones). */
  const split = (rowProps, left, right, spans = [6, 6]) => row({ gap: gap(56), ...rowProps },
    col({ span: { d: spans[0], t: spans[0] === 12 ? 12 : 6, m: 12 }, gap: gap(28), ...(left.props || {}) }, ...left.kids),
    col({ span: { d: spans[1], t: spans[1] === 12 ? 12 : 6, m: 12 }, gap: gap(28), ...(right.props || {}) }, ...right.kids));
  return { section, row, col, w, pad, gap, band, full, split };
}

const para = (text) => `<p>${text}</p>`;
const cta = (b) => b.full({}, b.w['dm-cta-band']({}));
const hero = (b, title, lead) => b.full({}, b.w['dm-page-hero']({ title, lead: lead || '' }));

// ------------------------------------------------------------------------------------------------ Home
export function homeDoc() {
  const b = builder('hm');
  const { w, band, full, section, row, col, gap } = b;
  const { top, values, trusted, pillars, mission, panels, affiliates, slides, facts } = home;
  return [
    full({}, w['dm-hero-slider']({
      seconds: 7.5,
      srTitle: 'Dass Metal Products — Leading Manufacturers of Building Products',
      slides: slides.map((s) => ({
        eyebrow: s.eyebrow, title: s.title, text: s.text, image: s.image, position: s.position || '50% 50%', side: s.side === 'right' ? 'right' : 'left',
        cta1Label: s.ctas[0]?.label || '', cta1Url: s.ctas[0]?.to || '', cta2Label: s.ctas[1]?.label || '', cta2Url: s.ctas[1]?.to || '',
      })),
    })),
    full({}, w['dm-facts']({ items: facts.map((f) => ({ value: f.value, label: f.label })) })),
    full({}, w['dm-ticker']({})),
    band({ anchor: 'products' }, 48,
      w['dm-heading']({ eyebrow: 'Products', title: top.title, text: top.text, linkLabel: 'View all products', linkUrl: '/our-products', reveal: 'up' }),
      w['dm-product-grid']({ source: 'selected', size: 'compact', items: top.slugs.map((slug) => ({ slug })) })),
    band({ bgColor: CHARCOAL }, 48,
      w['dm-heading']({ eyebrow: 'What sets us apart', title: 'Why Dass Metal', tone: 'dark', reveal: 'up' }),
      w['dm-icon-list']({ variant: 'why', items: values.map((v) => ({ icon: v.icon, title: v.title, text: v.text })) })),
    band({ bgColor: LIGHT }, 48,
      w['dm-heading']({ eyebrow: 'Our promise', title: trusted.title, reveal: 'up' }),
      w['dm-feature-cards']({ items: trusted.cards.map((c) => ({ image: c.image, alt: c.alt, contain: !!c.contain, title: c.title, text: c.text })) })),
    band({}, 48,
      w['dm-icon-list']({ variant: 'pillar', items: pillars.map((p) => ({ icon: p.icon, title: p.title, text: p.text })) }),
      w['dm-quote']({ variant: 'mission', text: mission })),
    section({ contentMode: 'full', tag: 'section' }, row({}, col({ gap: gap(0) },
      panels.map((p, i) => w['dm-feature-row']({ label: p.label, title: p.title, text: p.text, buttonLabel: 'Learn More', url: p.to, image: p.image, alt: p.alt, flip: i % 2 === 1, tone: i % 2 === 1 ? 'slate' : 'charcoal' }))))),
    band({}, 48,
      w['dm-heading']({ eyebrow: 'News & insights', title: 'Our Blogs', linkLabel: 'See More', linkUrl: '/blogs', reveal: 'up' }),
      w['dm-post-grid']({ source: 'featured', limit: 3 })),
    band({ bgColor: PAPER, anchor: 'affiliated' }, 40,
      w['dm-heading']({ eyebrow: 'The JDass family', title: 'Affiliated Companies', reveal: 'up' }),
      w['dm-logos']({ variant: 'row', label: 'Affiliated companies', items: affiliates.map((a) => ({ name: a.name, logo: a.logo, href: a.href })) })),
    cta(b),
  ];
}

// ------------------------------------------------------------------------------------------------ About
export function aboutDoc() {
  const b = builder('ab');
  const { w, band, section, row, col, gap, split } = b;
  const { intro, story, brands, team, memberships } = about;
  return [
    hero(b, 'About Us', intro.text),
    band({}, 48,
      w['dm-heading']({ eyebrow: 'Our experience', title: intro.title, reveal: 'up' }),
      w['dm-photo-strip']({ items: intro.photos.map((p) => ({ src: p.src, alt: p.alt })) })),
    section({ padding: b.pad(), bgColor: LIGHT },
      split({ rowAlign: 'center' },
        { kids: [w['dm-heading']({ eyebrow: 'Our story', title: story.title, spacing: 'loose', reveal: 'left' }), ...story.paragraphs.map((t) => w['dm-text']({ html: para(t), ink: 'strong', reveal: 'left' }))] },
        { kids: [w['dm-image']({ src: story.image, alt: story.imageAlt, variant: 'tall', reveal: 'right' })] }),
      row({}, col({}, w['dm-quote']({ variant: 'note', text: story.present, reveal: 'up' })))),
    band({ anchor: 'diversebrands' }, 48,
      w['dm-heading']({ eyebrow: 'JDass Corp', title: brands.title, reveal: 'up' }),
      w['dm-logos']({ variant: 'wall', label: 'JDass brands', items: brands.items.map((x) => ({ name: x.name, logo: x.logo, href: x.href || '' })) })),
    section({ padding: b.pad(), bgColor: CHARCOAL },
      split({ rowAlign: 'center' },
        { kids: [w['dm-heading']({ eyebrow: 'Our team', title: team.title, tone: 'dark', reveal: 'left' })] },
        { props: { gap: gap(20) }, kids: team.paragraphs.map((t) => w['dm-text']({ html: para(t), variant: 'lead', tone: 'dark', reveal: 'right' })) })),
    band({}, 48,
      w['dm-heading']({ eyebrow: 'Industry associations', title: memberships.title, reveal: 'up' }),
      w['dm-logos']({ variant: 'wall', label: 'Memberships', items: memberships.items.map((x) => ({ name: x.name, logo: x.logo, href: '' })) })),
    cta(b),
  ];
}

// ------------------------------------------------------------------------------------------------ Products
export function productsDoc() {
  const b = builder('pr');
  const { w, section, row, col, gap, split } = b;
  return [
    hero(b, 'Our Products'),
    section({ padding: b.pad() },
      split({ rowAlign: 'start' },
        { kids: [w['dm-heading']({ eyebrow: '', title: 'Meeting Your Customized Needs is Our Top Priority', reveal: 'up' })] },
        { kids: [w['dm-text']({ variant: 'lead', reveal: 'up', html: para('Our goal is to expand the range of goods made at our manufacturing facility, as well as to create new items for existing markets and expand into new ones. Our long-term objective is to grow our company into multiple important sectors.') })] }),
      row({ margin: { d: { t: 48, r: 0, b: 0, l: 0 } } }, col({}, w['dm-products-catalog']({ allLabel: 'All', filterLabel: 'Filter products by category' })))),
    cta(b),
  ];
}

// ------------------------------------------------------------------------------------------------ Standards
export function standardsDoc() {
  const b = builder('st');
  const { w, section, split } = b;
  return [
    hero(b, 'Standards'),
    section({ padding: b.pad() },
      split({},
        { kids: [
          w['dm-image']({ src: standards.badge, alt: 'CSSBI member', variant: 'badge', reveal: 'left' }),
          w['dm-heading']({ eyebrow: 'Design & engineering', title: standards.title, size: 'small', spacing: 'loose', reveal: 'left' }),
          w['dm-text']({ html: para(standards.text), reveal: 'left' }),
          w['dm-button']({ label: 'Contact Us', url: '/contact', style: 'accent', size: 'lg' }),
        ] },
        { kids: [
          w['dm-standards-table']({ caption: 'ASTM standards that Dass Metal products meet or exceed', headCode: 'Standard', headCovers: 'Covers', items: standards.list.map((s) => ({ code: s.code, covers: s.covers })) }),
          w['dm-image']({ src: standards.photo, alt: 'Steel studs framed to specification at a Dass Metal project', variant: 'photo', reveal: 'right' }),
        ] })),
    cta(b),
  ];
}

// ------------------------------------------------------------------------------------------------ MSDS
export function msdsDoc() {
  const b = builder('ms');
  const { w, section, row, col } = b;
  return [
    hero(b, 'Material Safety Data Sheets (MSDS)'),
    section({ padding: b.pad(), boxWidth: { d: '820px' } }, row({}, col({}, w['dm-notice']({})))),
  ];
}

// ------------------------------------------------------------------------------------------------ Projects
export function projectsDoc() {
  const b = builder('pj');
  const { w, band } = b;
  return [
    hero(b, 'Our Projects', 'Find out more about some of the fantastic projects we have been involved in the past.'),
    band({}, 48, w['dm-projects-gallery']({})),
    cta(b),
  ];
}

// ------------------------------------------------------------------------------------------------ Blog
export function blogsDoc() {
  const b = builder('bl');
  const { w, band } = b;
  return [
    hero(b, 'Our Blog', 'Metal studs & framing tips, product guides and company news.'),
    band({ anchor: 'posts' }, 48, w['dm-blog-index']({ placeholder: 'Search posts', perPage: 12 })),
    cta(b),
  ];
}

// ------------------------------------------------------------------------------------------------ Contact
export function contactDoc() {
  const b = builder('ct');
  const { w, section, row, col, gap } = b;
  return [
    hero(b, 'Contact Us', 'We look forward to serving you. Interested in seeing what we can do for your business?'),
    section({ padding: b.pad() },
      row({ gap: { d: '72px', t: '40px' }, rowAlign: 'start' },
        col({ span: { d: 5, t: 12, m: 12 }, gap: gap(28) }, w['dm-contact-info']({})),
        col({ span: { d: 7, t: 12, m: 12 } }, w['dm-quote-form']({})))),
  ];
}

// ------------------------------------------------------------------------------------------------ Header & footer templates
export function headerDoc() {
  const b = builder('hd');
  const { w, section, row, col, gap } = b;
  const none = { d: { t: 0, r: 0, b: 0, l: 0 } };
  return [
    section({ tag: 'div', contentMode: 'full', padding: none }, row({}, col({ gap: gap(0) }, w['dm-topbar']({})))),
    // the section (not the widget) is what sticks to the top of the page
    section({ tag: 'div', contentMode: 'full', padding: none, cssClass: 'dm-sticky' }, row({}, col({ gap: gap(0) }, w['dm-header']({ ...headerDefaults })))),
  ];
}

export function footerDoc() {
  const b = builder('ft');
  const { w, section, row, col, gap } = b;
  return [section({ tag: 'div', contentMode: 'full', padding: { d: { t: 0, r: 0, b: 0, l: 0 } } }, row({}, col({ gap: gap(0) }, w['dm-footer']({ ...footerDefaults }))))];
}

/** page path ('' = home) -> the function that builds its document. */
export const PAGE_DOCS = {
  '': homeDoc, about: aboutDoc, 'our-products': productsDoc, standards: standardsDoc, msds: msdsDoc, projects: projectsDoc, blogs: blogsDoc, contact: contactDoc,
};

/** The old all-in-one block key ('home', 'about' …) -> its document. */
export const BLOCK_DOCS = { home: homeDoc, about: aboutDoc, products: productsDoc, standards: standardsDoc, msds: msdsDoc, projects: projectsDoc, blogs: blogsDoc, contact: contactDoc };
