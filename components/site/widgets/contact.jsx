'use client';

// Contact details (from Admin → Settings) and the quote / enquiry form (products from the Products list; sent to Submissions,
// email and the Lead Manager). The headings and wording around them are widget props.
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { linesFromParams, linesPayload, newLineId } from '@/lib/quote-client.js';
import { submitForm } from '@/lib/submit-form';
import { Icon } from '../ui.jsx';
import { Rv, useEditAttrs } from '../edit.jsx';

export function DmContactInfo({ p, company }) {
  return (
    <Rv className="contact__info stack-28" variant="left">
      <ul className="contact-list">
        {company.address.length > 0 && (
          <li>
            <Icon.Pin />
            <div>
              <h2 className="h3">{p.visitTitle || 'Visit us'}</h2>
              {company.mapUrl
                ? <a href={company.mapUrl} target="_blank" rel="noopener noreferrer">{company.address.join(', ')}</a>
                : <p>{company.address.join(', ')}</p>}
            </div>
          </li>
        )}
        {company.hours && (
          <li>
            <Icon.Clock />
            <div>
              <h2 className="h3">{p.hoursTitle || 'Hours'}</h2>
              <p>{company.hours}</p>
            </div>
          </li>
        )}
        {company.phones.length > 0 && (
          <li>
            <Icon.Phone />
            <div>
              <h2 className="h3">{p.callTitle || 'Call'}</h2>
              <p>{company.phones.map((ph, i) => (<span key={ph.href}>{i > 0 && <br />}<a href={ph.href}>{ph.label}</a></span>))}</p>
            </div>
          </li>
        )}
        {company.email && (
          <li>
            <Icon.Mail />
            <div>
              <h2 className="h3">{p.emailTitle || 'Email'}</h2>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
          </li>
        )}
      </ul>
    </Rv>
  );
}

