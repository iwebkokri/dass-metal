import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { company } from '../data/site.js';
import { productBySlug, productMenu } from '../data/catalog.js';
import { describeLine, linesFromParams, newLineId } from '../lib/quote.js';
import { usePageMeta } from '../lib/helpers.js';
import { Icon, PageHero } from '../components/ui.jsx';
import { Reveal } from '../components/Reveal.jsx';

const departments = ['General Enquiry', 'Products', 'Sales', 'Accounts', 'Feedback', 'Other'];

/** One product being quoted: product, its options (taken from the product's own specifications), quantity, notes. */
function QuoteLine({ line, index, autoFocusField, onChange, onRemove }) {
  const product = productBySlug[line.slug];
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
            {productMenu.map((cat) => (
              <optgroup key={cat.title} label={cat.title}>
                {cat.groups.flatMap((g) => g.items).map((slug) => <option key={slug} value={slug}>{productBySlug[slug].title}</option>)}
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
            <input id={id('notes')} type="text" maxLength="300" placeholder={product.custom || 'Anything else we should know'} value={line.notes} onChange={(e) => onChange({ notes: e.target.value })} />
          </div>
        </div>
      )}
    </fieldset>
  );
}

function ContactPage() {
  usePageMeta('Contact Us', "Contact with Dass Metal for all your metal needs. Whether it's a quote or inquiry, our team is ready to assist.");
  const { search } = useLocation();
  // lines arrive pre-filled from a product page (/contact?product=…&o.Gauge=…&qty=…#quote)
  const [lines, setLines] = useState(() => linesFromParams(new URLSearchParams(search)));
  const [focusNew, setFocusNew] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | mailto | error
  const arrivedWithProduct = useState(() => lines.length > 0)[0];
  const quoteMode = lines.length > 0;

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
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return; // honeypot: real visitors never see this field

    const products = lines.map((l) => ({
      slug: l.slug,
      product: productBySlug[l.slug]?.title,
      options: Object.fromEntries(Object.entries(l.opts).filter(([, v]) => v)),
      quantity: l.qty,
      notes: l.notes,
    }));
    const payload = { first: data.first, last: data.last, email: data.email, company: data.company, department: data.department, phone: data.phone, message: data.message, optin: !!data.optin, products };

    if (company.formEndpoint) {
      setStatus('sending');
      try {
        const res = await fetch(company.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setLines([]);
        setStatus('sent');
      } catch {
        setStatus('error');
      }
      return;
    }

    // No form handler configured yet: hand the enquiry to the visitor's email app.
    const body = [
      `Name: ${data.first} ${data.last}`,
      `Company: ${data.company}`,
      `Department: ${data.department}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      lines.length ? `\nProducts to quote:\n${lines.map(describeLine).join('\n')}` : '',
      data.message ? `\n${data.message}` : '',
    ].join('\n');
    const subject = lines.length ? `Quote request — ${lines.map((l) => productBySlug[l.slug]?.title).join(', ')}` : `${data.department} — ${data.company}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject.slice(0, 150))}&body=${encodeURIComponent(body)}`;
    setStatus('mailto');
  }

  return (
    <>
      <PageHero title="Contact Us" lead="We look forward to serving you. Interested in seeing what we can do for your business?" />

      <section className="section">
        <div className="container contact">
          <Reveal className="contact__info stack-28" variant="left">
            <ul className="contact-list">
              <li>
                <Icon.Pin />
                <div>
                  <h2 className="h3">Visit us</h2>
                  <a href={company.mapUrl} target="_blank" rel="noopener noreferrer">{company.address[0]}, {company.address[1]}</a>
                </div>
              </li>
              <li>
                <Icon.Clock />
                <div>
                  <h2 className="h3">Hours</h2>
                  <p>{company.hours}</p>
                </div>
              </li>
              <li>
                <Icon.Phone />
                <div>
                  <h2 className="h3">Call</h2>
                  <p>
                    <a href="tel:+19056770456">+1 905 677 0456</a><br />
                    <a href="tel:+19056786587">+1 905 678 6587</a>
                  </p>
                </div>
              </li>
              <li>
                <Icon.Mail />
                <div>
                  <h2 className="h3">Email</h2>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal className="contact__form" id="quote" variant="right" delay={100}>
            <h2 className="h2 h2--sm">{quoteMode ? 'Request a Quote' : 'General Enquiries'}</h2>
            <p className="lead">
              {quoteMode
                ? 'Check your products below and add your details — a Dass representative will follow up with pricing and availability.'
                : 'Please fill out the form below if you have any enquiries regarding our business'}
            </p>

            <form onSubmit={onSubmit} className="form" aria-describedby="form-status">
              <div className="quote-block">
                {lines.map((l, i) => (
                  <QuoteLine
                    key={l.id}
                    line={l}
                    index={i}
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
                  <label htmlFor="first">First</label>
                  <input id="first" name="first" type="text" autoComplete="given-name" required />
                </div>
                <div className="field">
                  <label htmlFor="last">Last</label>
                  <input id="last" name="last" type="text" autoComplete="family-name" required />
                </div>
              </fieldset>

              <div className="field">
                <label htmlFor="email">Email <span className="req">(Required)</span></label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>

              <div className="field">
                <label htmlFor="company">Company Name <span className="req">(Required)</span></label>
                <input id="company" name="company" type="text" autoComplete="organization" required />
              </div>

              <div className="form__row form__row--2">
                <div className="field">
                  <label htmlFor="department">Department <span className="req">(Required)</span></label>
                  <select id="department" name="department" required defaultValue={quoteMode ? 'Sales' : ''}>
                    <option value="" disabled>Department</option>
                    {departments.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone <span className="req">(Required)</span></label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" required />
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="4" />
              </div>

              {/* honeypot */}
              <div className="hp" aria-hidden="true">
                <label>Website <input type="text" name="website" tabIndex="-1" autoComplete="off" /></label>
              </div>

              <label className="check">
                <input type="checkbox" name="optin" />
                <span>By submitting this form, you agree to receive newsletters, event tips, and marketing updates.</span>
              </label>

              <button className="btn btn--accent btn--lg self-start" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Request A Quote'}
              </button>

              <div id="form-status" role="status" aria-live="polite" className="form__status">
                {status === 'sent' && <p className="form__ok"><Icon.Check /> Thank you — your message has been sent. A Dass representative will be in touch shortly.</p>}
                {status === 'mailto' && <p className="form__ok"><Icon.Check /> Your email app should now be open with your enquiry ready to send to {company.email}. If it didn’t open, email us directly or call {company.phones[0].label}.</p>}
                {status === 'error' && <p className="form__err">Sorry, we couldn’t send your message. Please email <a href={`mailto:${company.email}`}>{company.email}</a> or call {company.phones[0].label}.</p>}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// Re-mount (fresh form state) whenever the query string changes, e.g. arriving from a different product page.
export default function Contact() {
  const { search } = useLocation();
  return <ContactPage key={search} />;
}
