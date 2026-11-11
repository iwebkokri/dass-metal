import { Link } from 'react-router-dom';
import { standards } from '../data/site.js';
import { usePageMeta } from '../lib/helpers.js';
import { CtaBand, Eyebrow, PageHero } from '../components/ui.jsx';
import { Reveal } from '../components/Reveal.jsx';

export default function Standards() {
  usePageMeta('Standards', 'Our product lines surpass design & engineering criteria, ensuring structural performance. Metal framing material, light gauge steel, framing.');
  return (
    <>
      <PageHero title="Standards" />

      <section className="section">
        <div className="container split">
          <Reveal className="stack-28" variant="left">
            <img className="badge-img" src={standards.badge} alt="CSSBI member" width="195" height="155" />
            <Eyebrow>Design &amp; engineering</Eyebrow>
            <h2 className="h2 h2--sm">{standards.title}</h2>
            <p className="body-secondary">{standards.text}</p>
            <Link className="btn btn--accent btn--lg self-start" to="/contact">Contact Us</Link>
          </Reveal>

          <Reveal className="stack-28" variant="right" delay={120}>
            <table className="table">
              <caption className="sr-only">ASTM standards that Dass Metal products meet or exceed</caption>
              <thead>
                <tr><th scope="col">Standard</th><th scope="col">Covers</th></tr>
              </thead>
              <tbody>
                {standards.list.map((s) => (
                  <tr key={s.code}>
                    <th scope="row">{s.code}</th>
                    <td>{s.covers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <img className="photo" src={standards.photo} alt="Steel studs framed to specification at a Dass Metal project" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
