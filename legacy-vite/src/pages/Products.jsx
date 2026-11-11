import { useState } from 'react';
import { productBySlug, productMenu } from '../data/catalog.js';
import { usePageMeta } from '../lib/helpers.js';
import { CtaBand, PageHero, ProductCard } from '../components/ui.jsx';
import { Reveal } from '../components/Reveal.jsx';

export default function Products() {
  usePageMeta('Our Products', 'We provide tailored solutions, offering steel studs, track, channels and drywall accessories as required by clients to meet specific project requirements.');
  const [filter, setFilter] = useState('All');
  const cats = productMenu.map((c) => ({ title: c.title, slugs: c.groups.flatMap((g) => g.items) }));
  const shown = filter === 'All' ? cats : cats.filter((c) => c.title === filter);

  return (
    <>
      <PageHero title="Our Products" />

      <section className="section">
        <div className="container stack-48">
          <Reveal className="split split--intro">
            <h2 className="h2">Meeting Your Customized Needs is Our Top Priority</h2>
            <p className="lead">
              Our goal is to expand the range of goods made at our manufacturing facility, as well as to create new items for existing markets and expand into new ones. Our long-term objective is to grow our company into multiple important sectors.
            </p>
          </Reveal>

          <div className="filters" role="group" aria-label="Filter products by category">
            {['All', ...cats.map((c) => c.title)].map((t) => (
              <button key={t} type="button" className={`filter ${filter === t ? 'is-active' : ''}`} aria-pressed={filter === t} onClick={() => setFilter(t)}>
                {t}
              </button>
            ))}
          </div>

          <div className="stack-48" aria-live="polite">
            {shown.map((c) => (
              <section key={c.title} aria-labelledby={`cat-${c.title.replace(/\W+/g, '-')}`}>
                <div className="cat-head">
                  <h3 className="h3 h3--lg" id={`cat-${c.title.replace(/\W+/g, '-')}`}>{c.title}</h3>
                  <span className="muted small">{c.slugs.length} {c.slugs.length === 1 ? 'product' : 'products'}</span>
                </div>
                <div className="card-grid card-grid--300 gap-24">
                  {c.slugs.map((slug, i) => <ProductCard key={slug} product={productBySlug[slug]} index={i} />)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
