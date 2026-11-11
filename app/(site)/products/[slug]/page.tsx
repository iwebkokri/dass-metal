// A product page (/products/<slug>) — everything on it is edited under Studio CMS > Products.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/builder/PageShell';
import ProductBlock from '@/components/site/blocks/ProductBlock.jsx';
import { getCurrentUser } from '@/lib/auth';
import { getProductBySlug, getProducts, relatedProducts } from '@/lib/content';
import { sanitizeRichHtml } from '@/lib/rich-html.mjs';
import { can } from '@/lib/roles';
import { productJsonLd, productMetadata } from '@/lib/seo';
import { getCompany } from '@/lib/site-chrome';
import { followRedirect } from '@/lib/site-redirect';
import '@/components/site/site.css';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

/** Visitors see published products; an editor also sees (and previews) unpublished ones. */
async function load(slug: string) {
  const live = getProductBySlug(slug);
  if (live) return { product: live, preview: false };
  const user = await getCurrentUser();
  if (!user || !can(user, 'manage_content')) return null;
  const draft = getProductBySlug(slug, { preview: true });
  return draft ? { product: draft, preview: true } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load((await params).slug);
  if (!found) return { title: 'Product not found', robots: { index: false, follow: false } };
  return productMetadata(found.product, { preview: found.preview });
}

export default async function ProductPage({ params }: Props) {
  const slug = (await params).slug;
  const found = await load(slug);
  if (!found) {
    followRedirect(`products/${slug}`); // a renamed product keeps its old address working
    notFound();
  }
  const { product, preview } = found;
  const withBody = { ...product, body: sanitizeRichHtml(product.body) };
  return (
    <PageShell path={`products/${product.slug}`} nodes={[]} edit={{ label: 'Edit this product', href: `/admin/products/${product.id}` }} jsonld={preview ? [] : productJsonLd(product)}>
      <div className="dm">
        {preview && <p className="dm-preview" role="status">Preview — this product is not published yet.</p>}
        <ProductBlock product={withBody} related={relatedProducts(product, getProducts(), 3)} company={getCompany()} />
      </div>
    </PageShell>
  );
}
