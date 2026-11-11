import { steps } from '../data/content.js';
import { Photo, SectionHeading } from './ui.jsx';

export default function Ordering() {
  return (
    <section className="band-light">
      <div className="container section split split--center">
        <div className="stack-28">
          <SectionHeading eyebrow="How ordering works" title="Takeoff to truck." />
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="step__body"><strong>{s.title}</strong><span className="body-secondary">{s.text}</span></span>
              </li>
            ))}
          </ol>
          <a href="#quote" className="btn btn--accent btn--lg self-start">Start your order</a>
        </div>
        <Photo label="Studs on cantilever racking, Drew Rd warehouse" ratio="4 / 5" />
      </div>
    </section>
  );
}
