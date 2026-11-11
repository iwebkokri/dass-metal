'use client';

// Static Dass Metal content widgets. Same markup as the original hand-written pages, but every string, image and link is a prop
// (see lib/builder/defs/site.mjs) and goes through the inline-edit helpers in ../edit.jsx.
import { Fragment } from 'react';
import Link from 'next/link';
import { safeMediaUrl } from '@/lib/builder/url.mjs';
import { Icon, SlotBar } from '../ui.jsx';
import { CountUp } from '../Reveal.jsx';
import { DLink, Rv, T, list, useEditAttrs } from '../edit.jsx';

const rv = (p) => p.reveal || undefined;

export function DmHeading({ p }) {
  const { editing } = useEditAttrs();
  const Tag = ['h1', 'h2', 'h3', 'h4'].includes(p.tag) ? p.tag : 'h2';
  const head = (
    <Rv className={`section-heading${p.tone === 'dark' ? ' is-dark' : ''}${p.spacing === 'loose' ? ' section-heading--loose' : ''}`} variant={rv(p)}>
      {(editing || p.eyebrow) && <T k="eyebrow" className="eyebrow" placeholder="Small heading">{p.eyebrow}</T>}
      <T k="title" as={Tag} className={`h2${p.size === 'small' ? ' h2--sm' : ''}`} placeholder="Title">{p.title}</T>
      {(editing || p.text) && <T k="text" as="p" className="lead" placeholder="Intro text (optional)">{p.text}</T>}
    </Rv>
  );
  if (!p.linkLabel) return head;
  return (
    <div className="split-head">
      {head}
      <Rv variant="fade" delay={150}>
        <DLink url={p.linkUrl} spec="linkUrl" className="arrow-link"><T k="linkLabel" placeholder="Link">{p.linkLabel}</T><Icon.Arrow /></DLink>
      </Rv>
    </div>
  );
}

export function DmText({ p }) {
  const dark = p.tone === 'dark';
  const cls = p.variant === 'lead' ? `lead${dark ? ' lead--dark' : ''}` : p.variant === 'small' ? 'muted small' : `body-secondary${p.ink === 'strong' ? ' body-strong' : ''}`;
  return <T k="html" as="div" rich multiline placeholder="Write your text…" className={`dm-rich ${cls}`} reveal={p.reveal ? { variant: p.reveal } : undefined}>{p.html}</T>;
}

export function DmImage({ p }) {
  const { editing, img } = useEditAttrs();
  const src = safeMediaUrl(p.src);
  if (!src && !editing) return null;
  const cls = { photo: 'photo', tall: 'photo photo--tall', badge: 'badge-img', plain: '' }[p.variant] ?? 'photo';
  const el = src
    ? <img className={cls} src={src} alt={p.alt || ''} loading="lazy" decoding="async" {...img('src')} />
    : <div className="dr-img-ph" {...img('src')}>Double-click to choose a photo</div>;
  return <Rv variant={rv(p)}>{p.link ? <DLink url={p.link} newTab={p.newTab} spec="link">{el}</DLink> : el}</Rv>;
}

export function DmButton({ p }) {
  const cls = `btn btn--${p.style || 'accent'}${p.size === 'md' ? '' : ' btn--lg'} self-start`;
  return (
    <DLink url={p.url} newTab={p.newTab} spec="url" className={cls}>
      {p.icon === 'mail' ? <Icon.Mail /> : null}
      <T k="label" placeholder="Button">{p.label}</T>
      {p.icon === 'arrow' ? <Icon.Arrow /> : null}
    </DLink>
  );
}

export function DmQuote({ p }) {
  if (p.variant === 'note') {
    return (
      <Rv className="story-note" variant={rv(p)}>
        <SlotBar />
        <T k="text" as="p" className="body-secondary" multiline placeholder="Text">{p.text}</T>
      </Rv>
    );
  }
  return (
    <Rv as="blockquote" className="mission" variant={p.reveal || 'fade'}>
      <SlotBar />
      <T k="text" as="p" multiline placeholder="Statement">{p.text}</T>
    </Rv>
  );
}

export function DmIconList({ p }) {
  const { img, item } = useEditAttrs();
  const pillar = p.variant === 'pillar';
  const base = pillar ? 'pillar' : 'why-item';
  return (
    <ul className={pillar ? 'pillar-list' : 'why-list'}>
      {list(p.items).map((it, i) => (
        <Rv as="li" key={i} className={base} variant="up" delay={i * (pillar ? 90 : 80)} {...item('items', i)}>
          <span className={`${base}__icon`} aria-hidden="true" style={{ '--icon': `url("${it.icon || ''}")` }} {...img(`items|${i}|icon`)} />
          <T k="items" item={{ key: 'items', index: i, field: 'title' }} as="h3" placeholder="Title">{it.title}</T>
          <T k="items" item={{ key: 'items', index: i, field: 'text' }} as="p" multiline placeholder="Text">{it.text}</T>
        </Rv>
      ))}
    </ul>
  );
}

export function DmFeatureCards({ p }) {
  const { img, item } = useEditAttrs();
  return (
    <div className="card-grid card-grid--300 gap-24">
      {list(p.items).map((c, i) => (
        <Rv as="article" key={i} className="feature" variant="up" delay={i * 120} {...item('items', i)}>
          <div className={`feature__media${c.contain ? ' feature__media--contain' : ''}`}>
            <img src={safeMediaUrl(c.image)} alt={c.alt || ''} loading="lazy" decoding="async" {...img(`items|${i}|image`)} />
          </div>
          <div className="feature__body">
            <T k="items" item={{ key: 'items', index: i, field: 'title' }} as="h3" className="h3 h3--lg" placeholder="Title">{c.title}</T>
            <T k="items" item={{ key: 'items', index: i, field: 'text' }} as="p" multiline placeholder="Text">{c.text}</T>
          </div>
        </Rv>
      ))}
    </div>
  );
}

