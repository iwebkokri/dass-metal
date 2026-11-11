import { Link } from 'react-router-dom';
import { formatDate } from '../lib/helpers.js';
import { Reveal, useInView } from './Reveal.jsx';

const stroke = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'square', 'aria-hidden': true, focusable: 'false' };
const solid = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, focusable: 'false' };

export const Icon = {
  Arrow: (p) => <svg {...stroke} {...p}><path d="M4 12h15M13 6l6 6-6 6" /></svg>,
  Chevron: (p) => <svg {...stroke} strokeWidth={2} {...p}><path d="M6 9l6 6 6-6" /></svg>,
  Phone: (p) => <svg {...stroke} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z" /></svg>,
  Mail: (p) => <svg {...stroke} {...p}><path d="M3 5h18v14H3zM3 6l9 7 9-7" /></svg>,
  Pin: (p) => <svg {...stroke} {...p}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z" /><circle cx="12" cy="9.500" r="2.500" /></svg>,
  Clock: (p) => <svg {...stroke} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.500 2" /></svg>,
  Menu: (p) => <svg {...stroke} width={24} height={24} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>,
  Close: (p) => <svg {...stroke} width={24} height={24} {...p}><path d="M5 5l14 14M19 5L5 19" /></svg>,
  Play: (p) => <svg {...solid} {...p}><path d="M7 4.5v15l12-7.5z" /></svg>,
  Pause: (p) => <svg {...solid} {...p}><path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" /></svg>,
  Check: (p) => <svg {...stroke} strokeWidth={2.200} {...p}><path d="M4 12.500l5 5L20 6.500" /></svg>,
  Download: (p) => <svg {...stroke} {...p}><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>,
  External: (p) => <svg {...stroke} width={14} height={14} {...p}><path d="M9 5H5v14h14v-4M13 4h7v7M20 4l-9 9" /></svg>,
  Search: (p) => <svg {...stroke} {...p}><circle cx="11" cy="11" r="6.500" /><path d="M16 16l4.500 4.500" /></svg>,
  Facebook: (p) => <svg {...solid} {...p}><path d="M14 8V6.500c0-.7.300-1 1-1h2V2h-3a4 4 0 0 0-4 4v2H7.500v3.500H10V22h4v-10.500h2.800L17.300 8z" /></svg>,
  Instagram: (p) => <svg {...stroke} strokeWidth={1.700} {...p}><rect x="3.500" y="3.500" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.300" cy="6.700" r=".6" fill="currentColor" /></svg>,
  Linkedin: (p) => <svg {...solid} {...p}><path d="M4 9h4v11H4zM6 3.500a2.300 2.300 0 1 1 0 4.600 2.300 2.300 0 0 1 0-4.600zM10 9h3.800v1.600C14.500 9.500 15.800 8.800 17.500 8.800c3 0 3.500 2 3.500 4.600V20h-4v-5.800c0-1.400 0-3-1.800-3S14 12.700 14 14.100V20h-4z" /></svg>,
  X: (p) => <svg {...solid} {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
};

export function ArrowLink({ to, href, children, className = '', ...rest }) {
  const content = (
    <>
      {children}
      <Icon.Arrow />
    </>
  );
  if (href) return <a className={`arrow-link ${className}`} href={href} {...rest}>{content}</a>;
  return <Link className={`arrow-link ${className}`} to={to} {...rest}>{content}</Link>;
}

export function Eyebrow({ children, light = false }) {
  return <span className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>{children}</span>;
}

/** Decorative bar echoing the slots punched in slotted deflection track; wipes in when it scrolls into view. */
export function SlotBar({ className = '' }) {
  const [ref, seen] = useInView({ rootMargin: '0px' });
  return <div ref={ref} className={`slot-bar ${seen ? 'is-in' : ''} ${className}`} aria-hidden="true" />;
}

export function SectionHeading({ eyebrow, title, text, className = '', id, as: Tag = 'h2' }) {
  return (
    <Reveal className={`section-heading ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag className="h2" id={id}>{title}</Tag>
      {text && <p className="lead">{text}</p>}
    </Reveal>
  );
}

export function PageHero({ title, lead, crumbs = [], children }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <nav aria-label="Breadcrumb" className="crumbs">
          <ol>
            <li><Link to="/">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.label}><Link to={c.to}>{c.label}</Link></li>
            ))}
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        <h1 className="page-hero__title">{title}</h1>
        {lead && <p className="page-hero__lead">{lead}</p>}
        {children}
      </div>
      <SlotBar className="slot-bar--bottom" />
    </section>
  );
}

export function ProductCard({ product, tag, index = 0 }) {
  return (
    <Reveal fill delay={(index % 4) * 80}>
    <Link to={`/products/${product.slug}`} className="pcard">
      <div className="pcard__media">
        <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
      </div>
      <div className="pcard__body">
        {tag && <span className="tag">{tag}</span>}
        <h3 className="pcard__title">{product.title}</h3>
        <p className="pcard__text">{product.excerpt}</p>
        <span className="arrow-link">View product <Icon.Arrow /></span>
      </div>
    </Link>
    </Reveal>
  );
}

export function PostCard({ post, index = 0 }) {
  return (
    <Reveal fill delay={(index % 3) * 90}>
    <Link to={`/${post.slug}`} className="postcard">
      <div className="postcard__media">
        <img src={post.image} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="postcard__body">
        <time className="tag" dateTime={post.date}>{formatDate(post.date)}</time>
        <h3 className="postcard__title">{post.title}</h3>
        <p className="postcard__text">{post.excerpt}</p>
        <span className="arrow-link">Read more <Icon.Arrow /></span>
      </div>
    </Link>
    </Reveal>
  );
}

export function CtaBand({
  title = 'We Look Forward To Serving You.',
  text = 'Fill out the form to have a Dass representative help save you time and money on your next project.',
  label = 'Request A Quote Now',
  to = '/contact#quote',
}) {
  return (
    <section className="cta-band band-dark">
      <Reveal className="container cta-band__inner">
        <div className="stack-16">
          <h2 className="h2 h2--light">{title}</h2>
          <p className="lead lead--dark">{text}</p>
        </div>
        <Link className="btn btn--blue btn--lg" to={to}>{label}</Link>
      </Reveal>
    </section>
  );
}
