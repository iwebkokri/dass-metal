// Page copy and structure that is part of the DESIGN (hero slides, "why" columns, about page, standards …). Text is taken from https://dassmetal.com/.
// Everything that is managed in the Studio CMS (contact details, products, posts, projects, menus) does NOT live here.
import { img } from './site-helpers.mjs';

export const resources = [
  { label: 'Products Brochure', href: '/documents/dass-metal-products-brochure.pdf', file: true },
  { label: 'Load Table (Metric & Imperial)', href: '/documents/cssbi-58-2024-load-tables.pdf', file: true },
  { label: 'Standards', href: '/standards' },
  { label: 'MSDS', href: '/msds' },
];

export const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/our-products' },
  { label: 'Affiliates', href: '/#affiliated' },
  { label: 'JDass Brands', href: '/about#diversebrands' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];

export const logos = {
  light: img('2023/11/Dass-Metal-Logo-v2.svg'), // white artwork, for dark backgrounds
  jdassWhite: img('2025/07/Dass-Metal-Products-JDass-Corp-logo-1.webp'),
  canadian: img('2025/03/Proudly-Canadian.png'),
};

/* ------------------------------ Home ------------------------------ */
export const home = {
  // Hero slider. Headlines and body text are the live site's own statements; `side: 'right'` moves the text
  // to the right-hand side when the photo's subject is on the left.
  slides: [
    {
      eyebrow: 'Quality · Value · Customized Solutions',
      title: 'Leading Manufacturers of Building Products',
      text: 'Steel studs and metal framing, manufactured in Canada and delivered across Canada & the US.',
      image: img('2025/07/Dass-Metal-Products-JDass-Corp-worker.jpg'),
      position: '60% 40%',
      ctas: [{ label: 'Explore Products', to: '/our-products' }, { label: 'Get a Quote', to: '/contact#quote' }],
    },
    {
      eyebrow: 'CSSBI Certified',
      title: 'Quality',
      text: 'Dass Metal sets the bar for excellence with CSSBI Certification and a team of seasoned engineers with over 40 years of experience.',
      image: img('2024/04/DSC_2479-scaled.jpg'),
      position: '30% 55%',
      side: 'right',
      ctas: [{ label: 'Our Standards', to: '/standards' }, { label: 'About Us', to: '/about' }],
    },
    {
      eyebrow: 'Vaughan, Ontario',
      title: 'Manufactured in Canada',
      text: 'Canadian-made metal products manufactured to the highest standards with unmatched quality and durability.',
      image: img('2025/07/Dass-Metal-Products-JDass-Corp-build.webp'),
      position: '50% 60%',
      ctas: [{ label: 'About Us', to: '/about' }, { label: 'View Projects', to: '/projects' }],
    },
    {
      eyebrow: 'Canada & the US',
      title: 'Cross-Border Delivery',
      text: 'We proudly offer reliable delivery services across Canada & the US, ensuring our high-quality products reach you promptly.',
      image: img('2025/07/Dass-Metal-Products-JDass-Corp-pro.jpg'),
      position: '55% 55%',
      ctas: [{ label: 'Contact Us', to: '/contact' }, { label: 'Explore Products', to: '/our-products' }],
    },
    {
      eyebrow: 'Custom profiles',
      title: 'Customized Solutions',
      text: 'We provide tailored solutions, offering custom profiles as required by the clients to meet specific project requirements with precision.',
      image: img('2024/05/DSC_2011-scaled.jpg'),
      position: '60% 50%',
      ctas: [{ label: 'Request a Quote', to: '/contact#quote' }, { label: 'Special Profiles', to: '/products/special-profiles' }],
    },
  ],
  facts: [
    { value: '1986', label: 'Established under JDass Corp' },
    { value: '40+', label: 'Years of engineering experience' },
    { value: 'CSSBI', label: 'Certified' },
    { value: 'Canada & US', label: 'Cross-border delivery' },
  ],
  top: {
    title: 'Top Dass Metal Products',
    text: "Dass Metal Products excels at transforming complex, time-sensitive customer challenges into simple, practical solutions that are vital to our customers' needs.",
    slugs: [
      'j-track', 'webslide-clip', 'bridging-clip', 'tie-wire', 'hanger-wire',
      'welded-wire-mesh', 'j-trim', 'non-load-bearing-steel-framing-light-gauge', 'flat-strips', 'special-profiles',
    ],
  },
  values: [
    { title: 'Manufactured in Canada', text: 'Canadian-made metal products manufactured to the highest standards with unmatched quality and durability.', icon: '/images/icons/why-1.png' },
    { title: 'Quality', text: 'Our state-of-the-art equipment and rigorous quality control ensures unmatched precision and reliability in every product.', icon: '/images/icons/why-2.png' },
    { title: 'Cross-Border Delivery', text: 'We proudly offer reliable delivery services across Canada & the US, ensuring our high-quality products reach you promptly.', icon: '/images/icons/why-3.png' },
    { title: 'Customer Service', text: 'Our dedicated team is always ready to provide personalized support and ensure satisfaction with every interaction.', icon: '/images/icons/why-4.png' },
    { title: 'Strengthening Canada', text: 'We boost local employment, fostering economic growth through Canadian-made materials and services.', icon: '/images/icons/why-5.png' },
  ],
  trusted: {
    title: 'Trusted Steel Framing Products Canada',
    cards: [
      { title: 'Quality', text: 'Dass Metal sets the bar for excellence with CSSBI Certification and a team of seasoned engineers with over 40 years of experience.', image: img('2025/07/Dass-Metal-Products-JDass-Corp-quality.jpg'), alt: 'CSSBI member — Canadian Sheet Steel Building Institute', contain: true },
      { title: 'Value', text: 'Dass Metal adds value through innovative products and efficient processes, ensuring top-notch quality and performance.', image: img('2024/04/DSC_2479-scaled.jpg'), alt: 'Steel framing profiles produced at Dass Metal' },
      { title: 'Customized Solutions', text: 'We provide tailored solutions, offering custom profiles as required by the clients to meet specific project requirements with precision.', image: img('2025/07/Dass-Metal-Products-JDass-Corp-pro.jpg'), alt: 'Bundles of steel studs being loaded for delivery' },
    ],
  },
  pillars: [
    { title: 'Trusted Expertise', text: 'Our ability to identify your needs, deliver the products you want, helps you build better.', icon: '/images/icons/pillar-1.png' },
    { title: 'Total Excellence', text: 'We hold ourselves to very high standards to build, supply products that stand time.', icon: '/images/icons/pillar-2.png' },
    { title: 'Industry Leadership', text: 'We bring proven expertise to deliver the right products, in the right dimensions & quantity.', icon: '/images/icons/pillar-3.png' },
    { title: 'Personalized Service', text: 'We meet your specific needs with experts who will support and guide you at every step.', icon: '/images/icons/pillar-4.png' },
  ],
  mission: 'We are committed to becoming your provider of choice for trusted, high-quality steel studs and metal products.',
  panels: [
    { label: 'About Dass Metal', title: 'Building Better with Metal Studs & Steel Framing', text: 'Our strategy of partnering with best-in-class suppliers ensures that you always have access to the finest products at competitive prices.', to: '/about', image: img('2025/07/Dass-Metal-Products-JDass-Corp-build.webp'), alt: 'Aerial view of the Dass Metal facility in Vaughan' },
    { label: 'Our Projects', title: 'We are passionate about your success', text: 'Our team of highly skilled engineers have extensive experience in all areas of the steel framing industry. Their combined expertise ensures that we provide top-notch service, meeting the highest standards of quality and innovation in every project.', to: '/projects', image: img('2025/07/Dass-Metal-Products-JDass-Corp-site.jpg'), alt: 'Installer framing a building with Dass steel studs and track' },
  ],
  affiliates: [
    { name: 'JDass Corp', href: 'https://dass.ca/', logo: img('2025/07/Dass-Metal-Products-JDass-Corp-logo.webp') },
    { name: 'Dass Steel Service Centre', href: 'https://dasssteel.com/', logo: img('2025/07/Dass-Metal-Products-JDass-Corp-dss.webp') },
    { name: 'Dass Rebar', href: 'https://dassrebar.com/', logo: img('2025/07/Dass-Metal-Products-JDass-Corp-dr.webp') },
    { name: 'Quick Scrap Metal', href: 'https://quickscrapmetal.com/', logo: img('2025/07/Dass-Metal-Products-JDass-Corp-qsm-lo.webp') },
  ],
};

