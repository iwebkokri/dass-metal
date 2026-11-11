# Dass Metal Products — Website (React + Vite)

Homepage for Dass Metal Products (dassmetal.com): full-bleed hero slider, scrolling product ticker, product systems, audience tabs, facility, applications, technical resources, ordering steps, reviews, service area, guides, FAQ, quote CTAs and footer.

## Run it

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build in /dist
npm run preview  # preview the production build
```

Requires Node.js 18+.

## Where to edit

- **All copy and lists:** `src/data/content.js`
- **Colours and fonts:** CSS variables at the top of `src/index.css`
  (`--accent` controls buttons, logo mark, quote panel and floating quote button)
- **Sections:** one component per section in `src/components/`, assembled in `src/App.jsx`

## Adding real photos

1. Put images in `public/images/`.
2. Hero: set `image: '/images/hero-1.jpg'` on each slide in `content.js`.
3. Other sections: pass `src="/images/..."` to the `<Photo>` component.

## Placeholders still to fill

Marked `[PLACEHOLDER]` / in square brackets: email, business hours, certification logos, Google reviews, guide dates, photos and the facility video.
