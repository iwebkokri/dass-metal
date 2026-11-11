// The Dass Metal design, as page-builder widgets. Every piece of text, image and link on the public site is a prop of one of these,
// so the whole page can be edited in the builder (panel on the left, or straight on the page: click text, double-click images / buttons).
//
// category 'dm'  -> the "Dass Metal" group in the Elements tab.   live: true -> data-driven, click selects (no inline editing).
// The generic Style / Advanced controls (padding, colours, animation, hide on mobile …) are added to every widget by schema.mjs.
import { o, ctl } from './helpers.mjs';

const REVEAL = ctl('select', 'reveal', 'Scroll animation', { tab: 'advanced', group: 'Motion', options: o(['', 'None'], ['up', 'Rise'], ['fade', 'Fade'], ['left', 'From the left'], ['right', 'From the right'], ['scale', 'Grow']) });
const TONE = ctl('select', 'tone', 'Colours', { options: o(['light', 'For a light background'], ['dark', 'For a dark background']), default: 'light' });
const band = (sel, label = 'Band colour') => ctl('color', 'bandBg', label, { tab: 'style', group: 'Colours', css: [{ sel, prop: 'background-color' }] });
const LINKFIELDS = (key, label) => [ctl('text', `${key}Label`, `${label} label`, { inline: true }), ctl('url', `${key}Url`, `${label} link`)];

const LOGO_ITEMS = (extra = {}) => ctl('repeater', 'items', 'Logos', {
  itemLabel: 'name', itemDefaults: { name: 'Company', logo: '', href: '' },
  fields: [ctl('text', 'name', 'Name (used as the picture description)'), ctl('image', 'logo', 'Logo'), ctl('url', 'href', 'Link (optional)')], ...extra,
});

