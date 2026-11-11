// What the public header and footer need, built from the Studio CMS (Settings + Products). Server only.
import { getProducts, productMenu } from './content';
import { getSiteSettings, SITE_DEFAULTS } from './settings';

export type Company = {
  name: string;
  tagline: string;
  phones: { label: string; href: string }[];
  email: string;
  hours: string;
  address: string[];
  mapUrl: string;
  social: { name: string; href: string }[];
  holiday: { text: string; days: string[] } | null;
};

export type MenuCategory = { title: string; groups: { title: string; items: { slug: string; name: string }[] }[] };

const tel = (label: string) => {
  const digits = label.replace(/\D/g, '');
  return digits.length === 10 ? `tel:+1${digits}` : digits ? `tel:+${digits}` : '';
};

export function getCompany(): Company {
  const s = getSiteSettings();
  const phones = [s.contact_phone, s.contact_phone2].filter(Boolean).map((label) => ({ label, href: tel(label) }));
  const social = [
    { name: 'Facebook', href: s.social_facebook },
    { name: 'Instagram', href: s.social_instagram },
    { name: 'LinkedIn', href: s.social_linkedin },
  ].filter((x) => /^https?:\/\//i.test(x.href));
  // "Dass Metal office will be closed on: Thursday, December 25 | Friday, December 26"
  let holiday: Company['holiday'] = null;
  const note = s.holiday_notice.trim();
  if (note) {
    const i = note.indexOf(':');
    holiday = i > 0 ? { text: note.slice(0, i + 1).trim(), days: note.slice(i + 1).split('|').map((d) => d.trim()).filter(Boolean) } : { text: note, days: [] };
  }
  const address = s.contact_address.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return {
    name: s.site_title || SITE_DEFAULTS.title,
    tagline: 'Quality · Value · Customized Solutions',
    phones,
    email: s.contact_email,
    hours: s.contact_hours,
    address,
    mapUrl: /^https?:\/\//i.test(s.contact_map_url) ? s.contact_map_url : '',
    social,
    holiday,
  };
}

/** Category -> group -> products for the header's Products menu. */
export function getMenu(): MenuCategory[] {
  return productMenu(getProducts()).map((c) => ({
    title: c.title,
    groups: c.groups.map((g) => ({ title: g.title, items: g.items.map((p) => ({ slug: p.slug, name: p.name })) })),
  }));
}
