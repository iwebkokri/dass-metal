// Widgets whose content comes from the CMS database (projects, posts, products, forms, menus, site logo).
// Each has `needs` — the datasets the server must load to render it (see lib/builder/data.ts).
import { o, ctl, typo } from './helpers.mjs';

export const DYNAMIC_WIDGETS = [
  {
    type: 'site-block', label: 'Site page content (old all-in-one block)', icon: 'building', category: 'site', hidden: true, needs: ['products', 'postsIndex', 'company', 'projects'],
    defaults: { block: 'home' },
    controls: [
      ctl('select', 'block', 'Content', {
        options: o(['home', 'Home page'], ['about', 'About us page'], ['products', 'Products overview'], ['standards', 'Standards page'], ['msds', 'MSDS page'], ['projects', 'Projects gallery'], ['blogs', 'Blog list'], ['contact', 'Contact & quote form']),
        default: 'home',
        help: 'The designed content of a Dass Metal page. Add other sections above or below it with the builder; edit products, posts and projects under their own admin screens.',
      }),
    ],
  },
  {
    type: 'projects', label: 'Projects', icon: 'building', category: 'dynamic', needs: ['projects'],
    defaults: { source: 'all', layout: 'cards', limit: 0, cols: { d: 3, t: 2, m: 1 }, linkUrl: '/projects', chipsLabel: 'Also on our roster:' },
    controls: [
      ctl('select', 'source', 'Show', { options: o(['featured', 'Featured projects'], ['others', 'Other projects'], ['roster', 'Roster chips (name only)'], ['all', 'All projects']), default: 'featured' }),
      ctl('select', 'layout', 'Layout', { options: o(['cards', 'Cards'], ['detail', 'Detail rows with photo gallery'], ['list', 'Compact list'], ['chips', 'Chips']), default: 'cards' }),
      ctl('number', 'limit', 'Maximum (0 = all)', { min: 0, max: 60, step: 1 }),
      ctl('number', 'cols', 'Columns', { responsive: true, min: 1, max: 4, step: 1, css: [{ sel: ' .dr-proj-grid', prop: 'grid-template-columns', tpl: 'repeat({v}, minmax(0, 1fr))' }] }),
      ctl('url', 'linkUrl', 'Card link', { help: 'Where a project card links to.', condition: { key: 'layout', eq: 'cards' } }),
      ctl('text', 'chipsLabel', 'Label before the chips', { condition: { key: 'layout', eq: 'chips' } }),
      ctl('size', 'projGap', 'Gap', { tab: 'style', group: 'Cards', units: ['px'], css: [{ sel: ' .dr-proj-grid', prop: 'gap' }] }),
      ctl('color', 'cardBg', 'Card background', { tab: 'style', group: 'Cards', css: [{ sel: ' .dr-card', prop: 'background-color' }] }),
      ctl('dimensions', 'cardRadius', 'Card corner radius', { tab: 'style', group: 'Cards', css: [{ sel: ' .dr-card', prop: 'border-radius' }] }),
      ...typo('title', ' .dr-card-title', 'Card title'),
    ],
  },
  {
    type: 'insights', label: 'Insights / posts', icon: 'book', category: 'dynamic', needs: ['posts'],
    defaults: { layout: 'grid', limit: 3, cols: { d: 3, t: 2, m: 1 } },
    controls: [
      ctl('select', 'layout', 'Layout', { options: o(['grid', 'Card grid'], ['featured', 'Featured post + grid'], ['list', 'List']), default: 'grid' }),
      ctl('number', 'limit', 'Maximum (0 = all)', { min: 0, max: 60, step: 1 }),
      ctl('resource', 'category', 'Category', { source: 'categories', help: 'Leave empty for all posts.' }),
      ctl('switch', 'showExcerpt', 'Show excerpt', { condition: { key: 'layout', eq: 'grid' } }),
      ctl('number', 'cols', 'Columns', { responsive: true, min: 1, max: 4, step: 1, css: [{ sel: ' .dr-post-grid', prop: 'grid-template-columns', tpl: 'repeat({v}, minmax(0, 1fr))' }] }),
      ctl('size', 'postGap', 'Gap', { tab: 'style', group: 'Cards', units: ['px'], css: [{ sel: ' .dr-post-grid', prop: 'gap' }] }),
      ctl('size', 'featGap', 'Gap below featured post', { tab: 'style', group: 'Cards', units: ['px'], css: [{ sel: ' .dr-post-wrap', prop: 'gap' }], condition: { key: 'layout', eq: 'featured' } }),
      ctl('color', 'cardBg', 'Card background', { tab: 'style', group: 'Cards', css: [{ sel: ' .dr-card', prop: 'background-color' }] }),
      ctl('dimensions', 'cardRadius', 'Card corner radius', { tab: 'style', group: 'Cards', css: [{ sel: ' .dr-card', prop: 'border-radius' }] }),
      ...typo('title', ' .dr-card-title', 'Card title'),
    ],
  },
  {
    type: 'products', label: 'Products', icon: 'package', category: 'dynamic', needs: ['products'],
    defaults: { category: '', limit: 0, cols: { d: 4, t: 2, m: 1 } },
    controls: [
      ctl('text', 'category', 'Only this category', { help: 'For example “Interior Framing”. Leave empty to show every product.' }),
      ctl('number', 'limit', 'Maximum (0 = all)', { min: 0, max: 60, step: 1 }),
      ctl('number', 'cols', 'Columns', { responsive: true, min: 1, max: 5, step: 1, css: [{ sel: ' .dr-prod-grid', prop: 'grid-template-columns', tpl: 'repeat({v}, minmax(0, 1fr))' }] }),
      ctl('size', 'prodGap', 'Gap', { tab: 'style', group: 'Cards', units: ['px'], css: [{ sel: ' .dr-prod-grid', prop: 'gap' }] }),
      ctl('color', 'cardBg', 'Card background', { tab: 'style', group: 'Cards', css: [{ sel: ' .dr-card', prop: 'background-color' }] }),
      ctl('dimensions', 'cardRadius', 'Card corner radius', { tab: 'style', group: 'Cards', css: [{ sel: ' .dr-card', prop: 'border-radius' }] }),
      ...typo('title', ' .dr-card-title', 'Card title'),
    ],
  },
  {
    type: 'contact-form', label: 'Contact form', icon: 'mail', category: 'dynamic', needs: [],
    defaults: { title: 'Get in touch with us today', buttonLabel: 'Submit', successTitle: 'Message received', successText: 'Thanks for reaching out — our team will get back to you shortly.' },
    controls: [
      ctl('text', 'title', 'Heading'),
      ctl('text', 'buttonLabel', 'Button label'),
      ctl('text', 'successTitle', 'Success heading'),
      ctl('textarea', 'successText', 'Success message'),
      ctl('color', 'btnBg', 'Button background', { tab: 'style', group: 'Form', css: [{ sel: ' .dr-form-submit', prop: 'background-color' }] }),
      ctl('color', 'btnColor', 'Button text colour', { tab: 'style', group: 'Form', css: [{ sel: ' .dr-form-submit', prop: 'color' }] }),
      ctl('color', 'cardBg', 'Card background', { tab: 'style', group: 'Form', css: [{ sel: ' .dr-contact', prop: 'background-color' }] }),
      ctl('dimensions', 'cardRadius', 'Card corner radius', { tab: 'style', group: 'Form', css: [{ sel: ' .dr-contact', prop: 'border-radius' }] }),
      ctl('dimensions', 'fieldRadius', 'Field corner radius', { tab: 'style', group: 'Form', css: [{ sel: ' .dr-input', prop: 'border-radius' }] }),
    ],
  },
  {
    type: 'newsletter', label: 'Newsletter signup', icon: 'mail', category: 'dynamic', needs: [],
    defaults: { placeholder: 'Email address', buttonLabel: 'Subscribe', successText: 'Thanks — you’re subscribed.' },
    controls: [
      ctl('text', 'placeholder', 'Placeholder'),
      ctl('text', 'buttonLabel', 'Button label', { inline: true }),
      ctl('text', 'successText', 'Success message'),
      ctl('color', 'fieldBg', 'Field background', { tab: 'style', group: 'Form', css: [{ sel: ' input[type=email]', prop: 'background-color' }] }),
      ctl('color', 'fieldColor', 'Field text colour', { tab: 'style', group: 'Form', css: [{ sel: ' input[type=email]', prop: 'color' }] }),
      ctl('color', 'fieldBorder', 'Field border colour', { tab: 'style', group: 'Form', css: [{ sel: ' input[type=email]', prop: 'border-color' }] }),
      ctl('color', 'btnBg', 'Button background', { tab: 'style', group: 'Form', css: [{ sel: ' button', prop: 'background-color' }] }),
      ctl('color', 'btnColor', 'Button text colour', { tab: 'style', group: 'Form', css: [{ sel: ' button', prop: 'color' }] }),
    ],
  },
  {
    type: 'form', label: 'Custom form', icon: 'form', category: 'dynamic', needs: ['forms'],
    defaults: { formId: '' },
    controls: [
      ctl('resource', 'formId', 'Form', { source: 'forms', help: 'Build forms under Forms in the admin.' }),
      ctl('color', 'btnBg', 'Button background', { tab: 'style', group: 'Form', css: [{ sel: ' .dr-form-submit', prop: 'background-color' }] }),
      ctl('color', 'btnColor', 'Button text colour', { tab: 'style', group: 'Form', css: [{ sel: ' .dr-form-submit', prop: 'color' }] }),
      ctl('dimensions', 'fieldRadius', 'Field corner radius', { tab: 'style', group: 'Form', css: [{ sel: ' .dr-form-field', prop: 'border-radius' }] }),
    ],
  },
  {
    type: 'nav-menu', label: 'Navigation menu', icon: 'menu', category: 'site', needs: ['menus'],
    defaults: { menu: 'primary', layout: 'bar', megaEyebrow: '', megaIntro: '', megaLabel: '', megaUrl: '' },
    controls: [
      ctl('resource', 'menu', 'Menu', { source: 'menus', help: 'Edit the items under Menus in the admin.' }),
      ctl('select', 'layout', 'Layout', { options: o(['bar', 'Header bar (with dropdown)'], ['list', 'Vertical link list (footer)']), default: 'bar' }),
      ctl('text', 'megaEyebrow', 'Dropdown eyebrow', { inline: true, condition: { key: 'layout', eq: 'bar' } }),
      ctl('textarea', 'megaIntro', 'Dropdown intro text', { inline: true, condition: { key: 'layout', eq: 'bar' } }),
      ctl('text', 'megaLabel', 'Dropdown link label', { inline: true, condition: { key: 'layout', eq: 'bar' } }),
      ctl('url', 'megaUrl', 'Dropdown link', { condition: { key: 'layout', eq: 'bar' } }),
      ctl('size', 'listGap', 'Link spacing', { tab: 'style', group: 'Link list', units: ['px'], css: [{ sel: ' .dr-navlist', prop: 'gap' }], condition: { key: 'layout', eq: 'list' } }),
      ...typo('li', ' .dr-navlist-a', 'Link list text', { condition: { key: 'layout', eq: 'list' } }),
      ctl('color', 'navColor', 'Link colour', { tab: 'style', group: 'Menu', css: [{ sel: ' .dr-nav-link, .dr-nav-btn', prop: 'color' }], condition: { key: 'layout', eq: 'bar' } }),
      ctl('color', 'navActive', 'Active underline colour', { tab: 'style', group: 'Menu', css: [{ sel: ' .dr-nav-desktop [aria-current=page]', prop: 'border-bottom-color' }] }),
      ctl('color', 'ctaBg', 'CTA button colour', { tab: 'style', group: 'Menu', css: [{ sel: ' .dr-nav-cta, .dr-m-cta', prop: 'background-color' }] }),
    ],
  },
  {
    type: 'logo', label: 'Site logo', icon: 'image', category: 'site', needs: [],
    defaults: { src: '/favicon.png', alt: 'Dass Metal Products', link: '/', tagline: '' },
    controls: [
      ctl('image', 'src', 'Logo image'),
      ctl('text', 'alt', 'Alt text'),
      ctl('url', 'link', 'Link'),
      ctl('text', 'tagline', 'Tagline (optional)', { inline: true }),
      ctl('size', 'logoHeight', 'Height', { tab: 'style', group: 'Logo', responsive: true, units: ['px'], css: [{ sel: ' img', prop: 'height' }] }),
    ],
  },
];
