import { company } from '../data/site.js';
import { usePageMeta } from '../lib/helpers.js';
import { Icon, PageHero } from '../components/ui.jsx';

export default function Msds() {
  usePageMeta('Material Safety Data Sheets (MSDS)', 'Access Material Safety Data Sheets (MSDS) for Dass Metal products. Ensure safety and compliance with detailed information');
  return (
    <>
      <PageHero title="Material Safety Data Sheets (MSDS)" />
      <section className="section">
        <div className="container container--narrow">
          <div className="notice">
            <h2 className="h3 h3--lg">Documents available upon request.</h2>
            <p className="body-secondary">
              Please email us at <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
            <a className="btn btn--accent btn--lg self-start" href={`mailto:${company.email}?subject=MSDS%20request`}>
              <Icon.Mail /> Email {company.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
