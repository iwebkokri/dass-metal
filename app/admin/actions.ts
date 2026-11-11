'use server';

// Every action starts with requireUser(): actions are public HTTP endpoints, so the layout's check is not enough.
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { RESOURCES, SETTING_FIELDS, type FieldDef } from '@/lib/admin/resources';
import { logActivity } from '@/lib/activity';
import { createSession, destroySession, requireCap, requireUser } from '@/lib/auth';
import { parseImages, parseSpecs } from '@/lib/content';
import { createRedirect } from '@/lib/redirects';
import { sanitizeRichHtml } from '@/lib/rich-html.mjs';
import { get, getSetting, run, setSetting, transaction } from '@/lib/db';
import { today } from '@/lib/format';
import { hashPassword, verifyPassword } from '@/lib/password.mjs';
import { slugify } from '@/lib/slug.mjs';
import { passwordProblem } from '@/lib/users';
import { isKnownMediaUrl } from '@/lib/media';
import { privateDir, safeJoin, saveImage } from '@/lib/uploads';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function go(pathname: string, params: Record<string, string> = {}): never {
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString();
  redirect(qs ? `${pathname}?${qs}` : pathname);
}

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? '').replace(/\u0000/g, '').trim().slice(0, max);
const isFile = (v: FormDataEntryValue | null): v is File => v instanceof File && v.size > 0;
const publish = () => revalidatePath('/', 'layout'); // public pages + CMS lists pick up the change

// ------------------------------------------------------------------ field parsing
async function readField(def: FieldDef, fd: FormData, existing: Record<string, any> | undefined, warnings: string[]): Promise<string | number> {
  const name = def.name;
  switch (def.type) {
    case 'text':
    case 'select':
      return clip(fd.get(name), def.maxLength ?? 500);
    case 'textarea':
      return clip(fd.get(name), def.maxLength ?? 100_000);
    case 'number': {
      const n = Math.trunc(Number(fd.get(name)));
      return Number.isFinite(n) ? n : Number(def.default ?? 0);
    }
    case 'date': {
      const s = clip(fd.get(name), 10);
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : today();
    }
    case 'checkbox':
      return fd.get(name) === 'on' ? 1 : 0;
    case 'richtext':
      return sanitizeRichHtml(String(fd.get(name) ?? '').slice(0, def.maxLength ?? 300_000));
    case 'specs': {
      let raw = '[]';
      try {
        raw = JSON.stringify(parseSpecs(String(fd.get(name) ?? '[]')).slice(0, 30).map((x) => ({ label: x.label.slice(0, 80), values: x.values.slice(0, 40).map((v) => v.slice(0, 60)) })));
      } catch {
        /* keep the empty list */
      }
      return raw;
    }
    case 'image': {
      // The current value always comes from the database, never from the browser.
      const current = String(existing?.[name] ?? '');
      const file = fd.get(`${name}__file`);
      if (isFile(file)) {
        try {
          return await saveImage(file);
        } catch (err) {
          warnings.push(err instanceof Error ? err.message : 'Image could not be saved.');
          return current;
        }
      }
      // MediaField (media library): hidden input holding the chosen URL, '' = removed. Only URLs registered in the library (or the current value) are accepted.
      const picked = fd.get(`${name}__pick`);
      if (typeof picked === 'string') {
        const url = picked.trim();
        if (!url || url === current) return url;
        if (isKnownMediaUrl(url, 'image')) return url;
        warnings.push('The chosen image is not in the media library.');
        return current;
      }
      return fd.get(`${name}__remove`) === 'on' ? '' : current;
    }
    case 'gallery': {
      const prior = parseImages(String(existing?.[name] ?? '[]'));
      const keep = new Set(fd.getAll(`${name}__keep`).map(String));
      let kept = prior.filter((src) => keep.has(src)); // can only keep photos that already belong to this item
      const list = fd.get(`${name}__list`); // MediaGalleryField: ordered JSON array of kept + library-picked URLs
      if (typeof list === 'string') {
        let wanted: unknown = [];
        try {
          wanted = JSON.parse(list);
        } catch {
          /* ignore */
        }
        kept = (Array.isArray(wanted) ? wanted.map(String) : [])
          .filter((src, i, a) => a.indexOf(src) === i && (prior.includes(src) || isKnownMediaUrl(src, 'image')))
          .slice(0, 80);
      }
      const added: string[] = [];
      for (const file of fd.getAll(`${name}__files`)) {
        if (!isFile(file)) continue;
        try {
          added.push(await saveImage(file));
        } catch (err) {
          warnings.push(err instanceof Error ? err.message : 'Image could not be saved.');
        }
      }
      return JSON.stringify([...kept, ...added]);
    }
  }
}

function uniqueSlug(table: string, base: string): string {
  let slug = base;
  for (let n = 2; get(`SELECT 1 AS x FROM ${table} WHERE slug = ?`, slug); n++) slug = `${base}-${n}`;
  return slug;
}

// ------------------------------------------------------------------ insights / projects / products
// The legacy "insights" screen edits posts (all authors' posts); projects / products need manage_content.
const resourceCap = (key: string) => (key === 'insights' ? 'edit_others_posts' : 'manage_content');

