import { useState } from 'react';
import { faqs } from '../data/content.js';
import { SectionHeading } from './ui.jsx';

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="band-light">
      <div className="container section split">
        <SectionHeading eyebrow="Steel framing FAQ" title="Questions buyers ask." />
        <div className="faq">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="faq__item">
                <h3 className="faq__heading">
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {f.q}
                    <span aria-hidden="true" className="faq__sign">{isOpen ? '−' : '+'}</span>
                  </button>
                </h3>
                <div id={`faq-${i}`} hidden={!isOpen}>
                  <p className="faq__a">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
