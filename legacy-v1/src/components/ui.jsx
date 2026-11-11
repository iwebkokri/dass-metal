export function ArrowUpRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 12L12 4M6 4h6v6" />
    </svg>
  );
}

export function SectionHeading({ eyebrow, title, text, dark = false, className = '' }) {
  return (
    <div className={`section-heading ${dark ? 'is-dark' : ''} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="h2">{title}</h2>
      {text && <p className="lead">{text}</p>}
    </div>
  );
}

// Shows a real image when `src` is set, otherwise a labelled placeholder block.
export function Photo({ src, alt = '', label, ratio = '4 / 3', className = '' }) {
  if (src) {
    return <img className={`photo ${className}`} src={src} alt={alt} style={{ aspectRatio: ratio }} loading="lazy" />;
  }
  return (
    <div className={`photo photo--placeholder ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      <span>[PHOTO] {label}</span>
    </div>
  );
}
