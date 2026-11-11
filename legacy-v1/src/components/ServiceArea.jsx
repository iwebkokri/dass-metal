import { cities } from '../data/content.js';
import { SectionHeading } from './ui.jsx';

export default function ServiceArea() {
  return (
    <section id="service-area" className="band-dark">
      <div className="container section split">
        <SectionHeading
          dark
          eyebrow="Delivery area"
          title="Supplying Ontario, Canada & the US."
          text="We ship from 1575 Drew Road in Mississauga to job sites across the GTA, Ontario, the rest of Canada and the United States."
        />
        <div className="chips">
          {cities.map((c) => (
            <a key={c} href="#quote" className="chip">{c}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
