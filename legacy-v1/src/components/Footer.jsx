import { company } from '../data/content.js';
import { Logo } from './Header.jsx';

const columns = [
  { title: 'Company', links: [['About', '#about'], ['Service Area', '#service-area'], ['Guides', '#guides'], ['Request a Quote', '#quote']] },
  { title: 'Resources', links: [['Technical Resources', '#resources'], ['Certifications', '#resources'], ['Terms & Conditions', '#contact'], ['Privacy Policy', '#contact']] },
];

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container site-footer__inner">
        <div className="footer-grid">
          <div className="stack-16">
            <Logo />
            <p className="muted-dark small-plus">Canadian family-owned manufacturer of metal studs, track and drywall accessories for contractors, distributors and builders across Canada and the US.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="footer-col">
              <h3 className="footer-col__title">{col.title}</h3>
              {col.links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
            </div>
          ))}
          <div className="footer-col">
            <h3 className="footer-col__title">Contact</h3>
            <a href={company.phoneHref}>{company.phone}</a>
            <span>{company.email}</span>
            <span>{company.address[0]}<br />{company.address[1]}</span>
            <span className="muted-dark">{company.hours}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Dass Metal Products. A JDASS company.</span>
          <span>Quality · Value · Customized Solutions</span>
        </div>
      </div>
    </footer>
  );
}
