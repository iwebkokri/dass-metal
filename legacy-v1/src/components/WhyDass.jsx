import { reasons } from '../data/content.js';

export default function WhyDass() {
  return (
    <section id="about" className="band-dark">
      <div className="container section stack-48">
        <div className="split-head">
          <div className="section-heading is-dark">
            <span className="eyebrow">Quality · Value · Customized solutions</span>
            <h2 className="h2">Why build with Dass.</h2>
          </div>
          <p className="muted-dark max-420">A family-owned Canadian business turning complex, time-sensitive orders into simple, practical supply.</p>
        </div>
        <div className="reason-grid">
          {reasons.map((r, i) => (
            <div key={r.title} className="reason">
              <span className="reason__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h3">{r.title}</h3>
              <p className="muted-dark">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
