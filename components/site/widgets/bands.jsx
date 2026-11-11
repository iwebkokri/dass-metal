'use client';

// Full-bleed bands: hero slider, photo + message band, product ticker. Same look and motion as the original design;
// in the builder the slider holds still on the slide you are editing.
import { useCallback, useEffect, useRef, useState } from 'react';
import { safeMediaUrl } from '@/lib/builder/url.mjs';
import { Icon, SlotBar } from '../ui.jsx';
import { useInView } from '../Reveal.jsx';
import { DLink, ImgChip, Rv, T, list, useEditAttrs } from '../edit.jsx';

const pad = (n) => String(n).padStart(2, '0');
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Full-bleed hero carousel.
 *  - autoplay with a per-slide progress bar; pauses on hover, keyboard focus, hidden tab, off-screen and via the pause button
 *  - arrows, dots, left/right keys, touch swipe
 *  - starts paused for visitors who prefer reduced motion (and always while editing)
 */
export function DmHeroSlider({ p }) {
  const { editing, item } = useEditAttrs();
  const slides = list(p.slides);
  const n = slides.length || 1;
  const duration = (Number(p.seconds) || 7.5) * 1000;
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false); // set from the visitor's reduced-motion setting after hydration (see the effect below)
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [away, setAway] = useState(false); // tab hidden or hero scrolled out of view
  const [rendered, setRendered] = useState(() => new Set([0, 1])); // only fetch images for slides that are about to be shown
  const paused = userPaused || hover || focusIn || away || editing;
  const cur = Math.min(index, n - 1);

  const rootRef = useRef(null);
  const barRefs = useRef([]);
  const elapsed = useRef(0);
  const swipe = useRef(null);

  const go = useCallback((i) => {
    elapsed.current = 0;
    setIndex(((i % n) + n) % n);
  }, [n]);

  useEffect(() => { if (reducedMotion()) setUserPaused(true); }, []);

  useEffect(() => {
    setRendered((prev) => {
      const next = new Set(prev);
      next.add(cur); next.add((cur + 1) % n); next.add((cur - 1 + n) % n);
      return next.size === prev.size ? prev : next;
    });
  }, [cur, n]);

  useEffect(() => { barRefs.current.forEach((b) => b && b.style.setProperty('--p', '0')); }, [cur]);

  // progress clock: advances only while not paused, so the bar and the timer never drift apart
  useEffect(() => {
    if (paused) return undefined;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      elapsed.current += now - last;
      last = now;
      const pr = Math.min(1, elapsed.current / duration);
      barRefs.current[cur]?.style.setProperty('--p', pr.toFixed(3));
      if (pr >= 1) go(cur + 1);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cur, paused, go, duration]);

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
    if (editing) return;
    if (e.key === 'ArrowLeft') go(cur - 1);
    if (e.key === 'ArrowRight') go(cur + 1);
  };
  const onPointerDown = (e) => { if (e.pointerType !== 'mouse') swipe.current = e.clientX; };
  const onPointerUp = (e) => {
    if (swipe.current == null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
  };

  if (!slides.length) return editing ? <div className="dr-empty">Hero slider — add slides in the panel →</div> : null;

  return (
    <section
      ref={rootRef}
      className={`hero ${userPaused || editing ? 'is-static' : ''}`}
      aria-roledescription="carousel"
      aria-label="Dass Metal Products highlights"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocusIn(false); }}
      onKeyDown={onKeyDown}
    >
      {p.srTitle ? <h1 className="sr-only">{p.srTitle}</h1> : null}

      <div className="hero__slides" aria-live={paused ? 'polite' : 'off'} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { swipe.current = null; }}>
        {slides.map((s, i) => {
          const f = (field) => ({ key: 'slides', index: i, field });
          const src = safeMediaUrl(s.image);
          return (
            <div
              key={i}
              className={`hero__slide ${i === cur ? 'is-active' : ''} ${s.side === 'right' ? 'hero__slide--right' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={i !== cur}
            >
              {src && (editing || rendered.has(i)) && (
                <img className="hero__bg" src={src} alt="" style={s.position ? { objectPosition: s.position } : undefined} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} decoding="async" />
              )}
              <div className="hero__shade" />
              {i === cur ? <ImgChip spec={`slides|${i}|image`} label="Change photo" /> : null}
              <div className="container hero__inner">
                <div className="hero__copy">
                  <div style={{ '--i': 0 }}><T k="slides" item={f('eyebrow')} className="eyebrow eyebrow--light" placeholder="Small heading">{s.eyebrow}</T></div>
                  <T k="slides" item={f('title')} as="h2" className="hero__title" style={{ '--i': 1 }} placeholder="Headline">{s.title}</T>
                  <T k="slides" item={f('text')} as="p" className="hero__text" style={{ '--i': 2 }} multiline placeholder="Text">{s.text}</T>
                  <div className="btn-row" style={{ '--i': 3 }}>
                    {[1, 2].map((k) => (s[`cta${k}Label`] ? (
                      <DLink key={k} url={s[`cta${k}Url`]} spec={`slides|${i}|cta${k}Url`} className={`btn btn--lg ${k === 1 ? 'btn--blue' : 'btn--ghost-light'}`}>
                        <T k="slides" item={f(`cta${k}Label`)} placeholder="Button">{s[`cta${k}Label`]}</T>
                      </DLink>
                    ) : null))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hero__controls">
        <div className="container hero__controls-inner">
          <div className="hero__dots" role="group" aria-label="Choose a slide">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                className={`hero__dot ${i === cur ? 'is-active' : ''} ${i < cur ? 'is-done' : ''}`}
                aria-label={`Show slide ${i + 1}: ${s.title}`}
                aria-current={i === cur ? 'true' : undefined}
                onClick={() => go(i)}
                {...item('slides', i)}
              >
                <span className="hero__dot-bar"><span className="hero__dot-fill" ref={(el) => { barRefs.current[i] = el; }} /></span>
              </button>
            ))}
          </div>
          <div className="hero__ctrl">
            <span className="hero__counter" aria-hidden="true">{pad(cur + 1)} <i /> {pad(n)}</span>
            <button type="button" className="icon-btn" aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setUserPaused((v) => !v)}>
              {userPaused ? <Icon.Play /> : <Icon.Pause />}
            </button>
            <button type="button" className="icon-btn" aria-label="Previous slide" onClick={() => go(cur - 1)}><Icon.Arrow style={{ transform: 'rotate(180deg)' }} /></button>
            <button type="button" className="icon-btn" aria-label="Next slide" onClick={() => go(cur + 1)}><Icon.Arrow /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Full-width split band: photo on one half, solid colour with the message on the other.
 * Effects: the photo wipes in and settles from a zoom, drifts gently as you scroll (parallax),
 * the copy rises in one line after another, and the button fills with a sweep on hover.
 */
export function DmFeatureRow({ p }) {
  const { editing, img } = useEditAttrs();
  const [ref, seen] = useInView({ rootMargin: '0px 0px -12% 0px' });
  const imgRef = useRef(null);

  // parallax: the photo drifts a little slower than the page (skipped for reduced motion)
  useEffect(() => {
    const row = ref.current;
    const im = imgRef.current;
    if (!row || !im || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = row.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      // -1 when the row is entering from below, +1 when it is leaving at the top
      const pr = (r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2 + r.height / 2);
      im.style.setProperty('--py', `${(pr * 38).toFixed(1)}px`);
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

  const tone = p.tone === 'slate' ? 'slate' : 'charcoal';
  const src = safeMediaUrl(p.image);
  return (
    <article ref={ref} className={`feature-row feature-row--${tone} ${p.flip ? 'is-flip' : ''} ${seen || editing ? 'is-in' : ''}`}>
      <div className="feature-row__body">
        <div className="feature-row__copy">
          <SlotBar />
          <Rv delay={80} variant="up"><T k="label" className="eyebrow eyebrow--light" placeholder="Small heading">{p.label}</T></Rv>
          <T k="title" as="h2" className="h2 h2--light" reveal={{ variant: 'up', delay: 150 }} placeholder="Headline">{p.title}</T>
          <T k="text" as="p" className="feature-row__text" reveal={{ variant: 'up', delay: 230 }} multiline placeholder="Text">{p.text}</T>
          <Rv delay={310} variant="up">
            <DLink url={p.url} spec="url" className="btn btn--ghost-light btn--lg btn--sweep" aria-label={`Learn more: ${p.title}`}>
              <T k="buttonLabel" placeholder="Button">{p.buttonLabel}</T> <Icon.Arrow />
            </DLink>
          </Rv>
        </div>
      </div>
      <div className="feature-row__media" {...img('image')}>
        {src ? <img ref={imgRef} className="feature-row__img" src={src} alt={p.alt || ''} loading="lazy" decoding="async" /> : null}
      </div>
    </article>
  );
}

/** The slowly scrolling strip of product names. */
export function DmTicker({ products = [] }) {
  const names = products.map((x) => x.name);
  const run = [...names, ...names];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {run.map((nm, i) => (
          <span className="ticker__item" key={i}>{nm}<i className="ticker__diamond" /></span>
        ))}
      </div>
    </div>
  );
}

