import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Icon } from './ui.jsx';

const DURATION = 7500; // ms each slide stays up

const pad = (n) => String(n).padStart(2, '0');
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Full-bleed hero carousel.
 *  - autoplay with a per-slide progress bar; pauses on hover, keyboard focus, hidden tab, off-screen and via the pause button
 *  - arrows, dots, ←/→ keys, touch swipe
 *  - starts paused for visitors who prefer reduced motion
 */
export default function HeroSlider({ slides }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(reducedMotion);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [away, setAway] = useState(false); // tab hidden or hero scrolled out of view
  const [rendered, setRendered] = useState(() => new Set([0, 1])); // only fetch images for slides that are about to be shown
  const paused = userPaused || hover || focusIn || away;

  const rootRef = useRef(null);
  const barRefs = useRef([]);
  const elapsed = useRef(0);
  const swipe = useRef(null);

  const go = useCallback((i) => {
    elapsed.current = 0;
    setIndex(((i % n) + n) % n);
  }, [n]);

  // fetch the neighbours of the current slide
  useEffect(() => {
    setRendered((prev) => {
      const next = new Set(prev);
      next.add(index); next.add((index + 1) % n); next.add((index - 1 + n) % n);
      return next.size === prev.size ? prev : next;
    });
  }, [index, n]);

  // reset progress bars when the slide changes
  useEffect(() => {
    barRefs.current.forEach((b) => b && b.style.setProperty('--p', '0'));
  }, [index]);

  // progress clock: advances only while not paused, so the bar and the timer never drift apart
  useEffect(() => {
    if (paused) return undefined;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      elapsed.current += now - last;
      last = now;
      const p = Math.min(1, elapsed.current / DURATION);
      barRefs.current[index]?.style.setProperty('--p', p.toFixed(3));
      if (p >= 1) go(index + 1);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, paused, go]);

  // pause while the tab is hidden or the hero is off-screen
  useEffect(() => {
    const onVis = () => setAway(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    let io;
    if (typeof IntersectionObserver !== 'undefined' && rootRef.current) {
      io = new IntersectionObserver(([e]) => setAway(!e.isIntersecting), { threshold: 0.2 });
      io.observe(rootRef.current);
    }
    return () => { document.removeEventListener('visibilitychange', onVis); io?.disconnect(); };
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { go(index - 1); }
    if (e.key === 'ArrowRight') { go(index + 1); }
  };
  const onPointerDown = (e) => { if (e.pointerType !== 'mouse') swipe.current = e.clientX; };
  const onPointerUp = (e) => {
    if (swipe.current == null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      ref={rootRef}
      className={`hero ${userPaused ? 'is-static' : ''}`}
      aria-roledescription="carousel"
      aria-label="Dass Metal Products highlights"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocusIn(false); }}
      onKeyDown={onKeyDown}
    >
      <h1 className="sr-only">Dass Metal Products — Leading Manufacturers of Building Products</h1>

      <div className="hero__slides" aria-live={paused ? 'polite' : 'off'} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { swipe.current = null; }}>
        {slides.map((s, i) => (
          <div
            key={s.title}
            className={`hero__slide ${i === index ? 'is-active' : ''} ${s.side === 'right' ? 'hero__slide--right' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
            aria-hidden={i !== index}
          >
            {rendered.has(i) && (
              <img
                className="hero__bg"
                src={s.image}
                alt=""
                style={s.position ? { objectPosition: s.position } : undefined}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchpriority={i === 0 ? 'high' : undefined}
                decoding="async"
              />
            )}
            <div className="hero__shade" />
            <div className="container hero__inner">
              <div className="hero__copy">
                <div style={{ '--i': 0 }}><Eyebrow light>{s.eyebrow}</Eyebrow></div>
                <h2 className="hero__title" style={{ '--i': 1 }}>{s.title}</h2>
                <p className="hero__text" style={{ '--i': 2 }}>{s.text}</p>
                <div className="btn-row" style={{ '--i': 3 }}>
                  {s.ctas.map((c, k) => (
                    <Link key={c.label} className={`btn btn--lg ${k === 0 ? 'btn--blue' : 'btn--ghost-light'}`} to={c.to}>{c.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero__controls">
        <div className="container hero__controls-inner">
          <div className="hero__dots" role="group" aria-label="Choose a slide">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                className={`hero__dot ${i === index ? 'is-active' : ''} ${i < index ? 'is-done' : ''}`}
                aria-label={`Show slide ${i + 1}: ${s.title}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
              >
                <span className="hero__dot-bar"><span className="hero__dot-fill" ref={(el) => { barRefs.current[i] = el; }} /></span>
              </button>
            ))}
          </div>
          <div className="hero__ctrl">
            <span className="hero__counter" aria-hidden="true">{pad(index + 1)} <i /> {pad(n)}</span>
            <button type="button" className="icon-btn" aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setUserPaused((p) => !p)}>
              {userPaused ? <Icon.Play /> : <Icon.Pause />}
            </button>
            <button type="button" className="icon-btn" aria-label="Previous slide" onClick={() => go(index - 1)}><Icon.Arrow style={{ transform: 'rotate(180deg)' }} /></button>
            <button type="button" className="icon-btn" aria-label="Next slide" onClick={() => go(index + 1)}><Icon.Arrow /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
