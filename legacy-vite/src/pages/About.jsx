import { about } from '../data/site.js';
import { usePageMeta } from '../lib/helpers.js';
import { CtaBand, Eyebrow, PageHero, SectionHeading, SlotBar } from '../components/ui.jsx';
import { Reveal } from '../components/Reveal.jsx';

function LogoWall({ items, label }) {
  return (
    <ul className="logo-wall" aria-label={label}>
      {items.map((b, i) => (
        <Reveal as="li" key={b.name} variant="scale" delay={(i % 5) * 70}>
          {b.href ? (
            <a href={b.href} target="_blank" rel="noopener noreferrer" aria-label={`${b.name} (opens in a new tab)`}>
              <img src={b.logo} alt={b.name} loading="lazy" />
            </a>
          ) : (
            <img src={b.logo} alt={b.name} loading="lazy" />
          )}
        </Reveal>
      ))}
    </ul>
  );
}

export default function About() {
  usePageMeta('About Us', 'We manufacture steel studs, tracks and drywall accessories and drywall solutions. Our metal products are CSSBI certified.');
  const { intro, story, brands, team, memberships } = about;

  return (
    <>
      <PageHero title="About Us" lead={intro.text} />

      <section className="section">
        <div className="container stack-48">
          <SectionHeading eyebrow="Our experience" title={intro.title} />
          <ul className="photo-strip">
            {intro.photos.map((p, i) => (
              <Reveal as="li" key={p.src} delay={i * 110}><img src={p.src} alt={p.alt} loading="lazy" decoding="async" /></Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section band-light">
        <div className="container split split--center">
          <Reveal variant="left" className="stack-28">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="h2">{story.title}</h2>
            {story.paragraphs.map((html, i) => (
              <p className="body-secondary" key={i} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </Reveal>
          <Reveal variant="right" delay={120}>
            <img className="photo photo--tall" src={story.image} alt={story.imageAlt} loading="lazy" decoding="async" />
          </Reveal>
        </div>
        <Reveal className="container story-present">
          <SlotBar />
          <p className="body-secondary">{story.present}</p>
        </Reveal>
      </section>

      <section className="section" id="diversebrands">
        <div className="container stack-48">
          <SectionHeading eyebrow="JDass Corp" title={brands.title} />
          <LogoWall items={brands.items} label="JDass brands" />
        </div>
      </section>

      <section className="section band-dark">
        <div className="container split split--center">
          <Reveal className="section-heading is-dark" variant="left">
            <Eyebrow>Our team</Eyebrow>
            <h2 className="h2">{team.title}</h2>
          </Reveal>
          <Reveal className="stack-20" variant="right" delay={120}>
            {team.paragraphs.map((t, i) => <p className="lead lead--dark" key={i}>{t}</p>)}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container stack-48">
          <SectionHeading eyebrow="Industry associations" title={memberships.title} />
          <LogoWall items={memberships.items} label="Memberships" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
