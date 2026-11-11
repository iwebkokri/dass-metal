import { guides } from '../data/content.js';
import { Photo, SectionHeading } from './ui.jsx';

export default function Guides() {
  return (
    <section id="guides" className="section container stack-40">
      <div className="split-head">
        <SectionHeading eyebrow="Steel framing guides" title="Read before you specify." />
        <a href="#guides" className="text-link">All guides</a>
      </div>
      <div className="card-grid card-grid--300 gap-24">
        {guides.map((g) => (
          <a key={g.title} href="#guides" className="guide">
            <Photo label={g.title} ratio="16 / 10" />
            <span className="muted small">Framing guide · {g.date}</span>
            <h3 className="h3 h3--md">{g.title}</h3>
            <p className="muted">{g.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
