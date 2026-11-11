import { Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header, { TopBar } from './Header.jsx';
import Footer from './Footer.jsx';
import { company } from '../data/site.js';
import { Icon } from './ui.jsx';

/** Scroll to top on navigation, or to the #anchor when the URL has one. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const jump = () => document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      if (document.getElementById(id)) { jump(); return undefined; }
      const t = setTimeout(jump, 300); // lazy route may still be loading
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return undefined;
  }, [pathname, hash]);
  return null;
}

function FloatingActions() {
  const { pathname } = useLocation();
  if (pathname === '/contact') return null;
  return (
    <div className="floating">
      <a className="floating__call" href={company.phones[0].href} aria-label={`Call ${company.phones[0].label}`}><Icon.Phone width={22} height={22} /></a>
      <Link className="btn btn--accent floating__quote" to="/contact#quote">Get a Quote</Link>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <TopBar />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="page-loading" role="status">Loading…</div>}>
          <div key={pathname} className="page-enter">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
      <FloatingActions />
      <ScrollManager />
    </>
  );
}