/* ------------------------------ About ------------------------------ */
export const about = {
  intro: {
    title: 'Over 40 Years of Innovation & Excellence',
    text: 'When you work with us, you can be confident, knowing that we constantly strive to provide you with the highest quality products.',
    photos: [
      { src: img('2024/04/DSC_2070-681x1024.jpg'), alt: 'Steel track being formed on the roll-forming line' },
      { src: img('2024/05/dass-metal-cutting-681x1024.jpg'), alt: 'A team member cutting steel studs to length' },
      { src: img('2024/04/DSC_2059-681x1024.jpg'), alt: 'Galvanized steel studs at the Dass Metal facility' },
      { src: img('2024/04/DSC_2052-681x1024.jpg'), alt: 'Steel framing profiles ready for shipping' },
    ],
  },
  story: {
    title: 'Commitment to excellence since 1986',
    // html lets us keep the live site's inline links
    paragraphs: [
      'Established in 1986 under Jay Dass’s leadership, <a href="https://dass.ca/" target="_blank" rel="noopener noreferrer">JDASS CORP</a> began its journey with an electronics store in downtown Toronto. Since then, we’ve diversified into real estate, hospitality, the metal industry, and retail, boasting a robust investment portfolio and substantial land holdings across the GTA. With over three decades of industry expertise, <a href="https://dass.ca/" target="_blank" rel="noopener noreferrer">JDASS</a> has cultivated a network of brands and projects positioned for enduring success around the GTA.',
      'Our metal products business is built on the same JDass philosophy of providing our customers with the quality and service they deserve. We opened our first manufacturing facility at 1575 Drew Road Mississauga.',
    ],
    image: img('2024/05/dass-metal-frame-scaled.jpg'),
    imageAlt: 'Steel framing assembled at the Dass Metal facility',
    present:
      'Fast-forwarding to the present, Dass Metal Products has significantly expanded its operations and capabilities. We are now located at 370 New Enterprise Way, Vaughan, ensuring our reach and services meet the growing demands of our clients. With advanced facilities and a dedicated team, we continue to deliver top-quality metal products for diverse construction needs. Our commitment to innovation and excellence remains unwavering as we grow and serve more communities.',
  },
  brands: {
    title: 'Our Diverse Brands',
    items: [
      { name: 'Mississauga Convention Centre', href: 'https://mississaugaconvention.com/', logo: img('2024/06/MCC-H-100.png') },
      { name: 'Dass Real Estate', href: 'https://dass.ca/industries/real-estate/', logo: img('2024/06/DassReal-H-100.png') },
      { name: 'Fairfield Inn & Suites by Marriott, Barrie', href: 'https://www.marriott.com/en-us/hotels/rqsfi-fairfield-inn-and-suites-barrie/overview/', logo: img('2024/06/Fairfield-H-100.png') },
      { name: 'J. Dass Distillery', logo: img('2024/06/JDASS-Distillery-H-100.png') },
      { name: 'Dass Developments', href: 'https://dass.ca/industries/real-estate/', logo: img('2024/06/DassDevelop-H-100.png') },
      { name: 'Yogi Farm Fresh', logo: img('2024/12/yogi.png') },
      { name: 'Shanty Bay Golf Club', href: 'https://shantybaygolf.com/', logo: img('2024/12/sbg-jdass.webp') },
      { name: 'Hotel EST', href: 'https://esthotel.ca/', logo: img('2024/06/EST-HOTEL300x100.png') },
      { name: 'Food World Supermarket', href: 'https://foodworldsupermarket.com/', logo: img('2024/12/fw-500.png') },
      { name: 'Skye Hotel & Residences', href: 'https://skyehotel.ca/', logo: img('2024/12/skye-hotel-residences.png') },
      { name: 'Mantra Farm Fresh', logo: img('2024/12/mantraa.png') },
      { name: 'Dass Imports', href: 'https://dass.ca/industries/imports/', logo: img('2024/07/imports-final-logo-blue.png') },
      { name: 'Meadowvale Apartment Hotel', href: 'https://meadowvalehotel.ca/', logo: img('2025/06/Meadowvale-Logo-1024x284.png') },
      { name: 'The Play Scape', href: 'https://theplayscape.ca/', logo: img('2025/06/playscape_Final-1024x805.png') },
      { name: 'Combined Petroleum Limited', href: 'https://cpetro.ca/', logo: img('2025/06/comb-logo.png') },
    ],
  },
  team: {
    title: 'Passionate, Skilled, and Dedicated to Serving You',
    paragraphs: [
      'Our team of professionals at JDass Corp. have extensive experience across all areas of the steel framing industry. With combined 50+ years in roll forming and comprehensive manufacturing, including quality control, ISO certification, and in-house training, we ensure exceptional service and top-notch products.',
      'At JDass Corp., we prioritize integrity, accountability, honesty, and respect. Join us on our journey as we strive to expand into key areas and build a brighter future together. Our dedicated team of engineers, manufacturers, and sales professionals are here to serve you.',
    ],
  },
  memberships: {
    title: 'Our Memberships',
    items: [
      { name: 'CSC', logo: img('2023/10/1.png') },
      { name: 'BILD', logo: img('2023/10/2.png') },
      { name: 'ISCA', logo: img('2023/10/isca-logo-OUTLINE-FILL-100x50-1.png') },
      { name: 'Toronto Construction Association — 150 years', logo: img('2023/10/3.jpg') },
      { name: 'LBMAO — Lumber and Building Materials Association of Ontario', logo: img('2024/05/member4-logo1.png') },
    ],
  },
};

