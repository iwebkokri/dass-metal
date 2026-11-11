import { company } from '../data/content.js';

export default function FloatingActions({ quoteCount = 0 }) {
  return (
    <div className="floating">
      <a href={company.phoneHref} className="floating__call" aria-label={`Call Dass Metal at ${company.phone}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
      </a>
      <a href="#quote" className="btn btn--accent floating__quote">
        Get a quote <span className="badge">{quoteCount}</span>
      </a>
    </div>
  );
}
