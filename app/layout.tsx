import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import '@/components/builder/builder.css';
import '@/components/builder/dynamic.css';
import SiteCodeBody from '@/components/site/SiteCodeBody';
import { resolveSiteCode } from '@/components/site/SiteCode';
import { rootMetadata } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// Headings use Space Grotesk. The CSS variable keeps the name --font-manrope because the admin / builder stylesheets already refer to it.
const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-manrope', display: 'swap' });

// Title template, description, icons, social card, verification codes and the "discourage search engines" switch come from
// Studio CMS (Settings + SEO) with the original values as fallbacks.
export async function generateMetadata(): Promise<Metadata> {
  return rootMetadata();
}

// The public site's header + footer are drawn by components/builder/PageShell (components/site/SiteChrome); the CMS lives in app/admin/layout.tsx.
// Tracking IDs and custom code are added by resolveSiteCode(): public pages only (see proxy.ts + docs/SEO-AND-TRACKING.md).
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const code = await resolveSiteCode();
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <head>{code.head}</head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>
        <SiteCodeBody id="dr-body-code" html={code.bodyOpen} />
        {children}
        <SiteCodeBody id="dr-footer-code" html={code.footer} />
      </body>
    </html>
  );
}
