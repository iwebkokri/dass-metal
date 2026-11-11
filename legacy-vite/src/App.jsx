import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

// Every other page is its own chunk, so the homepage stays light.
const About = lazy(() => import('./pages/About.jsx'));
const Products = lazy(() => import('./pages/Products.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Standards = lazy(() => import('./pages/Standards.jsx'));
const Msds = lazy(() => import('./pages/Msds.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Blogs = lazy(() => import('./pages/Blogs.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// URLs mirror dassmetal.com so existing links and search results keep working.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="our-products" element={<Products />} />
        <Route path="products" element={<Navigate to="/our-products" replace />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="standards" element={<Standards />} />
        <Route path="msds" element={<Msds />} />
        <Route path="projects" element={<Projects />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="contact" element={<Contact />} />
        {/* blog posts live at the site root on the live site: /some-post-slug */}
        <Route path=":slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