export async function saveResource(key: string, idParam: string, fd: FormData) {
  const user = await requireCap(resourceCap(key));
  const r = RESOURCES[key];
  if (!r) go('/admin');

  const id = idParam === 'new' ? null : Number(idParam);
  const existing = id ? get<Record<string, any>>(`SELECT * FROM ${r.table} WHERE id = ?`, id) : undefined;
  if (id && !existing) go(`/admin/${key}`, { error: 'That item no longer exists.' });

  const warnings: string[] = [];
  const values: Record<string, string | number> = {};
  for (const def of r.fields) values[def.name] = await readField(def, fd, existing, warnings);

  const here = `/admin/${key}/${idParam}`;
  for (const def of r.fields) {
    if (def.required && !String(values[def.name]).trim()) go(here, { error: `“${def.label}” is required.` });
  }
  if (key === 'insights') {
    const url = String(values.external_url);
    if (url && !/^(https?:\/\/|\/)/i.test(url)) go(here, { error: 'The external link must start with https:// (or /).' });
  }

  if (r.slugFrom) {
    const typed = slugify(String(values.slug ?? ''));
    const base = typed || (existing?.slug ? String(existing.slug) : slugify(String(values[r.slugFrom])));
    let slug = base || 'item';
    for (let n = 2; get(`SELECT 1 AS x FROM ${r.table} WHERE slug = ? ${existing ? 'AND id <> ?' : ''}`, ...(existing ? [slug, existing.id] : [slug])); n++) slug = `${base || 'item'}-${n}`;
    values.slug = slug;
    if (existing && existing.slug && existing.slug !== slug && key === 'products') createRedirect(`/products/${existing.slug}`, `/products/${slug}`, 301);
  }

  const cols = Object.keys(values);
  if (existing) {
    run(`UPDATE ${r.table} SET ${cols.map((c) => `${c} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`, ...cols.map((c) => values[c]), existing.id);
  } else {
    run(`INSERT INTO ${r.table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, ...cols.map((c) => values[c]));
  }

  logActivity(user, existing ? 'update' : 'create', key, existing?.id ?? '', `${existing ? 'Updated' : 'Created'} ${r.singular} “${String(values[r.fields[0].name] ?? '').slice(0, 80)}”`);
  publish();
  go(`/admin/${key}`, { saved: '1', warn: warnings.join(' ') });
}

export async function deleteResource(key: string, id: number) {
  const user = await requireCap(resourceCap(key));
  const r = RESOURCES[key];
  if (!r) go('/admin');
  run(`DELETE FROM ${r.table} WHERE id = ?`, id);
  logActivity(user, 'delete', key, id, `Deleted ${r.singular} #${id}`);
  publish();
  go(`/admin/${key}`, { saved: '1' });
}

// (site settings are saved by app/admin/settings/actions.ts — requires manage_settings)

// ------------------------------------------------------------------ submissions
export async function updateSubmission(id: number, fd: FormData) {
  const user = await requireCap('view_submissions');
  const status = clip(fd.get('status'), 12);
  if (!['new', 'read', 'archived'].includes(status)) go(`/admin/submissions/${id}`, { error: 'Invalid status.' });
  run('UPDATE submissions SET status = ?, notes = ? WHERE id = ?', status, clip(fd.get('notes'), 5000), id);
  logActivity(user, 'update', 'submission', id, `Marked submission #${id} as ${status}`);
  go(`/admin/submissions/${id}`, { saved: '1' });
}

export async function deleteSubmission(id: number) {
  const user = await requireCap('view_submissions');
  run('DELETE FROM submissions WHERE id = ?', id);
  const dir = safeJoin(path.join(privateDir(), 'submissions'), String(id));
  if (dir) await rm(dir, { recursive: true, force: true });
  logActivity(user, 'delete', 'submission', id, `Deleted submission #${id}`);
  go('/admin/submissions', { saved: '1' });
}

// ------------------------------------------------------------------ account + admin users
export async function changePassword(fd: FormData) {
  const user = await requireUser();
  const [cur, next, again] = [String(fd.get('current') ?? ''), String(fd.get('next') ?? ''), String(fd.get('again') ?? '')];
  const row = get<{ password_hash: string }>('SELECT password_hash FROM users WHERE id = ?', user.id);
  if (!row || !(await verifyPassword(cur, row.password_hash))) go('/admin/account', { error: 'Your current password is not correct.' });
  const weak = passwordProblem(next, user);
  if (weak) go('/admin/account', { error: weak });
  if (next !== again) go('/admin/account', { error: 'The two new passwords don’t match.' });
  run('UPDATE users SET password_hash = ? WHERE id = ?', await hashPassword(next), user.id);
  run('DELETE FROM sessions WHERE user_id = ?', user.id); // sign out every other device…
  await createSession(user.id); // …but keep this one
  logActivity(user, 'change_password', 'user', user.id, 'Changed their password');
  go('/admin/account', { saved: '1' });
}

// (adding / editing / removing users lives in app/admin/users/actions.ts — requires manage_users)

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}

// kept for the dashboard's "mark all read" shortcut
export async function markAllRead() {
  await requireCap('view_submissions');
  run("UPDATE submissions SET status = 'read' WHERE status = 'new'");
  go('/admin/submissions', { saved: '1' });
}

