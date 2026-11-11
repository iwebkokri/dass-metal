import { useRef, useState } from 'react';
import { audiences } from '../data/content.js';
import { ArrowUpRight, SectionHeading } from './ui.jsx';

export default function Audiences() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);

  const onKeyDown = (e) => {
    const n = audiences.length;
    let next = null;
    if (e.key === 'ArrowRight') next = (active + 1) % n;
    if (e.key === 'ArrowLeft') next = (active - 1 + n) % n;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  const cur = audiences[active];
  return (
    <section className="band-light">
      <div className="container section split">
        <SectionHeading
          eyebrow="Who we supply"
          title="Pick your role."
          text="Contractors, distributors, builders and specifiers each come to Dass with a different job to finish."
        />
        <div className="stack-20">
          <div role="tablist" aria-label="Customer type" className="tabs" onKeyDown={onKeyDown}>
            {audiences.map((a, i) => (
              <button
                key={a.label}
                ref={(el) => (tabs.current[i] = el)}
                type="button"
                role="tab"
                id={`aud-tab-${i}`}
                aria-selected={i === active}
                aria-controls="aud-panel"
                tabIndex={i === active ? 0 : -1}
                className={`tab ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id="aud-panel" aria-labelledby={`aud-tab-${active}`} className="panel">
            <h3 className="h3 h3--lg">{cur.label}</h3>
            <p className="body-secondary">{cur.text}</p>
            <a href="#products" className="link-arrow">See products <ArrowUpRight /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
