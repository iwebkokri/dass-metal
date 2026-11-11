import Link from 'next/link';
import { PageHero } from './ui.jsx';

/** The public "page not found" content (the approved Dass Metal design). */
export default function NotFoundBlock() {
  return (
    <div className="dm">
      <PageHero title="Page not found" lead="The page you were looking for doesn’t exist or has moved." />
      <section className="section">
        <div className="container stack-28">
          <div className="btn-row">
            <Link className="btn btn--accent btn--lg" href="/">Back to home</Link>
            <Link className="btn btn--outline btn--lg" href="/our-products">Browse products</Link>
            <Link className="btn btn--outline btn--lg" href="/blogs">Read the blog</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