/** One product being quoted: product, its options (taken from the product's own specifications), quantity, notes. */
function QuoteLine({ line, index, autoFocusField, catalog, onChange, onRemove }) {
  const product = catalog.bySlug[line.slug];
  const id = (f) => `${line.id}-${f}`;
  return (
    <fieldset className="qline">
      <legend className="sr-only">Product {index + 1}</legend>
      <div className="qline__head">
        {product ? <img className="qline__thumb" src={product.image} alt="" width="64" height="64" /> : <span className="qline__thumb qline__thumb--empty" aria-hidden="true" />}
        <div className="field qline__product">
          <label htmlFor={id('product')}>Product <span className="req">(Required)</span></label>
          <select id={id('product')} required value={line.slug} autoFocus={autoFocusField === 'product'} onChange={(e) => onChange({ slug: e.target.value, opts: {} })}>
            <option value="" disabled>Select a product</option>
            {catalog.groups.map((g) => (
              <optgroup key={g.title} label={g.title}>
                {g.items.map((pr) => <option key={pr.slug} value={pr.slug}>{pr.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <button type="button" className="qline__remove" onClick={onRemove} aria-label={`Remove product ${index + 1} from this quote`}><Icon.Close width={20} height={20} /></button>
      </div>

      {product && (
        <div className="qline__grid">
          {product.specs.map((s) => (
            <div className="field" key={s.label}>
              <label htmlFor={id(s.label)}>{s.label}</label>
              <select id={id(s.label)} value={line.opts[s.label] || ''} onChange={(e) => onChange({ opts: { ...line.opts, [s.label]: e.target.value } })}>
                <option value="">Not specified</option>
                {s.values.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          ))}
          <div className="field">
            <label htmlFor={id('qty')}>Quantity <span className="req">(Required)</span></label>
            <input id={id('qty')} type="text" inputMode="numeric" required maxLength="40" placeholder="e.g. 500" autoFocus={autoFocusField === 'qty'} value={line.qty} onChange={(e) => onChange({ qty: e.target.value })} />
          </div>
          <div className="field qline__notes">
            <label htmlFor={id('notes')}>Custom length / notes</label>
            <input id={id('notes')} type="text" maxLength="300" placeholder={product.custom_note || 'Anything else we should know'} value={line.notes} onChange={(e) => onChange({ notes: e.target.value })} />
          </div>
        </div>
      )}
    </fieldset>
  );
}

function QuoteForm({ p, products, company }) {
  const params = useSearchParams();
  const { editing } = useEditAttrs();
  const departments = String(p.departments || '').split('\n').map((d) => d.trim()).filter(Boolean);
  // every product, grouped by category, for the pickers; and the lookup used to pre-fill from a product page
  const catalog = useMemo(() => {
    const groups = [];
    for (const pr of products) {
      const t = pr.category || 'Products';
      let g = groups.find((x) => x.title === t);
      if (!g) groups.push((g = { title: t, items: [] }));
      g.items.push(pr);
    }
    return { bySlug: Object.fromEntries(products.map((pr) => [pr.slug, pr])), groups };
  }, [products]);

  // lines arrive pre-filled from a product page (/contact?product=…&o.Gauge=…&qty=…#quote)
  const [lines, setLines] = useState(() => linesFromParams(params, catalog.bySlug));
  const arrivedWithProduct = useState(() => lines.length > 0)[0];
  const [focusNew, setFocusNew] = useState(null);
  const [status, setStatus] = useState({ state: 'idle', error: '' }); // idle | sending | sent | error
  const quoteMode = lines.length > 0;
  const phone = company.phones[0];

  const change = (id, patch) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id) => setLines((ls) => ls.filter((l) => l.id !== id));
  const add = () => {
    const id = newLineId();
    setFocusNew(id);
    setLines((ls) => [...ls, { id, slug: '', opts: {}, qty: '', notes: '' }]);
  };

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const v = (name) => form.elements[name]?.value ?? '';
    const fd = new FormData();
    ['first_name', 'last_name', 'email', 'company', 'department', 'phone', 'message', 'website'].forEach((k) => fd.set(k, v(k)));
    fd.set('consent', form.elements.consent?.checked ? 'yes' : 'no');
    fd.set('products', linesPayload(lines));
    setStatus({ state: 'sending', error: '' });
    const result = await submitForm(quoteMode ? 'quote' : 'contact', fd, form);
    if (result.ok) {
      form.reset();
      setLines([]);
      setStatus({ state: 'sent', error: '' });
    } else {
      setStatus({ state: 'error', error: result.error || '' });
    }
  }

  return (
    <Rv className="contact__form" id="quote" variant="right" delay={100}>
      <h2 className="h2 h2--sm">{quoteMode && !editing ? p.quoteTitle || 'Request a Quote' : p.contactTitle || 'General Enquiries'}</h2>
      <p className="lead">{quoteMode && !editing ? p.quoteText : p.contactText}</p>

      <form onSubmit={onSubmit} className="form" aria-describedby="form-status">
        <div className="quote-block">
          {lines.map((l, i) => (
            <QuoteLine
              key={l.id}
              line={l}
              index={i}
              catalog={catalog}
              autoFocusField={l.id === focusNew ? 'product' : arrivedWithProduct && i === 0 && !l.qty ? 'qty' : undefined}
              onChange={(patch) => change(l.id, patch)}
              onRemove={() => remove(l.id)}
            />
          ))}
          <button type="button" className="btn btn--outline add-product" onClick={add}>
            <span aria-hidden="true">+</span> {quoteMode ? 'Add another product' : 'Add a product to your quote'}
          </button>
        </div>

        <fieldset className="form__row form__row--2">
          <legend>Name <span className="req">(Required)</span></legend>
          <div className="field">
            <label htmlFor="first_name">First</label>
            <input id="first_name" name="first_name" type="text" autoComplete="given-name" required maxLength="80" />
          </div>
          <div className="field">
            <label htmlFor="last_name">Last</label>
            <input id="last_name" name="last_name" type="text" autoComplete="family-name" required maxLength="80" />
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="email">Email <span className="req">(Required)</span></label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength="200" />
        </div>

        <div className="field">
          <label htmlFor="company">Company Name <span className="req">(Required)</span></label>
          <input id="company" name="company" type="text" autoComplete="organization" required maxLength="160" />
        </div>

        <div className="form__row form__row--2">
          <div className="field">
            <label htmlFor="department">Department <span className="req">(Required)</span></label>
            <select id="department" name="department" required defaultValue={quoteMode && departments.includes('Sales') ? 'Sales' : ''}>
              <option value="" disabled>Department</option>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="phone">Phone <span className="req">(Required)</span></label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength="40" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="4" maxLength="5000" />
        </div>

        {/* honeypot: people never see it, bots fill it in */}
        <div className="hp" aria-hidden="true">
          <label>Website <input type="text" name="website" tabIndex="-1" autoComplete="off" /></label>
        </div>

        <label className="check">
          <input type="checkbox" name="consent" />
          <span>{p.consentText}</span>
        </label>

        <button className="btn btn--accent btn--lg self-start" type="submit" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'Sending…' : p.buttonLabel || 'Request A Quote'}
        </button>

        <div id="form-status" role="status" aria-live="polite" className="form__status">
          {status.state === 'sent' && <p className="form__ok"><Icon.Check /> {p.successText}</p>}
          {status.state === 'error' && <p className="form__err">{status.error || `Sorry, we couldn’t send your message. Please email ${company.email}${phone ? ` or call ${phone.label}` : ''}.`}</p>}
        </div>
      </form>
    </Rv>
  );
}

// Fresh form state whenever the query string changes (for example arriving from a different product page).
export function DmQuoteForm(props) {
  const params = useSearchParams();
  return <QuoteForm key={params.toString()} {...props} />;
}
