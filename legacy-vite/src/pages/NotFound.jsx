import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/helpers.js';
import { PageHero } from '../components/ui.jsx';

export default function NotFound() {
  usePageMeta('Page not found', 'The page you were looking for could not be found.');
  return (
    <>
      <PageHero title="Page not found" lead="The page you were looking for doesn’t exist or has moved." />
      <section className="section">
        <div className="container stack-28">
          <div className="btn-row">
            <Link className="btn btn--accent btn--lg" to="/">Back to home</Link>
            <Link className="btn btn--outline btn--lg" to="/our-products">Browse products</Link>
            <Link className="btn btn--outline btn--lg" to="/blogs">Read the blog</Link>
          </div>
        </div>
      </section>
    </>
  );
}
