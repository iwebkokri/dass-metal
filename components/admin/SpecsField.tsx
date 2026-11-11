'use client';

// Product specifications editor: a list of rows, each a name ("Widths") and its options (one per line).
// Posted as a JSON string in <input name={name}>; the server validates it again before saving.
import { useState } from 'react';

type Row = { id: number; label: string; values: string };
type Props = { name: string; defaultValue?: string };

let seq = 0;

function parse(json: string): Row[] {
  try {
    const v = JSON.parse(json);
    if (!Array.isArray(v)) return [];
    return v.map((x) => ({ id: ++seq, label: String(x?.label ?? ''), values: Array.isArray(x?.values) ? x.values.map(String).join('\n') : '' }));
  } catch {
    return [];
  }
}

export default function SpecsField({ name, defaultValue = '[]' }: Props) {
  const [rows, setRows] = useState<Row[]>(() => parse(defaultValue));
  const json = JSON.stringify(
    rows
      .map((r) => ({ label: r.label.trim(), values: r.values.split('\n').map((v) => v.trim()).filter(Boolean) }))
      .filter((r) => r.label)
  );
  const set = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const move = (i: number, d: number) =>
    setRows((rs) => {
      const j = i + d;
      if (j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="spx">
      <input type="hidden" name={name} value={json} />
      {rows.length === 0 && <p className="sc-help">No specifications yet. Add rows such as <em>Widths</em>, <em>Standard Lengths</em> or <em>Gauge</em>. Visitors can pick from these when they ask for a quote.</p>}
      {rows.map((r, i) => (
        <div className="spx-row sc-card" key={r.id}>
          <div className="sc-field">
            <label htmlFor={`spx-l-${r.id}`}>Name</label>
            <input id={`spx-l-${r.id}`} className="sc-input" value={r.label} maxLength={80} placeholder="Widths" onChange={(e) => set(r.id, { label: e.target.value })} />
          </div>
          <div className="sc-field">
            <label htmlFor={`spx-v-${r.id}`}>Options (one per line)</label>
            <textarea id={`spx-v-${r.id}`} className="sc-textarea" rows={3} value={r.values} placeholder={'2 ½”\n4”\n6”'} onChange={(e) => set(r.id, { values: e.target.value })} />
          </div>
          <div className="spx-actions">
            <button type="button" className="sc-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${r.label || 'row'} up`}>↑</button>
            <button type="button" className="sc-btn" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label={`Move ${r.label || 'row'} down`}>↓</button>
            <button type="button" className="sc-btn sc-btn-danger" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="sc-btn" onClick={() => setRows((rs) => [...rs, { id: ++seq, label: '', values: '' }])}>+ Add specification</button>
    </div>
  );
}
