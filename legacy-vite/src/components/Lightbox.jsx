import { useEffect, useRef } from 'react';
import { Icon } from './ui.jsx';

/**
 * Full-screen photo viewer built on the native <dialog> (focus trap + Esc for free).
 * items: [{ src, alt }]   — pass `null` to keep it closed.
 */
export default function Lightbox({ items, index = 0, caption, label = 'Photo viewer', onClose, onStep }) {
  const ref = useRef(null);
  const open = !!items;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const current = open ? items[index] : null;
  const total = open ? items.length : 0;

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') onStep(1);
    if (e.key === 'ArrowLeft') onStep(-1);
  };

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={open ? `${label} — photo ${index + 1} of ${total}` : label}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      {current && (
        <figure className="lightbox__fig">
          <img key={current.src} src={current.src} alt={current.alt || ''} />
          <figcaption>
            {caption}
            <span className="lightbox__count">{index + 1} / {total}</span>
          </figcaption>
        </figure>
      )}
      <button type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close"><Icon.Close /></button>
      {total > 1 && (
        <>
          <button type="button" className="lightbox__btn lightbox__prev" onClick={() => onStep(-1)} aria-label="Previous photo"><Icon.Arrow style={{ transform: 'rotate(180deg)' }} /></button>
          <button type="button" className="lightbox__btn lightbox__next" onClick={() => onStep(1)} aria-label="Next photo"><Icon.Arrow /></button>
        </>
      )}
    </dialog>
  );
}
