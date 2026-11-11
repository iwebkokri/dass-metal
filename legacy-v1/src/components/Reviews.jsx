import { reviews } from '../data/content.js';
import { SectionHeading } from './ui.jsx';

export default function Reviews() {
  return (
    <section className="section container stack-40">
      <SectionHeading eyebrow="Customer reviews" title="What contractors say." />
      <div className="card-grid card-grid--300">
        {reviews.map((r, i) => (
          <figure key={i} className="card review">
            <blockquote>{r.quote}</blockquote>
            <figcaption className="muted small">{r.name} · {r.company}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
