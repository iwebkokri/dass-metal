'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { headerDefaults } from '@/lib/site-content.mjs';
import { safeMediaUrl, safeUrl } from '@/lib/builder/url.mjs';
import { ArrowLink, Icon } from './ui.jsx';

/** Slim bar above the header: tagline, opening hours, first phone, email (all from Studio CMS > Settings). */
export function TopBar({ company, show = {} }) {
  const phone = company.phones[0];
  const on = (k) => show[k] !== false;
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <span className="topbar__tagline">{on('showTagline') ? company.tagline : ''}</span>
        <ul className="topbar__meta">
          {on('showHours') && company.hours && <li><Icon.Clock width={15} height={15} /> {company.hours}</li>}
          {on('showPhone') && phone && <li><a href={phone.href}><Icon.Phone width={15} height={15} /> {phone.label}</a></li>}
          {on('showEmail') && company.email && <li><a href={`mailto:${company.email}`}><Icon.Mail width={15} height={15} /> {company.email}</a></li>}
        </ul>
      </div>
    </div>
  );
}

const hoverCapable = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;
const pathOf = (url) => String(url || '').split('#')[0].split('?')[0];

function NavItem({ href, exact = false, children }) {
  const path = usePathname() || '/';
  const active = exact ? path === href : path === href || path.startsWith(`${href}/`);
  return (
    <Link href={href} className={`nav-link ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
      {children}
    </Link>
  );
}

/**
 * The site header. `config` is the "Header with menu" widget's props (logo, menu items, button); `menu` is the Products mega menu
 * (category -> group -> products). With no config it shows the standard Dass Metal header.
 */
export default function SiteHeader({ company, menu, config = headerDefaults }) {
  const [openId, setOpenId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || '/';
  const phone = company.phones[0];
  const nav = (Array.isArray(config.nav) ? config.nav : []).filter((it) => it && it.label);
  const logo = safeMediaUrl(config.logo) || safeMediaUrl(headerDefaults.logo);
  const ctaUrl = safeUrl(config.ctaUrl || '') || '/contact#quote';
  const ctaLabel = config.ctaLabel || 'Get a Quote';

  const close = useCallback(() => setOpenId(null), []);

  // close menus on navigation
  useEffect(() => {
    setOpenId(null);
    setMobileOpen(false);
  }, [pathname]);

  // shadow once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Esc closes; lock page scroll while the mobile drawer is open
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setOpenId(null); setMobileOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [mobileOpen]);

  const itemProps = (id) => ({
    onMouseEnter: () => hoverCapable() && setOpenId(id),
    onMouseLeave: () => hoverCapable() && setOpenId((cur) => (cur === id ? null : cur)),
    onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpenId((cur) => (cur === id ? null : cur)); },
  });
  const trigger = (id, label, active) => (
    <button
      type="button"
      className={`nav-link nav-link--btn ${active ? 'active' : ''}`}
      aria-expanded={openId === id}
      aria-controls={`menu-${id}`}
      // With a mouse the menu has already opened on hover, so a click must keep it open (not toggle it shut).
      // On touch / keyboard-only setups there is no hover, so the button toggles.
      onClick={() => setOpenId((cur) => (hoverCapable() ? id : cur === id ? null : id))}
    >
      {label} <Icon.Chevron width={14} height={14} />
    </button>
  );

  // Mega-menu columns: the first three categories get a column each, any others share the last one.
  const megaColumns = menu.length <= 4 ? menu.map((c) => [c]) : [[menu[0]], [menu[1]], [menu[2]], menu.slice(3)];

  const renderGroup = (g, gi) => (
    <div className="mega__group" key={gi}>
      {g.title && <h3 className="mega__group-title">{g.title}</h3>}
      <ul>
        {g.items.map((p) => (
          <li key={p.slug}><Link href={`/products/${p.slug}`} onClick={close}>{p.name}</Link></li>
        ))}
      </ul>
    </div>
  );

  const inProducts = pathname.startsWith('/products') || pathname === '/our-products';
  const childLink = (c, drawer = false) => {
    const url = safeUrl(c.url || '') || '/';
    return c.pdf
      ? <a href={url} target="_blank" rel="noopener noreferrer" onClick={drawer ? undefined : close}>{c.label}{drawer ? ' (PDF)' : <> <span className="menu__tag">PDF</span></>}</a>
      : <Link href={url} onClick={drawer ? undefined : close}>{c.label}</Link>;
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={`${company.name} — home`}>
          <img src={logo} alt={config.logoAlt || company.name} width="170" height="50" />
        </Link>

        <nav className="primary-nav" aria-label="Main">
          <ul>
            {nav.map((it, i) => {
              const id = `m${i}`;
              if (it.type === 'products') {
                return (
                  <li className="has-menu has-mega" key={id} {...itemProps(id)}>
                    {trigger(id, it.label, inProducts)}
                    <div className="mega" id={`menu-${id}`} hidden={openId !== id}>
                      <div className="container mega__inner">
                        <div className="mega__cols">
                          {megaColumns.map((col, ci) => (
                            <div className={`mega__col ${col.some((c) => c.groups.length > 2) ? 'mega__col--wide' : ''}`} key={ci}>
                              {col.map((cat) => (
                                <section className="mega__cat" key={cat.title}>
                                  <h2 className="mega__cat-title">{cat.title}</h2>
                                  {cat.groups.length > 2 ? (
                                    // long categories flow into two sub-columns (groups alternate left / right)
                                    <div className="mega__split">
                                      {[0, 1].map((half) => (
                                        <div key={half}>{cat.groups.filter((_, gi) => gi % 2 === half).map(renderGroup)}</div>
                                      ))}
                                    </div>
                                  ) : (
                                    cat.groups.map(renderGroup)
                                  )}
                                </section>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="mega__foot">
                          <ArrowLink to={safeUrl(config.megaUrl || '') || '/our-products'} onClick={close}>{config.megaLabel || 'View all products'}</ArrowLink>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }
              if (it.type === 'dropdown') {
                const kids = Array.isArray(it.children) ? it.children : [];
                const active = !!it.markActive && kids.some((c) => !c.pdf && pathOf(c.url) === pathname);
                return (
                  <li className="has-menu" key={id} {...itemProps(id)}>
                    {trigger(id, it.label, active)}
                    <div className="menu" id={`menu-${id}`} hidden={openId !== id}>
                      <ul>{kids.map((c, k) => <li key={k}>{childLink(c)}</li>)}</ul>
                    </div>
                  </li>
                );
              }
              const url = safeUrl(it.url || '') || '/';
              return <li key={id}><NavItem href={url} exact={url === '/'}>{it.label}</NavItem></li>;
            })}
          </ul>
        </nav>

        <Link className="btn btn--blue header-cta" href={ctaUrl}>{ctaLabel}</Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <Icon.Close /> : <Icon.Menu />}
        </button>
      </div>

      {/* any link inside the drawer closes it (a same-page #anchor does not change the path) */}
      <nav className="drawer" id="mobile-nav" aria-label="Mobile" hidden={!mobileOpen} onClick={(e) => { if (e.target.closest?.('a')) setMobileOpen(false); }}>
        <ul className="drawer__list">
          {nav.map((it, i) => {
            if (it.type === 'products') {
              return (
                <li key={i}>
                  <details>
                    <summary>{it.label}</summary>
                    <div className="drawer__products">
                      <Link href={safeUrl(config.megaUrl || '') || '/our-products'} className="drawer__all">All products</Link>
                      {menu.map((cat) => (
                        <details key={cat.title} className="drawer__cat">
                          <summary>{cat.title}</summary>
                          {cat.groups.map((g, gi) => (
                            <div key={gi}>
                              {g.title && <p className="drawer__group">{g.title}</p>}
                              <ul>
                                {g.items.map((pr) => (
                                  <li key={pr.slug}><Link href={`/products/${pr.slug}`}>{pr.name}</Link></li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </details>
                      ))}
                    </div>
                  </details>
                </li>
              );
            }
            if (it.type === 'dropdown') {
              return (
                <li key={i}>
                  <details>
                    <summary>{it.label}</summary>
                    <ul>{(Array.isArray(it.children) ? it.children : []).map((c, k) => <li key={k}>{childLink(c, true)}</li>)}</ul>
                  </details>
                </li>
              );
            }
            return <li key={i}><Link href={safeUrl(it.url || '') || '/'}>{it.label}</Link></li>;
          })}
        </ul>
        <div className="drawer__cta">
          {phone && <a className="btn btn--ghost-light" href={phone.href}><Icon.Phone /> {config.callLabel || 'Call'} {phone.label}</a>}
          <Link className="btn btn--blue" href={ctaUrl}>{ctaLabel}</Link>
        </div>
      </nav>
    </header>
  );
}