/* ---------------------------- Standards ---------------------------- */
export const standards = {
  title: 'Dass Technical Design and Engineering Standards',
  text: 'DASS METAL PRODUCTS lines of products meet or exceed all design and engineering criteria for structural performance, STC and ULc Fire Classifications. Please contact our technical department for any specific inquiries regarding your project.',
  list: [
    { code: 'ASTM C645', covers: 'Profile, Steel thickness, and Dimensions' },
    { code: 'ASTM 1003', covers: 'Grade of Steel' },
    { code: 'ASTM A653', covers: 'Zinc coated galvanized sheet' },
    { code: 'ASTM A792', covers: 'Aluminum zinc coated steel sheet' },
    { code: 'ASTM C754', covers: 'Installation' },
    { code: 'ASTM C1047', covers: 'Trims and Accessories' },
  ],
  badge: img('2024/05/quality-metal-grey.png'),
  photo: img('2024/04/edited1-s.jpg'),
};

/* ---------------------- Header & footer (defaults) ---------------------- */
// These seed the "Header with menu" and "Footer" widgets, and are what the site shows if no header / footer template exists.
export const headerDefaults = {
  logo: logos.light,
  logoAlt: 'Dass Metal Products',
  ctaLabel: 'Get a Quote',
  ctaUrl: '/contact#quote',
  callLabel: 'Call',
  megaLabel: 'View all products',
  megaUrl: '/our-products',
  nav: [
    { label: 'Home', type: 'link', url: '/' },
    { label: 'About Us', type: 'dropdown', markActive: true, children: [{ label: 'About Us', url: '/about' }, { label: 'JDass Brands', url: '/about#diversebrands' }] },
    { label: 'Products', type: 'products' },
    { label: 'Resources', type: 'dropdown', children: resources.map((r) => ({ label: r.label, url: r.href, pdf: !!r.file })) },
    { label: 'Projects', type: 'link', url: '/projects' },
    { label: 'Blogs', type: 'link', url: '/blogs' },
    { label: 'Contact Us', type: 'link', url: '/contact' },
  ],
};

export const footerDefaults = {
  logo: logos.light,
  logoAlt: 'Dass Metal Products',
  badge: logos.canadian,
  badgeAlt: 'Proudly Canadian',
  linksTitle: 'Quick Links',
  links: footerLinks.map((l) => ({ label: l.label, url: l.href })),
  contactTitle: 'Get In Touch',
  affilTitle: 'A JDass Corp Company',
  affilLogo: logos.jdassWhite,
  affilAlt: 'JDass',
  affilUrl: 'https://dass.ca/',
  holidayTitle: 'Our Holiday Hours',
  copyright: '© {year} | All Rights Reserved.',
};
