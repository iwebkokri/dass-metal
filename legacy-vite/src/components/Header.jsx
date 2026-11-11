import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { company, logos, resources } from '../data/site.js';
import { productBySlug, productMenu } from '../data/catalog.js';
import { ArrowLink, Icon } from './ui.jsx';

export function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <span className="topbar__tagline">{company.tagline}</span>
        <ul className="topbar__meta">
          <li><Icon.Clock width={15} height={15} /> {company.hours}</li>
          <li><a href={company.phones[0].href}><Icon.Phone width={15} height={15} /> {company.phones[0].label}</a></li>
          <li><a href={`mailto:${company.email}`}><Icon.Mail width={15} height={15} /> {company.email}</a></li>
        </ul>
      </div>
    </div>
  );
}

// Mega-menu columns: Interior | Exterior | Drywall | Acoustic + Rebar
const megaColumns = [[0], [1], [2], [3, 4]].map((idx) => idx.map((i) => productMenu[i]));

const hoverCapable = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;

export default function Header() {
  const [openId, setOpenId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const close = useCallback(() => setOpenId(null), []);

  // close menus on navigation
  useEffect(() => {
    setOpenId(null);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  // compact header + shadow once the page has scrolled
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

  const renderGroup = (g, gi) => (
    <div className="mega__group" key={gi}>
      {g.title && <h3 className="mega__group-title">{g.title}</h3>}
      <ul>
        {g.items.map((slug) => (
          <li key={slug}><Link to={`/products/${slug}`} onClick={close}>{productBySlug[slug].title}</Link></li>
        ))}
      </ul>
    </div>
  );

  const inProducts = location.pathname.startsWith('/products') || location.pathname === '/our-products';
  const inAbout = location.pathname === '/about';

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Dass Metal Products — home">
          <img src={logos.light} alt="Dass Metal Products" width="170" height="50" />
        </Link>

        <nav className="primary-nav" aria-label="Main">
          <ul>
            <li><NavLink to="/" end className="nav-link">Home</NavLink></li>

            <li className="has-menu" {...itemProps('about')}>
              {trigger('about', 'About Us', inAbout)}
              <div className="menu" id="menu-about" hidden={openId !== 'about'}>
                <ul>
                  <li><Link to="/about" onClick={close}>About Us</Link></li>
                  <li><Link to="/about#diversebrands" onClick={close}>JDass Brands</Link></li>
                </ul>
              </div>
            </li>

            <li className="has-menu has-mega" {...itemProps('products')}>
              {trigger('products', 'Products', inProducts)}
              <div className="mega" id="menu-products" hidden={openId !== 'products'}>
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
                                  <div key={half}>{cat.groups.filter((_, i) => i % 2 === half).map(renderGroup)}</div>
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
                    <ArrowLink to="/our-products" onClick={close}>View all products</ArrowLink>
                  </div>
                </div>
              </div>
            </li>

            <li className="has-menu" {...itemProps('resources')}>
              {trigger('resources', 'Resources')}
              <div className="menu" id="menu-resources" hidden={openId !== 'resources'}>
                <ul>
                  {resources.map((r) => (
                    <li key={r.label}>
                      {r.file ? (
                        <a href={r.href} target="_blank" rel="noopener noreferrer" onClick={close}>{r.label} <span className="menu__tag">PDF</span></a>
                      ) : (
                        <Link to={r.href} onClick={close}>{r.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li><NavLink to="/projects" className="nav-link">Projects</NavLink></li>
            <li><NavLink to="/blogs" className="nav-link">Blogs</NavLink></li>
            <li><NavLink to="/contact" className="nav-link">Contact Us</NavLink></li>
          </ul>
        </nav>

        <Link className="btn btn--blue header-cta" to="/contact#quote">Get a Quote</Link>

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

      <nav className="drawer" id="mobile-nav" aria-label="Mobile" hidden={!mobileOpen}>
        <ul className="drawer__list">
          <li><Link to="/">Home</Link></li>
          <li>
            <details>
              <summary>About Us</summary>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/about#diversebrands">JDass Brands</Link></li>
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>Products</summary>
              <div className="drawer__products">
                <Link to="/our-products" className="drawer__all">All products</Link>
                {productMenu.map((cat) => (
                  <details key={cat.title} className="drawer__cat">
                    <summary>{cat.title}</summary>
                    {cat.groups.map((g, gi) => (
                      <div key={gi}>
                        {g.title && <p className="drawer__group">{g.title}</p>}
                        <ul>
                          {g.items.map((slug) => (
                            <li key={slug}><Link to={`/products/${slug}`}>{productBySlug[slug].title}</Link></li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </details>
                ))}
              </div>
            </details>
          </li>
          <li>
            <details>
              <summary>Resources</summary>
              <ul>
                {resources.map((r) => (
                  <li key={r.label}>
                    {r.file ? <a href={r.href} target="_blank" rel="noopener noreferrer">{r.label} (PDF)</a> : <Link to={r.href}>{r.label}</Link>}
                  </li>
                ))}
              </ul>
            </details>
          </li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
        <div className="drawer__cta">
          <a className="btn btn--ghost-light" href={company.phones[0].href}><Icon.Phone /> Call {company.phones[0].label}</a>
          <Link className="btn btn--blue" to="/contact#quote">Get a Quote</Link>
        </div>
      </nav>
    </header>
  );
}
