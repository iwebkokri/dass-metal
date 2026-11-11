import { Link } from 'react-router-dom';
import { company, footerLinks, logos } from '../data/site.js';
import { Icon } from './ui.jsx';

const socialIcon = { Facebook: Icon.Facebook, Instagram: Icon.Instagram, LinkedIn: Icon.Linkedin };

export default function Footer() {
  const { holiday } = company;
  return (
    <footer className="site-footer">
      {holiday && (
        <div className="holiday">
          <div className="container holiday__inner">
            <strong>Our Holiday Hours</strong>
            <span>{holiday.text}</span>
            <ul>
              {holiday.days.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="container site-footer__main">
        <div className="footer-brand">
          <Link to="/" aria-label="Dass Metal Products — home">
            <img src={logos.light} alt="Dass Metal Products" width="200" height="59" loading="lazy" />
          </Link>
          <p className="footer-tagline">{company.tagline}</p>
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
          <img className="footer-badge" src={logos.canadian} alt="Proudly Canadian" width="96" height="96" loading="lazy" />
        </div>

        <nav className="footer-col" aria-label="Quick links">
          <h2 className="footer-col__title">Quick Links</h2>
          <ul>
            {footerLinks.map((l) => (
              <li key={l.label}><Link to={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="footer-col">
          <h2 className="footer-col__title">Get In Touch</h2>
          <address>
            <a className="footer-line" href={company.mapUrl} target="_blank" rel="noopener noreferrer">
              <Icon.Pin /> <span>{company.address[0]}, {company.address[1]}</span>
            </a>
            {company.phones.map((p) => (
              <a className="footer-line" href={p.href} key={p.href}><Icon.Phone /> <span>{p.label}</span></a>
            ))}
            <a className="footer-line" href={`mailto:${company.email}`}><Icon.Mail /> <span>{company.email}</span></a>
            <span className="footer-line"><Icon.Clock /> <span>{company.hours}</span></span>
          </address>
        </div>

        <div className="footer-col footer-col--affil">
          <h2 className="footer-col__title">A JDass Corp Company</h2>
          <a href="https://dass.ca/" target="_blank" rel="noopener noreferrer" aria-label="JDass Corp">
            <img src={logos.jdassWhite} alt="JDass" width="200" height="71" loading="lazy" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <span>© {new Date().getFullYear()} | All Rights Reserved.</span>
          <span>{company.name} · {company.address[0]}, {company.address[1]}</span>
        </div>
      </div>
    </footer>
  );
}