export function DmLogos({ p }) {
  const { editing, img, item } = useEditAttrs();
  const wall = p.variant === 'wall';
  return (
    <ul className={wall ? 'logo-wall' : 'logo-row'} aria-label={wall ? p.label || undefined : undefined}>
      {list(p.items).map((b, i) => {
        const pic = <img src={safeMediaUrl(b.logo)} alt={b.name || ''} loading="lazy" {...(wall ? {} : { width: 300, height: 100 })} {...img(`items|${i}|logo`)} />;
        return (
          <Rv as="li" key={i} variant="scale" delay={wall ? (i % 5) * 70 : i * 90} {...item('items', i)}>
            {b.href || editing ? <DLink url={b.href} spec={`items|${i}|href`} aria-label={`${b.name} (opens in a new tab)`}>{pic}</DLink> : pic}
          </Rv>
        );
      })}
    </ul>
  );
}

export function DmPhotoStrip({ p }) {
  const { img, item } = useEditAttrs();
  return (
    <ul className="photo-strip">
      {list(p.items).map((ph, i) => (
        <Rv as="li" key={i} variant="up" delay={i * 110} {...item('items', i)}>
          <img src={safeMediaUrl(ph.src)} alt={ph.alt || ''} loading="lazy" decoding="async" {...img(`items|${i}|src`)} />
        </Rv>
      ))}
    </ul>
  );
}

export function DmStandardsTable({ p }) {
  const { item } = useEditAttrs();
  return (
    <table className="table">
      {p.caption ? <caption className="sr-only">{p.caption}</caption> : null}
      <thead>
        <tr>
          <th scope="col"><T k="headCode" placeholder="Heading">{p.headCode}</T></th>
          <th scope="col"><T k="headCovers" placeholder="Heading">{p.headCovers}</T></th>
        </tr>
      </thead>
      <tbody>
        {list(p.items).map((s, i) => (
          <tr key={i} {...item('items', i)}>
            <th scope="row"><T k="items" item={{ key: 'items', index: i, field: 'code' }} placeholder="Standard">{s.code}</T></th>
            <td><T k="items" item={{ key: 'items', index: i, field: 'covers' }} placeholder="What it covers">{s.covers}</T></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DmNotice({ p, company }) {
  const { editing } = useEditAttrs();
  const email = company?.email || '';
  const parts = String(p.text || '').split('{email}');
  const label = String(p.buttonLabel || '').replaceAll('{email}', email);
  return (
    <div className="notice">
      <T k="title" as="h2" className="h3 h3--lg" placeholder="Title">{p.title}</T>
      {editing ? (
        <T k="text" as="p" className="body-secondary" multiline placeholder="Text">{p.text}</T>
      ) : (
        <p className="body-secondary">{parts.map((x, i) => <Fragment key={i}>{x}{i < parts.length - 1 && <a href={`mailto:${email}`}>{email}</a>}</Fragment>)}</p>
      )}
      <a className="btn btn--accent btn--lg self-start" {...(editing ? {} : { href: `mailto:${email}?subject=${encodeURIComponent(p.subject || '')}` })}>
        <Icon.Mail />
        {editing ? <T k="buttonLabel" placeholder="Button">{p.buttonLabel}</T> : label}
      </a>
    </div>
  );
}

export function DmFacts({ p }) {
  const { editing, item } = useEditAttrs();
  return (
    <section className="facts" aria-label="Dass Metal at a glance">
      <Rv as="ul" className="container facts__list" variant="up">
        {list(p.items).map((f, i) => (
          <li key={i} {...item('items', i)}>
            <span className="facts__value">
              {editing ? <T k="items" item={{ key: 'items', index: i, field: 'value' }} placeholder="Number">{f.value}</T> : <CountUp value={f.value} />}
            </span>
            <T k="items" item={{ key: 'items', index: i, field: 'label' }} className="facts__label" placeholder="Description">{f.label}</T>
          </li>
        ))}
      </Rv>
    </section>
  );
}

export function DmPageHero({ p }) {
  const { editing } = useEditAttrs();
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <nav aria-label="Breadcrumb" className="crumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            {list(p.crumbs).map((c, i) => <li key={i}><Link href={c.url || '/'}>{c.label}</Link></li>)}
            <li aria-current="page">{p.title}</li>
          </ol>
        </nav>
        <T k="title" as="h1" className="page-hero__title" placeholder="Page title">{p.title}</T>
        {(editing || p.lead) && <T k="lead" as="p" className="page-hero__lead" multiline placeholder="Intro text (optional)">{p.lead}</T>}
      </div>
      <SlotBar className="slot-bar--bottom" />
    </section>
  );
}

export function DmCtaBand({ p }) {
  return (
    <section className="cta-band band-dark">
      <Rv className="container cta-band__inner" variant="up">
        <div className="stack-16">
          <T k="title" as="h2" className="h2 h2--light" placeholder="Headline">{p.title}</T>
          <T k="text" as="p" className="lead lead--dark" multiline placeholder="Text">{p.text}</T>
        </div>
        <DLink url={p.url} spec="url" className="btn btn--blue btn--lg"><T k="buttonLabel" placeholder="Button">{p.buttonLabel}</T></DLink>
      </Rv>
    </section>
  );
}
