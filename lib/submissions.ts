// Validation + storage for the public forms (contact + quote, newsletter).
import { all, get, run } from './db';
import { hasColumn } from './schema-ready';

export type FormType = 'contact' | 'quote' | 'newsletter';
export const FORM_TYPES: FormType[] = ['contact', 'quote', 'newsletter'];

/** Custom forms built in the CMS are stored with type 'form:<slug>'. */
export const CUSTOM_TYPE = /^form:[a-z0-9-]{1,80}$/;
export const isCustomType = (t: string) => CUSTOM_TYPE.test(t);
/** Built-in type or a custom form's type — what the admin filters accept. */
export const isKnownType = (t: string) => (FORM_TYPES as string[]).includes(t) || isCustomType(t);

/** Human labels for custom types: { 'form:quote-2': 'Quote request' } (built from the forms table; deleted forms fall back to the slug). */
export function customFormLabels(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of all<{ slug: string; name: string }>('SELECT slug, name FROM forms ORDER BY name COLLATE NOCASE')) out[`form:${f.slug}`] = f.name;
  return out;
}
/** Every custom type that has a form or at least one submission, with its label (for the admin filter tabs). */
export function customTypeList(): Array<{ type: string; label: string }> {
  const labels = customFormLabels();
  for (const r of all<{ type: string }>("SELECT DISTINCT type FROM submissions WHERE type LIKE 'form:%'")) if (!labels[r.type]) labels[r.type] = r.type.slice(5);
  return Object.entries(labels).map(([type, label]) => ({ type, label }));
}
export function typeLabel(type: string, labels: Record<string, string>): string {
  return isCustomType(type) ? labels[type] || type.slice(5) : type;
}

export type NewSubmission = {
  type: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  data: Record<string, unknown>;
  /** Page the visitor was on ('/quote', '/products?x=1' …) and a label such as "Popup: Newsletter" — filled in by the endpoint. */
  source_url?: string;
  source_label?: string;
  /** utm_* + landing page + referrer from the visitor's first page (validated by cleanAttribution) */
  attribution?: Record<string, string>;
};

export type Parsed = { ok: true; row: NewSubmission } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clip = (v: unknown, max: number) => String(v ?? '').replace(/\u0000/g, '').trim().slice(0, max);
const field = (fd: FormData, key: string, max = 200) => clip(fd.get(key), max);

function missing(list: Array<[string, string]>): string | null {
  const names = list.filter(([, value]) => !value).map(([label]) => label);
  return names.length ? `Please fill in: ${names.join(', ')}.` : null;
}

/** One product line of a quote request, as stored in submissions.data.products. */
export type QuoteLine = { slug: string; product: string; options: Record<string, string>; quantity: string; notes: string };

/**
 * The product lines posted by the quote form (JSON). Every line is checked against the catalogue: an unknown product is dropped and
 * the product NAME always comes from the database, never from the browser.
 */
export function parseQuoteLines(raw: unknown): QuoteLine[] {
  let list: unknown;
  try {
    list = JSON.parse(String(raw || '[]'));
  } catch {
    return [];
  }
  if (!Array.isArray(list)) return [];
  const out: QuoteLine[] = [];
  for (const l of list.slice(0, 25)) {
    const slug = clip((l as any)?.slug, 120);
    const row = slug ? get<{ name: string }>("SELECT name FROM products WHERE slug = ? AND published = 1", slug) : undefined;
    if (!row) continue;
    const options: Record<string, string> = {};
    for (const [k, v] of Object.entries(((l as any)?.options as Record<string, unknown>) || {}).slice(0, 12)) {
      const label = clip(k, 80);
      const value = clip(v, 60);
      if (label && value) options[label] = value;
    }
    out.push({ slug, product: row.name, options, quantity: clip((l as any)?.quantity, 40), notes: clip((l as any)?.notes, 300) });
  }
  return out;
}

export function parseSubmission(type: string, fd: FormData): Parsed {
  switch (type) {
    // "General enquiry" and "Request a quote" are the same form: it becomes a quote as soon as it has product lines
    case 'contact':
    case 'quote': {
      const first = field(fd, 'first_name', 80);
      const last = field(fd, 'last_name', 80);
      const email = field(fd, 'email', 200);
      const phone = field(fd, 'phone', 40);
      const company = field(fd, 'company', 160);
      const department = field(fd, 'department', 60);
      const err = missing([['first name', first], ['last name', last], ['email', email], ['company', company], ['department', department], ['phone', phone]]);
      if (err) return { ok: false, error: err };
      if (!EMAIL.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
      const products = parseQuoteLines(fd.get('products'));
      if (type === 'quote') {
        if (!products.length) return { ok: false, error: 'Please choose at least one product for the quote.' };
        const noQty = products.find((p) => !p.quantity);
        if (noQty) return { ok: false, error: `Please enter a quantity for ${noQty.product}.` };
      }
      return {
        ok: true,
        row: { type, name: `${first} ${last}`, email, phone, company, message: field(fd, 'message', 5000), data: { department, optin: field(fd, 'consent', 3) === 'yes', products } },
      };
    }

    case 'newsletter': {
      const email = field(fd, 'email', 200);
      if (!EMAIL.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
      return { ok: true, row: { type, name: '', email, phone: '', company: '', message: '', data: {} } };
    }

    default:
      return { ok: false, error: 'Unknown form.' };
  }
}

export function insertSubmission(row: NewSubmission): number {
  const cols = ['type', 'name', 'email', 'phone', 'company', 'message', 'data'];
  const vals: Array<string | number> = [row.type, row.name, row.email, row.phone, row.company, row.message, JSON.stringify(row.data)];
  // Columns added by later migrations are used only when they exist: on a database that has not been migrated yet (a long-running
  // dev server started before the migration) the lead is still saved — a customer's enquiry must never be lost for that reason.
  if (hasColumn('submissions', 'source_url') && hasColumn('submissions', 'source_label')) {
    cols.push('source_url', 'source_label');
    vals.push((row.source_url || '').slice(0, 300), (row.source_label || '').slice(0, 160));
  }
  if (hasColumn('submissions', 'attribution')) {
    cols.push('attribution');
    vals.push(JSON.stringify(row.attribution || {}));
  }
  return run(`INSERT INTO submissions (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, ...vals).lastInsertRowid;
}

export function setAttachments(id: number, attachments: unknown[]) {
  run('UPDATE submissions SET attachments = ? WHERE id = ?', JSON.stringify(attachments), id);
}

/** The page a form was submitted from: a same-site path only ('/quote', '/products?x=1'), never an absolute URL. */
export function cleanSourcePath(v: unknown): string {
  const s = String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return /^\/(?!\/)[^\s<>"'\\]*$/.test(s) ? s.slice(0, 300) : '';
}
