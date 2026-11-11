// Starter content for a NEW Dass Metal database (used by `npm run seed`). The words come from https://dassmetal.com/.

/** Site settings (Studio CMS > Settings). Only added where the key is still missing, so re-running never overwrites an edit. */
export const SETTINGS = {
  site_title: 'Dass Metal Products',
  site_tagline: 'Steel Studs & Metal Framing',
  site_favicon: '/favicon.png',
  site_logo: '/images/logo-white.png',
  contact_phone: '905 677 0456',
  contact_phone2: '905 678 6587',
  contact_email: 'sales@dassmetal.com',
  contact_hours: 'Monday–Friday 08:00 AM – 05:00 PM',
  contact_address: '370 New Enterprise Way\nVaughan, ON L4H 0S8',
  contact_map_url: 'https://maps.app.goo.gl/68EZvmxqzYeVbvPHA',
  social_facebook: 'https://www.facebook.com/dassmetal/',
  social_instagram: 'https://www.instagram.com/dassmetal/',
  social_linkedin: 'https://ca.linkedin.com/company/dassmetal',
  holiday_notice: 'Dass Metal office will be closed on: Thursday, December 25 | Friday, December 26 | Thursday, January 1',
  notify_emails: 'sales@dassmetal.com',
};

/**
 * How the products are organised (the same grouping as the live site's menu). The order here becomes each product's "Order" in the admin.
 * An empty group title means the category has no sub-groups.
 */
export const PRODUCT_MENU = [
  {
    category: 'Interior Framing',
    groups: [
      ['Steel Stud Framing System', ['non-load-bearing-steel-framing-light-gauge', 'slotted-deflection-track', 'deep-track', 'u-flex-track', 'webslide-clip']],
      ['Accessory Products', ['furring-channel', 'z-bar', 'resilient-channel']],
      ['Utility Angles & Flat Strap', ['flat-strips']],
      ['Clips & Connectors Range', ['hanger-wire', 'tie-wire']],
    ],
  },
  {
    category: 'Exterior Structural Framing',
    groups: [
      ['Structural Steel Framing', ['load-bearing-stud-framing-system-heavy-gauge', 'standard-track', 'deflection-side-clip', 'windbrace', 'shaftwall-ch-stud']],
      ['Structural Angles & Flat Strip', ['special-profiles', 'l-track']],
    ],
  },
  {
    category: 'Drywall Finishing Sections',
    groups: [
      ['Architectural Finishing', ['l-trim', 'j-trim', 'j-track']],
      ['Corner Beads', ['90-130-cornerbead']],
    ],
  },
  { category: 'Acoustic Products', groups: [['', ['bridging-carrying-channel', 'bridging-clip']]] },
  { category: 'Dass Rebar', groups: [['', ['rebar', 'welded-wire-mesh']]] },
];

/** The three posts the live home page features. */
export const FEATURED_POSTS = [
  'strengthening-industry-connections-at-dass-metal-dass-rebar-open-house',
  'dass-metal-at-the-buildings-show-2025-with-dass-rebar',
  'steel-studs-and-metal-framing-systems-for-every-build',
];

/** Search-engine text of the pages (from the live site). */
export const PAGE_SEO = {
  '': { title: 'Home', seoTitle: 'Steel Studs & Metal Framing | Dass Metal Products Ontario', seoDescription: 'Get quality steel studs, tracks, and framing systems made in Canada. Trusted by builders across Ontario for on-time delivery and precision.' },
  about: { title: 'About Us', seoDescription: 'We manufacture steel studs, tracks and drywall accessories and drywall solutions. Our metal products are CSSBI certified.' },
  'our-products': { title: 'Our Products', seoDescription: 'We provide tailored solutions, offering steel studs, track, channels and drywall accessories as required by clients to meet specific project requirements.' },
  standards: { title: 'Standards', seoDescription: 'Our product lines surpass design & engineering criteria, ensuring structural performance. Metal framing material, light gauge steel, framing.' },
  msds: { title: 'Material Safety Data Sheets (MSDS)', seoDescription: 'Access Material Safety Data Sheets (MSDS) for Dass Metal products. Ensure safety and compliance with detailed information.' },
  projects: { title: 'Our Projects', seoDescription: "Explore Dass Metal's showcase of excellence. Find out more about some of the fantastic projects we have been involved in the past." },
  blogs: { title: 'Blog', seoDescription: 'Explore our Metal Studs & Framing Tips blog for industry insights and expert advice. Stay informed on the latest trends and best practices.' },
  contact: { title: 'Contact Us', seoDescription: "Contact Dass Metal for all your metal needs. Whether it's a quote or inquiry, our team is ready to assist." },
};

/** page path -> which designed block it shows (see components/site/blocks). */
export const PAGE_BLOCKS = { '': 'home', about: 'about', 'our-products': 'products', standards: 'standards', msds: 'msds', projects: 'projects', blogs: 'blogs', contact: 'contact' };
