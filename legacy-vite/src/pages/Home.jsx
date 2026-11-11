import { Link } from 'react-router-dom';
import { home } from '../data/site.js';
import { productBySlug, products } from '../data/catalog.js';
import homePosts from '../data/home-posts.json';
import { usePageMeta } from '../lib/helpers.js';
import { ArrowLink, CtaBand, Eyebrow, PostCard, ProductCard, SectionHeading, SlotBar } from '../components/ui.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import FeatureRow from '../components/FeatureRow.jsx';
import { CountUp, Reveal } from '../components/Reveal.jsx';

function Ticker() {
  const names = products.map((p) => p.title);
  const run = [...names, ...names];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {run.map((n, i) => (
          <span className="ticker__item" key={i}>{n}<i className="ticker__diamond" /></span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  usePageMeta('', 'Get quality steel studs, tracks, and framing systems made in Canada. Trusted by builders across Ontario for on-time delivery and precision.');
  const { slides, facts, top, values, trusted, pillars, mission, panels, affiliates } = home;

  return (
    <>
      <HeroSlider slides={slides} />

      <section className="facts" aria-label="Dass Metal at a glance">
        <Reveal as="ul" className="container facts__list" variant="up">
          {facts.map((f) => (
            <li key={f.label}>
              <span className="facts__value"><CountUp value={f.value} /></span>
              <span className="facts__label">{f.label}</span>
            </li>
          ))}
        </Reveal>
      </section>

      <Ticker />

      {/* Top products */}
      <section className="section" id="products">
        <div className="container stack-48">
          <div className="split-head">
            <SectionHeading eyebrow="Products" title={top.title} text={top.text} />
            <Reveal variant="fade" delay={150}><ArrowLink to="/our-products">View all products</ArrowLink></Reveal>
          </div>
          <div className="card-grid card-grid--home gap-24">
            {top.slugs.map((slug, i) => (
              <ProductCard key={slug} product={productBySlug[slug]} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Dass */}
      <section className="section band-dark" aria-labelledby="why-title">
        <div className="container stack-48">
          <Reveal className="section-heading is-dark">
            <Eyebrow>What sets us apart</Eyebrow>
            <h2 className="h2" id="why-title">Why Dass Metal</h2>
          </Reveal>
          <ul className="why-list">
            {values.map((v, i) => (
              <Reveal as="li" className="why-item" key={v.title} delay={i * 80}>
                <span className="why-item__icon" aria-hidden="true" style={{ '--icon': `url("${v.icon}")` }} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Trusted */}
      <section className="section band-light" aria-labelledby="trusted-title">
        <div className="container stack-48">
          <SectionHeading eyebrow="Our promise" title={trusted.title} id="trusted-title" />
          <div className="card-grid card-grid--300 gap-24">
            {trusted.cards.map((c, i) => (
              <Reveal as="article" className="feature" key={c.title} delay={i * 120}>
                <div className={`feature__media ${c.contain ? 'feature__media--contain' : ''}`}>
                  <img src={c.image} alt={c.alt} loading="lazy" decoding="async" />
                </div>
                <div className="feature__body">
                  <h3 className="h3 h3--lg">{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars + mission */}
      <section className="section">
        <div className="container stack-48">
          <ul className="pillar-list">
            {pillars.map((p, i) => (
              <Reveal as="li" className="pillar" key={p.title} delay={i * 90}>
                <span className="pillar__icon" aria-hidden="true" style={{ '--icon': `url("${p.icon}")` }} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal as="blockquote" className="mission" variant="fade">
            <SlotBar />
            <p>{mission}</p>
          </Reveal>
        </div>
      </section>

      {/* Two full-width calls to action */}
      <section aria-label="About Dass Metal and our projects">
        {panels.map((p, i) => (
          <FeatureRow key={p.title} {...p} flip={i % 2 === 1} tone={i % 2 === 1 ? 'slate' : 'charcoal'} />
        ))}
      </section>

      {/* Blogs */}
      <section className="section" aria-labelledby="blogs-title">
        <div className="container stack-48">
          <div className="split-head">
            <SectionHeading eyebrow="News & insights" title="Our Blogs" id="blogs-title" />
            <Reveal variant="fade" delay={150}><ArrowLink to="/blogs">See More</ArrowLink></Reveal>
          </div>
          <div className="card-grid card-grid--300 gap-24">
            {homePosts.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
          </div>
        </div>
      </section>

      {/* Affiliates */}
      <section className="section band-paper" id="affiliated" aria-labelledby="affiliates-title">
        <div className="container stack-40">
          <SectionHeading eyebrow="The JDass family" title="Affiliated Companies" id="affiliates-title" />
          <ul className="logo-row">
            {affiliates.map((a, i) => (
              <Reveal as="li" key={a.name} delay={i * 90} variant="scale">
                <a href={a.href} target="_blank" rel="noopener noreferrer" aria-label={`${a.name} (opens in a new tab)`}>
                  <img src={a.logo} alt={a.name} loading="lazy" width="300" height="100" />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
