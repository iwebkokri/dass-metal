// Dynamic (CMS-driven) widget components. Registered in ../index.ts through DYNAMIC_COMPONENTS.
// These wrappers read ONLY `ctx.data` and hand the client components just the props they need (never the whole ctx).
import type { ComponentType } from 'react';
import type { WidgetProps } from '@/lib/builder/types';
import Projects from './Projects';
import Insights from './Insights';
import { Products } from './Products';
import { ContactForm, CustomForm, Newsletter } from './Forms';
import { BLOCK_DOCS } from '@/db/site-pages.mjs';
import { RenderDoc } from '../../Render';
import { EmptyBox, str } from './shared';

function ContactFormWidget({ node }: WidgetProps) {
  const p = node.props || {};
  return <ContactForm title={str(p.title)} buttonLabel={str(p.buttonLabel)} successTitle={str(p.successTitle)} successText={str(p.successText)} />;
}

function NewsletterWidget({ node }: WidgetProps) {
  const p = node.props || {};
  return <Newsletter placeholder={str(p.placeholder)} buttonLabel={str(p.buttonLabel)} successText={str(p.successText)} />;
}

/**
 * The old one-widget page ("Site page content"). Pages are now real sections made of Dass Metal widgets (`npm run seed` converts them);
 * a page that has not been converted yet still renders, by drawing the same sections it would be converted into.
 */
function SiteBlockWidget({ node, ctx }: WidgetProps) {
  const build = (BLOCK_DOCS as Record<string, () => any[]>)[str(node.props?.block, 'home')];
  return build ? <RenderDoc nodes={build()} ctx={{ ...ctx, edit: undefined }} /> : null;
}

function FormWidget({ node, ctx }: WidgetProps) {
  const id = String(node.props?.formId ?? '');
  const form = id ? ctx.data.forms?.[id] : undefined;
  if (!form) return <EmptyBox edit={!!ctx.edit}>{id ? 'This form no longer exists — choose another one in the panel.' : 'Choose a form in the panel →'}</EmptyBox>;
  if (!form.fields?.length) return <EmptyBox edit={!!ctx.edit}>“{form.name}” has no fields yet — add some under Forms in the admin.</EmptyBox>;
  return <CustomForm form={form} />;
}

export const DYNAMIC_COMPONENTS: Record<string, ComponentType<WidgetProps>> = {
  'site-block': SiteBlockWidget,
  projects: Projects,
  insights: Insights,
  products: Products,
  'contact-form': ContactFormWidget,
  newsletter: NewsletterWidget,
  form: FormWidget,
};
