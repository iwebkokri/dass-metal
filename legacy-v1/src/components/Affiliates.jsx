import { affiliates } from '../data/content.js';

export default function Affiliates() {
  return (
    <section className="affiliates">
      <div className="container affiliates__inner">
        <span className="eyebrow">Affiliated companies</span>
        <div className="affiliates__list">
          {affiliates.map((a) =>
            a.href ? <a key={a.name} href={a.href}>{a.name}</a> : <span key={a.name}>{a.name}</span>
          )}
        </div>
      </div>
    </section>
  );
}
