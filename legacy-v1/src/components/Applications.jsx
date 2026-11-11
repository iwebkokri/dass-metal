import { applications } from '../data/content.js';
import { SectionHeading } from './ui.jsx';

export default function Applications() {
  return (
    <section id="applications" className="band-dark">
      <div className="container section stack-40">
        <SectionHeading
          dark
          eyebrow="From coil to job site"
          title="Steel for every wall, ceiling and frame."
          text="Dass framing covers residential interiors, commercial fit-outs and load-bearing curtain wall work."
        />
        <ul className="app-list">
          {applications.map((a, i) => (
            <li key={a.title} className="app-row">
              <span className="app-row__title"><span className="app-row__num">{String(i + 1).padStart(2, '0')}</span>{a.title}</span>
              <span className="muted-dark">{a.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
