'use client';

import Link from 'next/link';
import { footerDefaults } from '@/lib/site-content.mjs';
import { safeMediaUrl, safeUrl } from '@/lib/builder/url.mjs';
import { Icon } from './ui.jsx';

const socialIcon = { Facebook: Icon.Facebook, Instagram: Icon.Instagram, LinkedIn: Icon.Linkedin };

/**
 * Footer. `config` is the "Footer" widget's props (logo, links, last column, copyright); contact details, social links and the
 * holiday bar come from Studio CMS > Settings through `company`. With no config it shows the standard Dass Metal footer.
 */
export default function SiteFooter({ company, config = footerDefaults }) {
  const { holiday } = company;
  const address = company.address.join(', ');
  const c = { ...footerDefaults, ...config };
  const logo = safeMediaUrl(c.logo);
  const badge = safeMediaUrl(c.badge);
  const affilLogo = safeMediaUrl(c.affilLogo);
  const affilUrl = safeUrl(c.affilUrl || '');
  const links = (Array.isArray(c.links) ? c.links : []).filter((l) => l && l.label);
  return (
    <footer className="site-footer">
      {holiday && (
        <div className="holiday">
          <div className="container holiday__inner">
            <strong>{c.holidayTitle}</strong>
            <span>{holiday.text}</span>
            {holiday.days.length > 0 && (
              <ul>
                {holiday.days.map((d) => <li key={d}>{d}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="container site-footer__main">
        <div className="footer-brand">
          <Link href="/" aria-label={`${company.name} — home`}>
            {logo ? <img src={logo} alt={c.logoAlt || company.name} width="200" height="59" loading="lazy" /> : null}
          </Link>
          <p className="footer-tagline">{company.tagline}</p>
          {company.social.length > 0 && (
            <ul className="social" aria-label="Social media">
              {company.social.map((s) => {
                const I = socialIcon[s.name];
                return (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Dass Metal on ${s.name}`}><I width={20} height={20} /></a>
                  </li>
                );
              })}
            </ul>
          )}
          {badge ? <img className="footer-badge" src={badge} alt={c.badgeAlt || ''} width="96" height="96" loading="lazy" /> : null}
        </div>

        <nav className="footer-col" aria-label="Quick links">
          <h2 className="footer-col__title">{c.linksTitle}</h2>
          <ul>
            {links.map((l, i) => (
              <li key={i}><Link href={safeUrl(l.url || '') || '/'}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="footer-col">
          <h2 className="footer-col__title">{c.contactTitle}</h2>
          <address>
            {address && (company.mapUrl ? (
              <a className="footer-line" href={company.mapUrl} target="_blank" rel="noopener noreferrer"><Icon.Pin /> <span>{address}</span></a>
            ) : (
              <span className="footer-line"><Icon.Pin /> <span>{address}</span></span>
            ))}
            {company.phones.map((p) => (
              <a className="footer-line" href={p.href} key={p.href}><Icon.Phone /> <span>{p.label}</span></a>
            ))}
            {company.email && <a className="footer-line" href={`mailto:${company.email}`}><Icon.Mail /> <span>{company.email}</span></a>}
            {company.hours && <span className="footer-line"><Icon.Clock /> <span>{company.hours}</span></span>}
          </address>
        </div>

        <div className="footer-col footer-col--affil">
          <h2 className="footer-col__title">{c.affilTitle}</h2>
          {affilLogo ? (
            affilUrl ? (
              <a href={affilUrl} target="_blank" rel="noopener noreferrer" aria-label={c.affilAlt || 'Company website'}>
                <img src={affilLogo} alt={c.affilAlt || ''} width="200" height="71" loading="lazy" />
              </a>
            ) : (
              <img src={affilLogo} alt={c.affilAlt || ''} width="200" height="71" loading="lazy" />
            )
          ) : null}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <span>{String(c.copyright || '').replace(/\{year\}/g, String(new Date().getFullYear()))}</span>
          <span>{company.name}{address ? ` · ${address}` : ''}</span>
        </div>
      </div>
    </footer>
  );
}
