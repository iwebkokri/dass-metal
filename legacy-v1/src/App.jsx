import Header from './components/Header.jsx';
import HeroSlider from './components/HeroSlider.jsx';
import Standards from './components/Standards.jsx';
import WhyDass from './components/WhyDass.jsx';
import Products from './components/Products.jsx';
import Audiences from './components/Audiences.jsx';
import Facility from './components/Facility.jsx';
import Applications from './components/Applications.jsx';
import Resources from './components/Resources.jsx';
import Ordering from './components/Ordering.jsx';
import Reviews from './components/Reviews.jsx';
import ServiceArea from './components/ServiceArea.jsx';
import Guides from './components/Guides.jsx';
import Faq from './components/Faq.jsx';
import QuoteCta from './components/QuoteCta.jsx';
import Affiliates from './components/Affiliates.jsx';
import Footer from './components/Footer.jsx';
import FloatingActions from './components/FloatingActions.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <HeroSlider />
        <Standards />
        <WhyDass />
        <Products />
        <Audiences />
        <Facility />
        <Applications />
        <Resources />
        <Ordering />
        <Reviews />
        <ServiceArea />
        <Guides />
        <Faq />
        <QuoteCta />
        <Affiliates />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
