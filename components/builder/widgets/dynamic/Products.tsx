// `products` widget — Dass Metal product cards from the CMS (all products, one category, or the first few).
import Link from 'next/link';
import type { WidgetProps } from '@/lib/builder/types';
import { EmptyBox, num, str } from './shared';

type Product = { id: number; slug: string; name: string; category?: string; description?: string; image?: string };

export function Products({ node, ctx }: WidgetProps) {
  const p = node.props || {};
  const edit = !!ctx.edit;
  let list: Product[] = (ctx.data.products as Product[] | undefined) || [];
  const category = str(p.category).trim();
  if (category) list = list.filter((x) => x.category === category);
  const limit = num(p.limit, 0);
  if (limit > 0) list = list.slice(0, limit);
  if (!list.length) return <EmptyBox edit={edit}>No products to show{category ? ` in “${category}”` : ''} — add them under Products in the admin.</EmptyBox>;

  return (
    <div className="dr-prod-grid">
      {list.map((x) => {
        const body = (
          <>
            {x.image ? <img className="dr-card-img dr-card-img--43" src={x.image} alt={x.name} loading="lazy" /> : null}
            <div className="dr-card-body dr-card-body--lg">
              {x.category ? <span className="dr-eyebrow dr-eyebrow--dim">{x.category}</span> : null}
              <h3 className="dr-card-title dr-ct-prod">{x.name}</h3>
              {x.description ? <p className="dr-card-text">{x.description}</p> : null}
            </div>
          </>
        );
        // while editing, cards are plain boxes (clicking must select the widget, not navigate away)
        return edit ? (
          <article key={x.id} className="dr-card dr-card--prod">{body}</article>
        ) : (
          <Link key={x.id} href={`/products/${x.slug}`} className="dr-card dr-card--prod">{body}</Link>
        );
      })}
    </div>
  );
}
