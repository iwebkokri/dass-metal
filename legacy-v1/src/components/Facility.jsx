import { SectionHeading } from './ui.jsx';

export default function Facility() {
  return (
    <section className="section container split split--center">
      <div className="video-block" role="img" aria-label="Facility video placeholder">
        <span className="video-block__play">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        </span>
        <span className="video-block__label">[VIDEO] Coil to cut-to-length line tour</span>
      </div>
      <div className="stack-20">
        <SectionHeading
          eyebrow="1575 Drew Road, Mississauga"
          title="Formed in Mississauga. Delivered to site."
          text="Our manufacturing facility combines roll-forming, cut-to-length and in-house quality control with the stock depth to fill large orders fast."
        />
        <div className="stats">
          <div><span className="stat__value">200,000</span><span className="muted small">sq ft indoor warehouse &amp; manufacturing</span></div>
          <div><span className="stat__value">500,000</span><span className="muted small">sq ft outdoor storage</span></div>
        </div>
      </div>
    </section>
  );
}
