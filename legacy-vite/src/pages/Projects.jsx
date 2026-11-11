import { useRef, useState } from 'react';
import projects from '../data/projects.json';
import { usePageMeta } from '../lib/helpers.js';
import { CtaBand, PageHero } from '../components/ui.jsx';
import { Reveal } from '../components/Reveal.jsx';
import Lightbox from '../components/Lightbox.jsx';

export default function Projects() {
  usePageMeta('Our Projects', "Explore Dass Metal's Showcase of Excellence. Find out more about some of the fantastic projects we have been involved in the past.");
  const [view, setView] = useState(null); // { project, index }
  const lastTrigger = useRef(null);

  const open = (project, index, el) => { lastTrigger.current = el; setView({ project, index }); };
  const close = () => { setView(null); lastTrigger.current?.focus(); };
  const step = (d) => setView((v) => v && ({ ...v, index: (v.index + d + v.project.images.length) % v.project.images.length }));

  const p = view?.project;
  return (
    <>
      <PageHero title="Our Projects" lead="Find out more about some of the fantastic projects we have been involved in the past." />

      <section className="section">
        <div className="container stack-48">
          {projects.map((proj, i) => (
            <Reveal as="article" className="project" key={`${proj.title}-${proj.location}`}>
              <header className="project__head">
                <span className="project__num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="h3 h3--lg">{proj.title}</h2>
                  <p className="muted">{proj.location}</p>
                </div>
              </header>
              <ul className="project__grid" style={{ '--cols': proj.images.length === 4 ? 4 : proj.images.length >= 5 ? 3 : proj.images.length }}>
                {proj.images.map((im, n) => (
                  <Reveal as="li" key={im.src} variant="scale" delay={n * 70}>
                    <button type="button" onClick={(e) => open(proj, n, e.currentTarget)} aria-label={`View photo ${n + 1} of ${proj.images.length}: ${proj.title}, ${proj.location}`}>
                      <img src={im.src} alt="" loading="lazy" decoding="async" />
                    </button>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <Lightbox
        items={p ? p.images.map((im, n) => ({ src: im.src, alt: `${p.title}, ${p.location} — photo ${n + 1}` })) : null}
        index={view?.index ?? 0}
        label={p ? `${p.title}, ${p.location}` : 'Project photo'}
        caption={p && <><strong>{p.title}</strong> · {p.location}</>}
        onClose={close}
        onStep={step}
      />
      <CtaBand />
    </>
  );
}
