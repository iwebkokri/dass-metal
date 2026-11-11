import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** True once the element has scrolled into view (one-shot). Falls back to "visible" without IntersectionObserver. */
export function useInView({ rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return undefined; }
    // threshold 0: reveal as soon as the first pixel enters, so very tall elements can never get stuck hidden
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { threshold: 0, rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);
  return [ref, seen];
}

/**
 * Fades / slides its content in when scrolled into view.
 * variant: up (default) | fade | left | right | scale.   delay: ms, for staggering siblings.
 * fill: make the wrapper stretch its single child (used for cards inside grids).
 */
export function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, fill = false, className = '', style, children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${fill ? 'reveal--fill' : ''} ${seen ? 'is-in' : ''} ${className}`.trim()}
      style={{ '--delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Counts up to a number such as "40+" or "1986" when scrolled into view. Non-numeric values render as-is. */
export function CountUp({ value, duration = 1500 }) {
  const text = String(value);
  const m = text.match(/^(\d+)(.*)$/);
  const [ref, seen] = useInView({ rootMargin: '0px' });
  const target = m ? parseInt(m[1], 10) : 0;
  const from = target >= 1000 ? target - 90 : 0; // years count up from a few decades earlier, not from zero
  const [n, setN] = useState(m && !prefersReducedMotion() ? from : target);

  useEffect(() => {
    if (!m || !seen || prefersReducedMotion()) { if (m) setN(target); return undefined; }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(Math.round(from + (target - from) * (1 - (1 - p) ** 3))); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!m) return <span>{text}</span>;
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{n}{m[2]}</span>
    </span>
  );
}
