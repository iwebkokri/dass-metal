import { useEffect, useState } from 'react';
import { slides, products } from '../data/content.js';

const INTERVAL = 6500;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const count = slides.length;

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(id);
  }, [paused, count]);

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const ticker = [...products, ...products];

  return (
    <section id="top" className="hero" aria-roledescription="carousel" aria-label="Dass Metal highlights">
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.title}
            className={`hero__slide ${active ? 'is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
            style={{
              background: s.image ? `center / cover no-repeat url(${s.image}), ${s.bg}` : s.bg,
            }}
          >
            {!s.image && <span className="hero__photo-label">[FULL-BLEED PHOTO] {s.photo}</span>}
            <div className="container hero__content">
              <span className="hero__eyebrow"><span className="hero__eyebrow-line" />{s.eyebrow}</span>
              {i === 0 ? <h1 className="hero__title">{s.title}</h1> : <h2 className="hero__title">{s.title}</h2>}
              <p className="hero__text">{s.text}</p>
              <div className="btn-row">
                <a href={s.primary.href} className="btn btn--accent btn--lg" tabIndex={active ? 0 : -1}>{s.primary.label}</a>
                <a href="#quote" className="btn btn--ghost-light btn--lg" tabIndex={active ? 0 : -1}>Request a quote</a>
              </div>
            </div>
          </div>
        );
      })}

      <div className="hero__controls">
        <div className="container hero__controls-inner">
          <div className="hero__dots">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                className="hero__dot"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              >
                <span className={`hero__dot-bar ${i === index ? 'is-active' : ''}`} />
              </button>
            ))}
            <span className="hero__counter">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
          </div>
          <div className="hero__arrows">
            <button type="button" className="icon-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>
              {paused ? '▶' : 'II'}
            </button>
            <button type="button" className="icon-btn" onClick={prev} aria-label="Previous slide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" className="icon-btn icon-btn--solid" onClick={next} aria-label="Next slide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="ticker" aria-label="Products">
        <div className="ticker__track">
          {ticker.map((p, i) => (
            <span key={i} className="ticker__item" aria-hidden={i >= products.length}>
              {p}<span className="ticker__diamond" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
