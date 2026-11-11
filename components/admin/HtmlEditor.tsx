'use client';

// Rich-text editor for long content (blog posts, product descriptions).
//   Visual tab: edit on the page itself — bold, italic, headings, lists, quotes, links, images from the media library, dividers.
//   HTML tab:   the underlying markup, for anything the toolbar can't do (tables, galleries, videos).
// The value is posted as <input name={name}> and sanitised again on the server (lib/rich-html.ts) before it is stored.
import '@/app/admin/css/htmleditor.css';
import { useEffect, useRef, useState } from 'react';
import MediaPicker, { type PickedMedia } from './MediaPicker';

type Props = { name: string; defaultValue?: string; maxLength?: number; minHeight?: number };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function HtmlEditor({ name, defaultValue = '', maxLength = 200_000, minHeight = 360 }: Props) {
  const [html, setHtml] = useState(defaultValue);
  const [tab, setTab] = useState<'visual' | 'html'>('visual');
  const [picking, setPicking] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const saved = useRef<Range | null>(null); // the caret position, kept while the media picker is open

  // fill the visual area when it appears (and whenever the source tab changed the markup)
  useEffect(() => {
    if (tab === 'visual' && area.current && area.current.innerHTML !== html) area.current.innerHTML = html;
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const read = () => {
    if (area.current) setHtml(area.current.innerHTML.slice(0, maxLength));
  };
  const exec = (cmd: string, arg?: string) => {
    area.current?.focus();
    document.execCommand(cmd, false, arg);
    read();
  };
  const remember = () => {
    const sel = window.getSelection();
    saved.current = sel && sel.rangeCount && area.current?.contains(sel.anchorNode) ? sel.getRangeAt(0).cloneRange() : null;
  };
  const restore = () => {
    area.current?.focus();
    const sel = window.getSelection();
    if (sel && saved.current) { sel.removeAllRanges(); sel.addRange(saved.current); }
  };
  const bar = (label: React.ReactNode, title: string, run: () => void) => (
    <button type="button" title={title} aria-label={title} onMouseDown={(e) => { e.preventDefault(); run(); }}>{label}</button>
  );

  function insertImage(m: PickedMedia) {
    setPicking(false);
    restore();
    const alt = (m as { alt?: string }).alt || '';
    document.execCommand('insertHTML', false, `<figure><img src="${esc(m.url)}" alt="${esc(alt)}"></figure><p><br></p>`);
    read();
  }

  return (
    <div className="he">
      <input type="hidden" name={name} value={html} />
      <div className="he-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'visual'} className={tab === 'visual' ? 'is-on' : ''} onClick={() => setTab('visual')}>Visual</button>
        <button type="button" role="tab" aria-selected={tab === 'html'} className={tab === 'html' ? 'is-on' : ''} onClick={() => { read(); setTab('html'); }}>HTML</button>
      </div>

      {tab === 'visual' ? (
        <>
          <div className="he-bar" role="toolbar" aria-label="Formatting">
            {bar(<b>B</b>, 'Bold', () => exec('bold'))}
            {bar(<i>I</i>, 'Italic', () => exec('italic'))}
            {bar('H2', 'Heading', () => exec('formatBlock', 'h2'))}
            {bar('H3', 'Sub-heading', () => exec('formatBlock', 'h3'))}
            {bar('¶', 'Paragraph', () => exec('formatBlock', 'p'))}
            {bar('• List', 'Bulleted list', () => exec('insertUnorderedList'))}
            {bar('1. List', 'Numbered list', () => exec('insertOrderedList'))}
            {bar('❝', 'Quote', () => exec('formatBlock', 'blockquote'))}
            {bar('Link', 'Link', () => { remember(); const url = window.prompt('Link address (https://…, /page, mailto:…)'); if (url) { restore(); exec('createLink', url); } })}
            {bar('Unlink', 'Remove link', () => exec('unlink'))}
            {bar('Image', 'Insert an image from the media library', () => { remember(); setPicking(true); })}
            {bar('—', 'Divider line', () => exec('insertHorizontalRule'))}
            {bar('Clear', 'Remove formatting', () => exec('removeFormat'))}
          </div>
          <div
            ref={area}
            className="he-area"
            style={{ minHeight }}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Content"
            onInput={read}
            onBlur={read}
          />
        </>
      ) : (
        <textarea className="he-source sc-textarea" style={{ minHeight }} spellCheck={false} value={html} maxLength={maxLength} onChange={(e) => setHtml(e.target.value)} aria-label="HTML source" />
      )}
      <p className="sc-help he-help">Allowed: headings, paragraphs, lists, links, images, tables, quotes and videos. Anything else is removed when you save.</p>
      <MediaPicker open={picking} kind="image" title="Insert image" onPick={insertImage} onClose={() => setPicking(false)} />
    </div>
  );
}
