'use client';

import { useRef, useState } from 'react';
import Lightbox from './Lightbox.jsx';
import { Icon } from './ui.jsx';

const ZOOM = 2.6;  // magnification inside the lens
const LENS = 210;  // lens diameter in px

/**
 * Product photo viewer: a magnifying lens follows the mouse over the main photo (using the full-size original),
 * clicking / tapping — or pressing Enter on the focused photo — opens it enlarged with arrow-key browsing.
 * images: [{ src, full }]
 */
export default function ProductViewer({ title, images }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null); // index being viewed, or null
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const warmed = useRef(new Set());

  const cur = images[active];
  const n = images.length;

  // fetch the big file the first time the pointer arrives, so the lens is sharp by the time it is used
  const warm = (full) => {
    if (warmed.current.has(full)) return;
    warmed.current.add(full);
    const i = new Image();
    i.src = full;
  };

  const hideLens = () => lensRef.current?.classList.remove('is-on');

  const onPointerEnter = (e) => { if (e.pointerType === 'mouse') warm(cur.full); };
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const stage = stageRef.current;
    const img = imgRef.current;
    const lens = lensRef.current;
    if (!stage || !img || !lens || !img.naturalWidth) return;
    const r = stage.getBoundingClientRect();
    // the photo is letter-boxed inside the stage (object-fit: contain): work out where it really is
    const s = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    const ox = (r.width - w) / 2;
    const oy = (r.height - h) / 2;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (x < ox || x > ox + w || y < oy || y > oy + h) { hideLens(); return; }
    lens.classList.add('is-on');
    lens.style.transform = `translate3d(${x - LENS / 2}px, ${y - LENS / 2}px, 0)`;
    lens.style.backgroundSize = `${w * ZOOM}px ${h * ZOOM}px`;
    lens.style.backgroundPosition = `${LENS / 2 - (x - ox) * ZOOM}px ${LENS / 2 - (y - oy) * ZOOM}px`;
  };

  const step = (d) => setLightbox((i) => (i == null ? i : (i + d + n) % n));

  return (
    <div className="viewer">
      <button
        type="button"
        ref={stageRef}
        className="viewer__stage"
        aria-label={`Enlarge photo ${active + 1} of ${n}: ${title}`}
        onClick={() => { hideLens(); setLightbox(active); }}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={hideLens}
      >
        <img ref={imgRef} src={cur.src} alt={`${title} — photo ${active + 1} of ${n}`} />
        <span
          ref={lensRef}
          className="viewer__lens"
          aria-hidden="true"
          style={{ width: LENS, height: LENS, backgroundImage: `url("${cur.full}"), url("${cur.src}")` }}
        />
        <span className="viewer__hint" aria-hidden="true">
          <Icon.Search width={16} height={16} />
          <span className="viewer__hint-mouse">Hover to magnify · click to enlarge</span>
          <span className="viewer__hint-touch">Tap to enlarge</span>
        </span>
      </button>

      {n > 1 && (
        <ul className="viewer__thumbs" aria-label="Product photos">
          {images.map((im, i) => (
            <li key={im.src}>
              <button type="button" className={i === active ? 'is-active' : ''} aria-label={`Show photo ${i + 1}`} aria-current={i === active} onClick={() => { hideLens(); setActive(i); }}>
                <img src={im.src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        items={lightbox == null ? null : images.map((im, i) => ({ src: im.full, alt: `${title} — photo ${i + 1}` }))}
        index={lightbox ?? 0}
        label={title}
        caption={<strong>{title}</strong>}
        onClose={() => setLightbox(null)}
        onStep={step}
      />
    </div>
  );
}
