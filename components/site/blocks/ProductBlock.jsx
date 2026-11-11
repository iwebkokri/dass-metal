'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { quoteHref } from '@/lib/quote-client.js';
import { CtaBand, Icon, PageHero, ProductCard, SectionHeading } from '../ui.jsx';
import { Reveal } from '../Reveal.jsx';
import ProductViewer from '../ProductViewer.jsx';

/** A product page. `related` and `company` come from the CMS (products table, Settings). */
export default function ProductBlock({ product, related = [], company }) {
  const category = product.category;
  const group = product.group_title;
  const phone = company.phones[0];

  // what the visitor has picked so far: one value per specification (optional) and a quantity
  const [picked, setPicked] = useState({});
  const [qty, setQty] = useState('');

  const images = useMemo(
    () => product.gallery.map((src) => ({ src, full: src })), // the gallery holds full-size photos; the viewer shrinks them to fit
    [product],
  );
  const href = quoteHref(product.slug, picked, qty);
  const chosen = Object.entries(picked).filter(([, v]) => v);

  const toggle = (label, value) => setPicked((p) => ({ ...p, [label]: p[label] === value ? '' : value }));

  return (
    <>
      <PageHero title={product.name} crumbs={[{ label: 'Products', to: '/our-products' }]} />

      <section className="section">
        <div className="container product">
          <Reveal variant="left">
            <ProductViewer title={product.name} images={images.length ? images : [{ src: product.image, full: product.image }]} />
          </Reveal>

          <Reveal className="product__info stack-28" variant="right" delay={100}>
            <div className="stack-16">
              <span className="tag">{category}{group ? ` · ${group}` : ''}</span>
              <h2 className="h2 h2--sm">Specifications</h2>
              <p className="muted small">Select the options you need, then request a quote for this exact product.</p>
            </div>

            <dl className="specs">
              {product.specs.map((s) => (
                <div className="specs__row" key={s.label}>
                  <dt id={`spec-${s.label.replace(/\W+/g, '-')}`}>{s.label}</dt>
                  <dd>
                    <ul className="chips" role="group" aria-labelledby={`spec-${s.label.replace(/\W+/g, '-')}`}>
                      {s.values.map((v) => (
                        <li key={v}>
                          <button type="button" className={`chip ${picked[s.label] === v ? 'is-selected' : ''}`} aria-pressed={picked[s.label] === v} onClick={() => toggle(s.label, v)}>
                            {v}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>

            {product.custom_note && (
              <p className="custom-note"><Icon.Check /> {product.custom_note}</p>
            )}

            <div className="order">
              <div className="field order__qty">
                <label htmlFor="order-qty">Quantity</label>
                <input id="order-qty" type="text" inputMode="numeric" autoComplete="off" placeholder="e.g. 500" maxLength="40" value={qty} onChange={(e) => setQty(e.target.value)} />
              </div>
              <p className="order__summary" aria-live="polite">
                {chosen.length || qty.trim()
                  ? <>Your selection: <strong>{[...chosen.map(([k, v]) => `${k} ${v}`), qty.trim() && `Qty ${qty.trim()}`].filter(Boolean).join(' · ')}</strong></>
                  : 'No options selected yet — you can also choose them on the quote form.'}
              </p>
            </div>

            <div className="btn-row">
              <Link className="btn btn--accent btn--lg" href={href}>Request a Quote for This Product <Icon.Arrow /></Link>
              {phone && <a className="btn btn--outline btn--lg" href={phone.href}><Icon.Phone /> {phone.label}</a>}
            </div>

            <p className="muted">
              Note: For the most up-to-date information, please <Link href="/contact">contact us</Link> directly to know more.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section band-light">
        <Reveal className="container product-desc">
          <h2 className="h2 h2--sm">{product.desc_title || product.name}</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: product.body }} />
        </Reveal>
      </section>

      <section className="section">
        <div className="container stack-40">
          <SectionHeading title="Other Metal Products" />
          <div className="card-grid card-grid--300 gap-24">
            {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </div>
      </section>

      <CtaBand to={href} text={`Fill out the form to have a Dass representative quote ${product.name} for your project.`} />
    </>
  );
}
