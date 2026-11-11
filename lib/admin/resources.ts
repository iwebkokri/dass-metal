// Definitions that drive the generic list + editor screens in the Studio CMS.
// Adding a field here (and the matching column in lib/db-core.mjs) is all it takes to edit it in the admin.

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'image' | 'gallery' | 'richtext' | 'specs';

export type FieldDef = {
  name: string; // database column
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<[value: string, label: string]>;
  help?: string;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  default?: string | number;
  wide?: boolean; // span the full form width
};

export type ColumnKind = 'text' | 'bool' | 'date' | 'thumb' | 'count' | 'badge';

export type Resource = {
  key: string; // URL segment: /admin/<key>
  table: string;
  label: string; // "Insights"
  singular: string; // "article"
  orderBy: string;
  slugFrom?: string; // auto-generate a unique slug from this field
  columns: Array<{ key: string; label: string; kind?: ColumnKind }>;
  fields: FieldDef[];
  publicPath: string; // where the site shows it (for the "View on site" link)
};

export const RESOURCES: Record<string, Resource> = {
  projects: {
    key: 'projects',
    table: 'projects',
    label: 'Projects',
    singular: 'project',
    orderBy: 'sort_order, id',
    slugFrom: 'title',
    publicPath: '/projects',
    columns: [
      { key: 'images', label: '', kind: 'thumb' },
      { key: 'title', label: 'Project' },
      { key: 'location', label: 'Location' },
      { key: 'published', label: 'Visible', kind: 'bool' },
      { key: 'sort_order', label: 'Order' },
    ],
    fields: [
      { name: 'title', label: 'Project name', type: 'text', required: true, maxLength: 160, wide: true, placeholder: 'The Hawthorne Residences' },
      { name: 'location', label: 'Location', type: 'text', maxLength: 160, wide: true, placeholder: 'Brampton, ON  (or a street address)' },
      { name: 'sort_order', label: 'Order', type: 'number', default: 100, help: 'Lower numbers come first.' },
      { name: 'published', label: 'Visible on the website', type: 'checkbox', default: 1 },
      { name: 'images', label: 'Photos', type: 'gallery', wide: true, help: 'Visitors can open every photo full screen.' },
    ],
  },

  products: {
    key: 'products',
    table: 'products',
    label: 'Products',
    singular: 'product',
    orderBy: 'sort_order, id',
    slugFrom: 'name',
    publicPath: '/our-products',
    columns: [
      { key: 'image', label: '', kind: 'thumb' },
      { key: 'name', label: 'Product' },
      { key: 'category', label: 'Category', kind: 'badge' },
      { key: 'group_title', label: 'Group' },
      { key: 'published', label: 'Visible', kind: 'bool' },
      { key: 'sort_order', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Product name', type: 'text', required: true, maxLength: 160, wide: true },
      { name: 'slug', label: 'Web address', type: 'text', maxLength: 120, placeholder: 'j-track', help: 'The page is at /products/<this>. Lower-case letters, numbers and dashes. Changing it leaves a redirect from the old address. Leave empty to create one from the name.' },
      { name: 'category', label: 'Category', type: 'text', maxLength: 120, placeholder: 'Interior Framing', help: 'Groups products in the menu and on the Products page.' },
      { name: 'group_title', label: 'Group within the category', type: 'text', maxLength: 160, placeholder: 'Steel Stud Framing System' },
      { name: 'sort_order', label: 'Order', type: 'number', default: 100, help: 'Lower numbers come first (menu, Products page).' },
      { name: 'published', label: 'Visible on the website', type: 'checkbox', default: 1 },
      { name: 'description', label: 'Short description', type: 'textarea', rows: 3, maxLength: 400, wide: true, help: 'Shown on product cards and in the products list.' },
      { name: 'image', label: 'Card photo', type: 'image', wide: true },
      { name: 'gallery', label: 'Product photos', type: 'gallery', wide: true, help: 'Use full-size photos: the product page magnifies them. The first photo is the main one.' },
      { name: 'specs', label: 'Specifications', type: 'specs', wide: true },
      { name: 'custom_note', label: 'Custom order note', type: 'text', maxLength: 200, wide: true, placeholder: 'Custom Lengths Available' },
      { name: 'desc_title', label: 'Description heading', type: 'text', maxLength: 200, wide: true },
      { name: 'body', label: 'Full description', type: 'richtext', wide: true },
      { name: 'seo_title', label: 'Search engine title', type: 'text', maxLength: 200, wide: true, help: 'Optional. Leave empty to use the product name.' },
      { name: 'seo_description', label: 'Search engine description', type: 'textarea', rows: 2, maxLength: 320, wide: true, help: 'Optional. Leave empty to use the short description.' },
    ],
  },
};

/** Settings edited on the Settings screen (stored in the `settings` table). */
export const SETTING_FIELDS: FieldDef[] = [
  { name: 'notify_emails', label: 'Send new submissions to', type: 'text', maxLength: 300, wide: true, placeholder: 'sales@dassmetal.com', help: 'Comma-separated. Requires SMTP to be configured on the server (see README); submissions are always saved here either way.' },
];
