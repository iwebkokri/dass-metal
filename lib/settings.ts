// Site-wide settings (stored in the `settings` table). Read side is defensive: an empty / unreadable DB yields the defaults.
import { all } from './db';
import { PALETTE } from './builder/schema.mjs';
import { parsePalette, type PaletteEntry } from './palette';

/** Hard-coded values the site used before the settings screen existed — used whenever a setting is empty. */
export const SITE_DEFAULTS = {
  title: 'Dass Metal Products',
  tagline: 'Steel Studs & Metal Framing',
  description:
    'Get quality steel studs, tracks, and framing systems made in Canada. Trusted by builders across Ontario for on-time delivery and precision.',
  favicon: '/favicon.png',
};

export const SITE_KEYS = [
  'site_title', 'site_tagline', 'site_logo', 'site_favicon',
  'contact_phone', 'contact_phone2', 'contact_email', 'contact_address', 'contact_hours', 'contact_map_url',
  'social_facebook', 'social_instagram', 'social_linkedin', 'holiday_notice',
  'seo_default_description', 'seo_default_og_image',
  'design_palette',
] as const;
export type SiteKey = (typeof SITE_KEYS)[number];
export type SiteSettings = Record<SiteKey, string>;

/** Settings that must never leave the server in an export (SMTP credentials, tokens, secrets). */
export const SECRET_KEY = /(smtp|pass(word|wd)?|secret|token|api[_-]?key|private|credential)/i;

export function getSiteSettings(): SiteSettings {
  const out = Object.fromEntries(SITE_KEYS.map((k) => [k, ''])) as SiteSettings;
  try {
    const rows = all<{ key: string; value: string }>(`SELECT key, value FROM settings WHERE key IN (${SITE_KEYS.map(() => '?').join(',')})`, ...SITE_KEYS);
    for (const r of rows) out[r.key as SiteKey] = String(r.value ?? '').trim();
  } catch {
    /* DB missing / empty: fall back to the defaults */
  }
  return out;
}

/** The brand colour list the page builder offers (settings → Design), falling back to the built-in palette. */
export function getPalette(): PaletteEntry[] {
  return parsePalette(getSiteSettings().design_palette) ?? (PALETTE as PaletteEntry[]);
}
