import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Icon, SlotBar } from './ui.jsx';
import { Reveal, useInView } from './Reveal.jsx';

/**
 * Full-width split band: photo on one half, solid colour with the message on the other.
 * Effects: the photo wipes in and settles from a zoom, drifts gently as you scroll (parallax),
 * the copy rises in one line after another, and the button fills with a sweep on hover.
 */
export default function FeatureRow({ label, title, text, to, image, alt, flip = false, tone = 'charcoal' }) {
  const [ref, seen] = useInView({ rootMargin: '0px 0px -12% 0px' });
  const imgRef = useRef(null);

  // parallax: the photo drifts a little slower than the page (skipped for reduced motion)
  useEffect(() => {
    const row = ref.current;
    const img = imgRef.current;
    if (!row || !img || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = row.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      // -1 when the row is entering from below, +1 when it is leaving at the top
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2 + r.height / 2);
      img.style.setProperty('--py', `${(p * 38).toFixed(1)}px`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);

  return (
    <article ref={ref} className={`feature-row feature-row--${tone} ${flip ? 'is-flip' : ''} ${seen ? 'is-in' : ''}`}>
      <div className="feature-row__body">
        <div className="feature-row__copy">
          <SlotBar />
          <Reveal delay={80}><Eyebrow light>{label}</Eyebrow></Reveal>
          <Reveal as="h2" className="h2 h2--light" delay={150}>{title}</Reveal>
          <Reveal as="p" className="feature-row__text" delay={230}>{text}</Reveal>
          <Reveal delay={310}>
            <Link className="btn btn--ghost-light btn--lg btn--sweep" to={to} aria-label={`Learn more: ${title}`}>
              Learn More <Icon.Arrow />
            </Link>
          </Reveal>
        </div>
      </div>
      <div className="feature-row__media">
        <img ref={imgRef} className="feature-row__img" src={image} alt={alt} loading="lazy" decoding="async" />
      </div>
    </article>
  );
}
