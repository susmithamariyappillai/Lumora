import { useState } from 'react';
import Icon from './Icons';
import { COLOUR_HEX, COLOUR_ORDER, SIZE_ORDER, categoryLabel } from '../utils/constants';

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="f-section">
      <button className="f-head" aria-expanded={open} onClick={() => setOpen(!open)}>{title}<span className={open ? 'flip' : ''}><Icon name="chevron" size={16} /></span></button>
      {open && <div className="f-body">{children}</div>}
    </div>
  );
}

// filters = { sub:[], cat:[], size:[], colour:[], max:'', rating:'' }; onChange(patch) updates the URL.
export default function FilterSidebar({ meta, filters, onChange, onClear, mode }) {
  const toggle = (key, value) => {
    const list = filters[key];
    onChange({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };
  const sizes = SIZE_ORDER.filter((s) => meta.sizes.includes(s));
  const colours = COLOUR_ORDER.filter((c) => meta.colours.includes(c));
  const max = filters.max || 5000;

  return (
    <div className="filters">
      <h2>Filters</h2>
      <Section title="Category">
        {mode === 'sub'
          ? meta.subcategories.map((s) => (
              <label key={s.name} className="check"><input type="checkbox" checked={filters.sub.includes(s.name)} onChange={() => toggle('sub', s.name)} /> {s.name} <small>({s.count})</small></label>
            ))
          : meta.categories.map((c) => (
              <label key={c.slug} className="check"><input type="checkbox" checked={filters.cat.includes(c.slug)} onChange={() => toggle('cat', c.slug)} /> {categoryLabel(c.slug)} <small>({c.count})</small></label>
            ))}
      </Section>
      {sizes.length > 0 && (
        <Section title="Size">
          <div className="size-grid">
            {sizes.map((s) => <button key={s} className={`size ${filters.size.includes(s) ? 'sel' : ''}`} aria-pressed={filters.size.includes(s)} onClick={() => toggle('size', s)}>{s}</button>)}
          </div>
        </Section>
      )}
      {colours.length > 0 && (
        <Section title="Colour">
          {colours.map((c) => (
            <label key={c} className="check"><input type="checkbox" checked={filters.colour.includes(c)} onChange={() => toggle('colour', c)} /><i className="dot" style={{ background: COLOUR_HEX[c] }} /> {c}</label>
          ))}
        </Section>
      )}
      <Section title="Price Range">
        <input type="range" min="0" max="5000" step="100" value={max} aria-label="Maximum price" onChange={(e) => onChange({ max: Number(e.target.value) >= 5000 ? '' : e.target.value })} />
        <div className="range-labels"><span>₹0</span><span>{Number(max) >= 5000 ? '₹5,000+' : `Up to ₹${Number(max).toLocaleString('en-IN')}`}</span></div>
      </Section>
      <Section title="Rating">
        {[4, 3, 2].map((r) => (
          <label key={r} className="check"><input type="radio" name="rating" checked={String(filters.rating) === String(r)} onChange={() => onChange({ rating: String(r) })} /> {r} stars &amp; above</label>
        ))}
      </Section>
      <button className="btn btn-outline btn-block" onClick={onClear}>Clear Filters</button>
    </div>
  );
}
