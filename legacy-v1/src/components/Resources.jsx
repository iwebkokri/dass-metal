import { resources } from '../data/content.js';
import { SectionHeading } from './ui.jsx';

export default function Resources() {
  return (
    <section id="resources" className="section container stack-40">
      <div className="split-head">
        <SectionHeading eyebrow="Specs & technical resources" title="Specify with the right documents." />
        <a href="#resources" className="text-link">View all resources</a>
      </div>
      <div className="card-grid card-grid--260">
        {resources.map((r) => (
          <a key={r.title} href={r.href} className="card card--resource">
            <span className="tag">{r.tag}</span>
            <h3 className="h3">{r.title}</h3>
            <p className="muted grow">{r.text}</p>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 4v12M6 10l6 6 6-6M5 20h14" /></svg>
          </a>
        ))}
      </div>
    </section>
  );
}
