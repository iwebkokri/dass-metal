// The public site's frame: top bar + header (with the Products mega menu), footer and the floating call / quote buttons.
// Everything comes from Studio CMS — contact details and holiday notice from Settings, the menu from the Products screen.
import './site.css';
import './site-cms.css';
import { getCompany, getMenu } from '@/lib/site-chrome';
import SiteHeader, { TopBar } from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import FloatingActions from './FloatingActions.jsx';

export function SiteHeaderBar() {
  const company = getCompany();
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <TopBar company={company} />
      <SiteHeader company={company} menu={getMenu()} />
    </>
  );
}

export function SiteFooterBar() {
  const company = getCompany();
  return (
    <>
      <SiteFooter company={company} />
      <FloatingActions phone={company.phones[0]} />
    </>
  );
}
