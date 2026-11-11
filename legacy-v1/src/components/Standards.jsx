import { certifications } from '../data/content.js';
import { SectionHeading } from './ui.jsx';

export default function Standards() {
  return (
    <section className="section container split split--center">
      <SectionHeading
        eyebrow="Canadian steel manufacturer"
        title="Built to Canadian standards."
        text="CSSBI certification, state-of-the-art roll-forming equipment and rigorous quality control on every run — backed by engineers with over 40 years in the steel framing industry."
      />
      <div className="cert-grid">
        {certifications.map((c) => (
          <div key={c} className="cert">[LOGO] {c}</div>
        ))}
      </div>
    </section>
  );
}
