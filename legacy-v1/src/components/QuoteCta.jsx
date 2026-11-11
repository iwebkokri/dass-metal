export default function QuoteCta() {
  return (
    <section id="quote" className="section container quote-grid">
      <div className="quote-panel quote-panel--accent">
        <span className="eyebrow eyebrow--light">Request a quote</span>
        <h2 className="h2 h2--sm">Send the list. We’ll handle the rest.</h2>
        <p>Share your takeoff, drawing or product list with sizes, gauges and quantities. We’ll come back with pricing, availability and a delivery date.</p>
        <a href="#contact" className="btn btn--dark btn--lg self-start">Request a quote</a>
      </div>
      <div className="quote-panel quote-panel--plain">
        <span className="eyebrow">Custom profiles</span>
        <h2 className="h2 h2--sm">Need a profile we don’t list?</h2>
        <p className="body-secondary">We produce custom profiles to client requirements — special gauges, exact lengths, custom widths and specialty tracks. Send the dimensions or a shop drawing for review.</p>
        <a href="#contact" className="btn btn--outline btn--lg self-start">Discuss a custom profile</a>
      </div>
    </section>
  );
}
