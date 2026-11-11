import { company, navLinks } from '../data/content.js';

export function Logo() {
  return (
    <span className="logo">
      <span className="logo__mark">D</span>
      <span className="logo__text">
        <span className="logo__name">DASS METAL</span>
        <span className="logo__sub">PRODUCTS</span>
      </span>
    </span>
  );
}

export default function Header() {
  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <span>Canadian-made steel framing · Mississauga, Ontario · Delivering across Canada &amp; the US</span>
          <div className="utility-bar__meta">
            <a href={company.phoneHref}>{company.phone}</a>
            <span className="muted-dark">{company.hours}</span>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <a href="#top" aria-label="Dass Metal Products home"><Logo /></a>
          <nav aria-label="Main" className="site-nav">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
          <a href="#quote" className="btn btn--accent">Request a Quote</a>
        </div>
      </header>
    </>
  );
}
