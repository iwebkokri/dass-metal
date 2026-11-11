'use client';

// The site frame as editable widgets: top bar, header with menu, footer. The same components also draw the standard header and
// footer when no header / footer template exists (components/site/SiteChrome.tsx).
import SiteHeader, { TopBar } from '../SiteHeader.jsx';
import SiteFooter from '../SiteFooter.jsx';
import FloatingActions from '../FloatingActions.jsx';

export function DmTopbar({ p, company }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <TopBar company={company} show={p} />
    </>
  );
}

export function DmHeader({ p, company, menu }) {
  return <SiteHeader company={company} menu={menu} config={p} />;
}

export function DmFooter({ p, company }) {
  return (
    <>
      <SiteFooter company={company} config={p} />
      <FloatingActions phone={company.phones[0]} />
    </>
  );
}