export const SITE_WIDGETS = [
  // ------------------------------------------------------------------ hero & bands
  {
    type: 'dm-hero-slider', label: 'Hero slider', icon: 'image', category: 'dm',
    defaults: { seconds: 7.5, srTitle: '', slides: [{ eyebrow: 'Small heading', title: 'Slide headline', text: 'One or two sentences about this slide.', image: '', position: '50% 50%', side: 'left', cta1Label: 'Explore Products', cta1Url: '/our-products', cta2Label: '', cta2Url: '' }] },
    controls: [
      ctl('repeater', 'slides', 'Slides', {
        itemLabel: 'title',
        itemDefaults: { eyebrow: '', title: 'New slide', text: '', image: '', position: '50% 50%', side: 'left', cta1Label: '', cta1Url: '', cta2Label: '', cta2Url: '' },
        fields: [
          ctl('image', 'image', 'Background photo'),
          ctl('text', 'position', 'Photo focus point', { placeholder: '60% 40%', pattern: /^[\d.%\s-]{0,24}$/, help: 'Which part of the photo stays in view: across % then down %, e.g. 60% 40%.' }),
          ctl('select', 'side', 'Text side', { options: o(['left', 'Left'], ['right', 'Right']), default: 'left' }),
          ctl('text', 'eyebrow', 'Small heading', { inline: true }),
          ctl('text', 'title', 'Headline', { inline: true }),
          ctl('textarea', 'text', 'Text', { inline: true }),
          ...LINKFIELDS('cta1', 'Button 1'), ...LINKFIELDS('cta2', 'Button 2'),
        ],
      }),
      ctl('number', 'seconds', 'Seconds per slide', { min: 3, max: 30, step: 0.5, default: 7.5 }),
      ctl('text', 'srTitle', 'Page heading for search engines', { help: 'Not shown on the page; read by Google and screen readers.' }),
    ],
  },
  {
    type: 'dm-page-hero', label: 'Page title banner', icon: 'layers', category: 'dm',
    defaults: { title: 'Page title', lead: '', crumbs: [] },
    controls: [
      ctl('text', 'title', 'Title', { inline: true }),
      ctl('textarea', 'lead', 'Intro text', { inline: true }),
      ctl('repeater', 'crumbs', 'Breadcrumb steps between Home and this page', { itemLabel: 'label', itemDefaults: { label: 'Parent page', url: '/' }, fields: [ctl('text', 'label', 'Label'), ctl('url', 'url', 'Link')] }),
      band(' .page-hero'),
    ],
  },
  {
    type: 'dm-facts', label: 'Key facts strip', icon: 'hash', category: 'dm',
    defaults: { items: [{ value: '40+', label: 'Years of experience' }, { value: 'CSSBI', label: 'Certified' }] },
    controls: [ctl('repeater', 'items', 'Facts', { itemLabel: 'value', itemDefaults: { value: '100', label: 'Description' }, fields: [ctl('text', 'value', 'Number or word (numbers count up)', { inline: true }), ctl('text', 'label', 'Description', { inline: true })] })],
  },
  {
    type: 'dm-ticker', label: 'Product ticker', icon: 'star', category: 'dm', live: true, needs: ['products'],
    defaults: {},
    controls: [ctl('select', 'source', 'Scrolls', { options: o(['products', 'Every product name']), default: 'products', help: 'The names come from the Products list in the admin.' }), band(' .ticker')],
  },
  {
    type: 'dm-feature-row', label: 'Photo & message band', icon: 'image', category: 'dm',
    defaults: { label: 'About', title: 'Headline', text: 'A short paragraph.', buttonLabel: 'Learn More', url: '/about', image: '', alt: '', flip: false, tone: 'charcoal' },
    controls: [
      ctl('text', 'label', 'Small heading', { inline: true }),
      ctl('text', 'title', 'Headline', { inline: true }),
      ctl('textarea', 'text', 'Text', { inline: true }),
      ctl('text', 'buttonLabel', 'Button label', { inline: true }),
      ctl('url', 'url', 'Button link'),
      ctl('image', 'image', 'Photo'),
      ctl('text', 'alt', 'Photo description'),
      ctl('switch', 'flip', 'Photo on the left'),
      ctl('select', 'tone', 'Message colour', { options: o(['charcoal', 'Charcoal'], ['slate', 'Slate']), default: 'charcoal' }),
    ],
  },
  {
    type: 'dm-cta-band', label: 'Call-to-action band', icon: 'cursor', category: 'dm',
    defaults: { title: 'We Look Forward To Serving You.', text: 'Fill out the form to have a Dass representative help save you time and money on your next project.', buttonLabel: 'Request A Quote Now', url: '/contact#quote' },
    controls: [ctl('text', 'title', 'Headline', { inline: true }), ctl('textarea', 'text', 'Text', { inline: true }), ctl('text', 'buttonLabel', 'Button label', { inline: true }), ctl('url', 'url', 'Button link'), band(' .cta-band')],
  },

  // ------------------------------------------------------------------ content
  {
    type: 'dm-heading', label: 'Section heading', icon: 'pencil', category: 'dm',
    defaults: { eyebrow: 'Small heading', title: 'Section title', text: '', tag: 'h2', size: 'normal', tone: 'light', linkLabel: '', linkUrl: '' },
    controls: [
      ctl('text', 'eyebrow', 'Small heading', { inline: true }),
      ctl('text', 'title', 'Title', { inline: true }),
      ctl('textarea', 'text', 'Intro text', { inline: true }),
      ctl('select', 'tag', 'HTML tag', { options: o('h1', 'h2', 'h3', 'h4'), default: 'h2' }),
      ctl('select', 'size', 'Size', { options: o(['normal', 'Large'], ['small', 'Medium']), default: 'normal' }),
      TONE,
      ctl('select', 'spacing', 'Space between the parts', { options: o(['', 'Normal'], ['loose', 'Wide']) }),
      ctl('text', 'linkLabel', 'Link on the right (optional)', { inline: true }),
      ctl('url', 'linkUrl', 'Link address', { condition: { key: 'linkLabel', truthy: true } }),
      REVEAL,
    ],
  },
  {
    type: 'dm-text', label: 'Paragraph', icon: 'pencil', category: 'dm',
    defaults: { html: '<p>Write your text here.</p>', variant: 'body', tone: 'light' },
    controls: [
      ctl('rich', 'html', 'Text', { inline: true }),
      ctl('select', 'variant', 'Style', { options: o(['body', 'Body text'], ['lead', 'Large intro text'], ['small', 'Small grey text']), default: 'body' }),
      ctl('select', 'ink', 'Text colour', { options: o(['', 'Soft grey'], ['strong', 'Charcoal']), condition: { key: 'variant', eq: 'body' } }),
      TONE,
      REVEAL,
    ],
  },
  {
    type: 'dm-image', label: 'Photo', icon: 'image', category: 'dm',
    defaults: { src: '', alt: '', variant: 'photo', link: '', newTab: false },
    controls: [
      ctl('image', 'src', 'Image'),
      ctl('text', 'alt', 'Description (for screen readers and Google)'),
      ctl('select', 'variant', 'Style', { options: o(['photo', 'Photo'], ['tall', 'Tall photo'], ['badge', 'Badge / logo'], ['plain', 'Plain']), default: 'photo' }),
      ctl('url', 'link', 'Link (optional)'),
      ctl('switch', 'newTab', 'Open the link in a new tab', { condition: { key: 'link', truthy: true } }),
      REVEAL,
    ],
  },
  {
    type: 'dm-button', label: 'Button', icon: 'cursor', category: 'dm',
    defaults: { label: 'Contact Us', url: '/contact', newTab: false, style: 'accent', size: 'lg', icon: '' },
    controls: [
      ctl('text', 'label', 'Label', { inline: true }),
      ctl('url', 'url', 'Link'),
      ctl('switch', 'newTab', 'Open in a new tab'),
      ctl('select', 'style', 'Style', { options: o(['accent', 'Slate'], ['blue', 'Light blue'], ['outline', 'Outline'], ['ghost-light', 'Outline (on dark)']), default: 'accent' }),
      ctl('select', 'size', 'Size', { options: o(['md', 'Medium'], ['lg', 'Large']), default: 'lg' }),
      ctl('select', 'icon', 'Icon', { options: o(['', 'None'], ['arrow', 'Arrow'], ['mail', 'Envelope']) }),
    ],
  },
  {
    type: 'dm-quote', label: 'Statement with bar', icon: 'pencil', category: 'dm',
    defaults: { text: 'A short, bold statement.', variant: 'mission' },
    controls: [ctl('textarea', 'text', 'Text', { inline: true }), ctl('select', 'variant', 'Style', { options: o(['mission', 'Large statement'], ['note', 'Paragraph under a bar']), default: 'mission' }), REVEAL],
  },
  {
    type: 'dm-icon-list', label: 'Icon columns', icon: 'grid', category: 'dm',
    defaults: { variant: 'why', items: [{ icon: '', title: 'Title', text: 'Short description.' }] },
    controls: [
      ctl('select', 'variant', 'Style', { options: o(['why', 'Five dark columns (Why Dass Metal)'], ['pillar', 'Four light columns (Our pillars)']), default: 'why' }),
      ctl('repeater', 'items', 'Columns', { itemLabel: 'title', itemDefaults: { icon: '', title: 'New column', text: '' }, fields: [ctl('image', 'icon', 'Icon (a single-colour PNG)'), ctl('text', 'title', 'Title', { inline: true }), ctl('textarea', 'text', 'Text', { inline: true })] }),
    ],
  },
  {
    type: 'dm-feature-cards', label: 'Photo cards', icon: 'grid', category: 'dm',
    defaults: { items: [{ image: '', alt: '', contain: false, title: 'Title', text: 'Description.' }] },
    controls: [ctl('repeater', 'items', 'Cards', { itemLabel: 'title', itemDefaults: { image: '', alt: '', contain: false, title: 'New card', text: '' }, fields: [ctl('image', 'image', 'Photo'), ctl('text', 'alt', 'Photo description'), ctl('switch', 'contain', 'Show the whole picture (no cropping)'), ctl('text', 'title', 'Title', { inline: true }), ctl('textarea', 'text', 'Text', { inline: true })] })],
  },
  { type: 'dm-logos', label: 'Logo row / wall', icon: 'grid', category: 'dm', defaults: { variant: 'row', label: 'Logos', items: [] }, controls: [ctl('select', 'variant', 'Layout', { options: o(['row', 'Large row'], ['wall', 'Compact wall']), default: 'row' }), ctl('text', 'label', 'Group name (for screen readers)'), LOGO_ITEMS()] },
  { type: 'dm-photo-strip', label: 'Photo strip', icon: 'image', category: 'dm', defaults: { items: [] }, controls: [ctl('repeater', 'items', 'Photos', { itemLabel: 'alt', itemDefaults: { src: '', alt: '' }, fields: [ctl('image', 'src', 'Photo'), ctl('text', 'alt', 'Description')] })] },
  {
    type: 'dm-standards-table', label: 'Standards table', icon: 'table', category: 'dm',
    defaults: { caption: 'Standards', headCode: 'Standard', headCovers: 'Covers', items: [{ code: 'ASTM C645', covers: 'Profile, Steel thickness, and Dimensions' }] },
    controls: [ctl('text', 'caption', 'Table description (for screen readers)'), ctl('text', 'headCode', 'First column heading', { inline: true }), ctl('text', 'headCovers', 'Second column heading', { inline: true }), ctl('repeater', 'items', 'Rows', { itemLabel: 'code', itemDefaults: { code: '', covers: '' }, fields: [ctl('text', 'code', 'Standard', { inline: true }), ctl('text', 'covers', 'What it covers', { inline: true })] })],
  },
  {
    type: 'dm-notice', label: 'Notice box', icon: 'clipboard', category: 'dm', needs: ['company'],
    defaults: { title: 'Documents available upon request.', text: 'Please email us at {email}', buttonLabel: 'Email {email}', subject: 'MSDS request' },
    controls: [ctl('text', 'title', 'Title', { inline: true }), ctl('textarea', 'text', 'Text', { inline: true, help: '{email} becomes the company email from Settings.' }), ctl('text', 'buttonLabel', 'Button label', { inline: true }), ctl('text', 'subject', 'Email subject')],
  },

  // ------------------------------------------------------------------ data-driven (content comes from the admin lists)
  {
    type: 'dm-product-grid', label: 'Product cards', icon: 'package', category: 'dm', live: true, needs: ['products'],
    defaults: { source: 'selected', items: [], category: '', limit: 0, size: 'compact' },
    controls: [
      ctl('select', 'source', 'Which products', { options: o(['selected', 'The ones I choose'], ['category', 'A whole category'], ['all', 'Every product']), default: 'selected' }),
      ctl('repeater', 'items', 'Products', { itemLabel: 'slug', itemDefaults: { slug: '' }, fields: [ctl('resource', 'slug', 'Product', { source: 'products' })], condition: { key: 'source', eq: 'selected' } }),
      ctl('text', 'category', 'Category name', { placeholder: 'Interior Framing', condition: { key: 'source', eq: 'category' } }),
      ctl('number', 'limit', 'Maximum (0 = all)', { min: 0, max: 60, step: 1, condition: { key: 'source', in: ['category', 'all'] } }),
      ctl('select', 'size', 'Card size', { options: o(['compact', 'Small'], ['standard', 'Large']), default: 'compact' }),
    ],
  },
  {
    type: 'dm-products-catalog', label: 'Product catalogue', icon: 'package', category: 'dm', live: true, needs: ['products'],
    defaults: { allLabel: 'All' },
    controls: [ctl('text', 'allLabel', 'Label of the "show everything" filter'), ctl('text', 'filterLabel', 'Filter group name (for screen readers)')],
  },
  {
    type: 'dm-post-grid', label: 'Blog post cards', icon: 'book', category: 'dm', live: true, needs: ['postsIndex'],
    defaults: { source: 'featured', limit: 3 },
    controls: [ctl('select', 'source', 'Which posts', { options: o(['featured', 'Featured posts (falls back to newest)'], ['latest', 'Newest posts']), default: 'featured' }), ctl('number', 'limit', 'How many', { min: 1, max: 24, step: 1, default: 3 })],
  },
  {
    type: 'dm-blog-index', label: 'Blog list with search', icon: 'book', category: 'dm', live: true, needs: ['postsIndex'],
    defaults: { placeholder: 'Search posts', perPage: 12 },
    controls: [ctl('text', 'placeholder', 'Search box hint'), ctl('number', 'perPage', 'Posts per page', { min: 3, max: 48, step: 1, default: 12 })],
  },
  { type: 'dm-projects-gallery', label: 'Project galleries', icon: 'building', category: 'dm', live: true, needs: ['projects'], defaults: {}, controls: [ctl('select', 'source', 'Shows', { options: o(['all', 'Every project with photos']), default: 'all', help: 'Add or reorder projects under Projects in the admin.' })] },
  {
    type: 'dm-contact-info', label: 'Contact details', icon: 'map-pin', category: 'dm', live: true, needs: ['company'],
    defaults: { visitTitle: 'Visit us', hoursTitle: 'Hours', callTitle: 'Call', emailTitle: 'Email' },
    controls: [ctl('text', 'visitTitle', 'Address heading'), ctl('text', 'hoursTitle', 'Hours heading'), ctl('text', 'callTitle', 'Phone heading'), ctl('text', 'emailTitle', 'Email heading')],
  },
  {
    type: 'dm-quote-form', label: 'Quote / enquiry form', icon: 'form', category: 'dm', live: true, needs: ['products', 'company'],
    defaults: {
      contactTitle: 'General Enquiries', contactText: 'Please fill out the form below if you have any enquiries regarding our business',
      quoteTitle: 'Request a Quote', quoteText: 'Check your products below and add your details — a Dass representative will follow up with pricing and availability.',
      buttonLabel: 'Request A Quote', consentText: 'By submitting this form, you agree to receive newsletters, event tips, and marketing updates.',
      successText: 'Thank you — your message has been sent. A Dass representative will be in touch shortly.',
      departments: 'General Enquiry\nProducts\nSales\nAccounts\nFeedback\nOther',
    },
    controls: [
      ctl('text', 'contactTitle', 'Heading (general enquiry)'), ctl('textarea', 'contactText', 'Text (general enquiry)'),
      ctl('text', 'quoteTitle', 'Heading (quote request)'), ctl('textarea', 'quoteText', 'Text (quote request)'),
      ctl('text', 'buttonLabel', 'Button label'), ctl('textarea', 'consentText', 'Newsletter consent text'), ctl('textarea', 'successText', 'Message after sending'),
      ctl('textarea', 'departments', 'Departments (one per line)', { help: 'Where the enquiry should go. Who receives it is set under Email in the admin.' }),
    ],
  },

  // ------------------------------------------------------------------ site frame (header & footer templates)
  {
    type: 'dm-topbar', label: 'Top bar', icon: 'menu', category: 'dm', live: true, needs: ['company'],
    defaults: { showTagline: true, showHours: true, showPhone: true, showEmail: true },
    controls: [ctl('switch', 'showTagline', 'Show the tagline', { help: 'The tagline, hours, phone and email are edited in Admin → Settings so they stay the same everywhere.' }), ctl('switch', 'showHours', 'Show opening hours'), ctl('switch', 'showPhone', 'Show the phone number'), ctl('switch', 'showEmail', 'Show the email')],
  },
  {
    type: 'dm-header', label: 'Header with menu', icon: 'menu', category: 'dm', live: true, needs: ['company', 'products'],
    defaults: { logo: '', logoAlt: '', ctaLabel: 'Get a Quote', ctaUrl: '/contact#quote', callLabel: 'Call', megaLabel: 'View all products', megaUrl: '/our-products', nav: [] },
    controls: [
      ctl('image', 'logo', 'Logo (white artwork for the dark header)'),
      ctl('text', 'logoAlt', 'Logo description'),
      ctl('repeater', 'nav', 'Menu', {
        itemLabel: 'label', itemDefaults: { label: 'New item', type: 'link', url: '/', children: [] },
        fields: [
          ctl('text', 'label', 'Label'),
          ctl('select', 'type', 'Kind', { options: o(['link', 'Single link'], ['dropdown', 'Drop-down list'], ['products', 'Products mega menu (built from the Products list)']), default: 'link' }),
          ctl('url', 'url', 'Link', { condition: { key: 'type', eq: 'link' } }), ctl('switch', 'markActive', 'Highlight the menu when you are on one of its pages', { condition: { key: 'type', eq: 'dropdown' } }),
          ctl('repeater', 'children', 'Drop-down links', { itemLabel: 'label', itemDefaults: { label: 'New link', url: '/', pdf: false }, fields: [ctl('text', 'label', 'Label'), ctl('url', 'url', 'Link'), ctl('switch', 'pdf', 'Open as a PDF in a new tab')], condition: { key: 'type', eq: 'dropdown' } }),
        ],
      }),
      ctl('text', 'ctaLabel', 'Button label'), ctl('url', 'ctaUrl', 'Button link'),
      ctl('text', 'megaLabel', 'Mega-menu link label'), ctl('url', 'megaUrl', 'Mega-menu link'),
      ctl('text', 'callLabel', 'Phone button prefix (mobile menu)'),
      band(' .site-header', 'Header colour'),
    ],
  },
  {
    type: 'dm-footer', label: 'Footer', icon: 'layers', category: 'dm', live: true, needs: ['company'],
    defaults: {
      logo: '', logoAlt: '', badge: '', badgeAlt: '', linksTitle: 'Quick Links', links: [], contactTitle: 'Get In Touch',
      affilTitle: 'A JDass Corp Company', affilLogo: '', affilAlt: '', affilUrl: '', holidayTitle: 'Our Holiday Hours', copyright: '© {year} | All Rights Reserved.',
    },
    controls: [
      ctl('image', 'logo', 'Logo'), ctl('text', 'logoAlt', 'Logo description'),
      ctl('image', 'badge', 'Badge under the social icons'), ctl('text', 'badgeAlt', 'Badge description'),
      ctl('text', 'linksTitle', 'Links column heading'),
      ctl('repeater', 'links', 'Links', { itemLabel: 'label', itemDefaults: { label: 'New link', url: '/' }, fields: [ctl('text', 'label', 'Label'), ctl('url', 'url', 'Link')] }),
      ctl('text', 'contactTitle', 'Contact column heading'),
      ctl('text', 'affilTitle', 'Last column heading'), ctl('image', 'affilLogo', 'Last column logo'), ctl('text', 'affilAlt', 'Last column logo description'), ctl('url', 'affilUrl', 'Last column link'),
      ctl('text', 'holidayTitle', 'Holiday notice heading'),
      ctl('text', 'copyright', 'Copyright line', { help: '{year} becomes the current year. The address and holiday notice come from Settings.' }),
      band(' .site-footer', 'Footer colour'),
    ],
  },
];
