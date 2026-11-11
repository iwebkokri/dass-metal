import { categories } from '../data/content.js';
import { ArrowUpRight, Photo, SectionHeading } from './ui.jsx';

export default function Products() {
  return (
    <section id="products" className="section container stack-40">
      <SectionHeading
        eyebrow="Steel framing products"
        title="Products by system."
        text="Every profile is roll-formed from galvanized steel at our Mississauga facility. Choose a system to see sizes, gauges and data sheets."
      />
      <div className="card-grid card-grid--270">
        {categories.map((c) => (
          <a key={c.title} href="#products" className="card card--product">
            <Photo label={c.photo} />
            <div className="card__body">
              <h3 className="h3">{c.title}</h3>
              <p className="muted grow">{c.text}</p>
              <span className="link-arrow">View products <ArrowUpRight /></span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
