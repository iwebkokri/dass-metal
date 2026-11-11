'use client';

// Inline-editing helpers for the Dass Metal design widgets.
//
// On the public site every helper renders plain markup (identical to hand-written JSX).
// Inside the page builder's canvas the same helpers become:
//   <T>        click-to-edit text         -> writes the widget's prop (or a repeater item's field)
//   data-img   double-click to replace the image (a "Change photo" chip for background photos)
//   <DLink>    double-click the edge of a button / card to change where it links
//   data-item  clicking inside a repeater item opens that item in the settings panel
// A widget opts in by being rendered inside <Editing node edit> (see components/builder/widgets/site).
import './site.css';
import './site-cms.css';
import { createContext, createElement, useContext, useMemo } from 'react';
import Link from 'next/link';
import EditableText from '@/components/builder/EditableText';
import { isInternal, safeUrl } from '@/lib/builder/url.mjs';
import { Reveal } from './Reveal.jsx';

const EditContext = createContext(null);

/** Wraps one widget. `edit` is only defined inside the builder canvas; on the public site this is a no-op. */
export function Editing({ node, edit, children }) {
  const value = useMemo(() => (edit ? { node, ctx: { data: {}, edit } } : null), [node, edit]);
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

export const useEditing = () => useContext(EditContext);

/** Attribute helpers for the markup of a widget. Each returns `{}` on the public site. */
export function useEditAttrs() {
  const e = useContext(EditContext);
  return {
    editing: !!e,
    /** spec: 'src' (a prop) or 'items|2|logo' (field of repeater item 2) */
    img: (spec) => (e ? { 'data-img': spec, title: 'Double-click to change this image' } : {}),
    item: (key, index) => (e ? { 'data-item': `${key}|${index}` } : {}),
  };
}

const year = () => String(new Date().getFullYear());

/**
 * Text that is plain on the public site and click-to-edit in the builder.
 * `k` is the prop; for text inside a repeater pass `item={{ key: 'items', index: 2, field: 'title' }}`.
 * `reveal` ({ variant, delay }) adds the scroll-in animation on the public site only.
 */
export function T({ k, item, as: Tag = 'span', className = '', rich = false, multiline = false, placeholder = 'Type here…', reveal, style, children, ...rest }) {
  const e = useContext(EditContext);
  const value = typeof children === 'string' ? children : children == null ? '' : String(children);
  if (e) {
    return <EditableText node={e.node} k={k} item={item} as={Tag} className={className} ctx={e.ctx} rich={rich} multiline={multiline} placeholder={placeholder} value={value} style={style} />;
  }
  const props = { className, style, ...rest };
  if (rich) {
    props.dangerouslySetInnerHTML = { __html: value };
    return reveal ? <Reveal as={Tag} {...reveal} {...props} /> : createElement(Tag, props);
  }
  const text = value.replace(/\{year\}/g, year());
  return reveal ? <Reveal as={Tag} {...reveal} {...props}>{text}</Reveal> : createElement(Tag, props, text);
}

/** Scroll-in animation on the public site; a plain element while editing (so everything is visible and editable). */
export function Rv({ as: Tag = 'div', variant, delay, className = '', children, ...rest }) {
  const e = useContext(EditContext);
  if (e || !variant) return createElement(Tag, { className, ...rest }, children);
  return <Reveal as={Tag} variant={variant} delay={delay} className={className} {...rest}>{children}</Reveal>;
}

/**
 * A link. Public site: next/link for pages, a normal anchor for everything else (new tab on request).
 * Builder: an anchor without an address (it can't navigate) that can be double-clicked to change the link.
 * `spec` says which prop holds the address: 'url' or 'items|2|href'.
 */
export function DLink({ url, newTab, spec, className, children, ...rest }) {
  const e = useContext(EditContext);
  if (e) return <a className={className} data-link={spec} title="Double-click the edge to change where this links" {...rest}>{children}</a>;
  const href = safeUrl(url || '');
  if (!href) return <span className={className} {...rest}>{children}</span>;
  if (isInternal(href) && !newTab) return <Link href={href} className={className} {...rest}>{children}</Link>;
  const external = /^https?:/i.test(href);
  return (
    <a href={href} className={className} {...(newTab || external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  );
}

/** "Change photo" button drawn on top of a background photo (builder only). */
export function ImgChip({ spec, label = 'Change photo' }) {
  const e = useContext(EditContext);
  if (!e) return null;
  return <button type="button" className="dm-chip" data-img={spec} tabIndex={-1}>{label}</button>;
}

/** The repeater items of a prop, always an array. */
export const list = (v) => (Array.isArray(v) ? v : []);
