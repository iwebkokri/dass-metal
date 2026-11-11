'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './ui.jsx';

/** Round "call" button and a "Get a Quote" pill (small screens only); hidden on the quote form's own page. */
export default function FloatingActions({ phone }) {
  const pathname = usePathname();
  if (pathname === '/contact') return null;
  return (
    <div className="floating">
      {phone && <a className="floating__call" href={phone.href} aria-label={`Call ${phone.label}`}><Icon.Phone width={22} height={22} /></a>}
      <Link className="btn btn--accent floating__quote" href="/contact#quote">Get a Quote</Link>
    </div>
  );
}
