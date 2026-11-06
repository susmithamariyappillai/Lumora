// Import useState hook
import { useState } from 'react';

// Import Icon component
import Icon from './Icons';

// Import common filter-related constants and functions
import {
  COLOUR_HEX,
  COLOUR_ORDER,
  SIZE_ORDER,
  categoryLabel
} from '../utils/constants';

// Reusable section component with expand/collapse functionality
function Section({ title, children }) {

  // Store whether the section is open or closed
  const [open, setOpen] = useState(true);

  return (
    <div className="f-section">

      {/* Button to open or close the filter section */}
      <button
        className="f-head"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {title}

        <span className={open ? 'flip' : ''}>
          <Icon name="chevron" size={16} />
        </span>
      </button>

      {/* Display section content only when open */}
      {open && <div className="f-body">{children}</div>}

    </div>
  );
}

// FilterSidebar component
// filters contains selected filter values
// onChange updates filters and URL
export default function FilterSidebar({
  meta,
  filters,
  onChange,
  onClear,
  mode
}) {

  // Add or remove a selected filter value
  const toggle = (key, value) => {

    // Get currently selected filter values
    const list = filters[key];

    // Remove value if already selected, otherwise add it
    onChange({
      [key]: list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    });
  };

  // Get available sizes in predefined order
  const sizes = SIZE_ORDER.filter((s) =>
    meta.sizes.includes(s)
  );

  // Get available colours in predefined order
  const colours = COLOUR_ORDER.filter((c) =>
    meta.colours.includes(c)
  );

  // Set default maximum price as 5000
  const max = filters.max || 5000;

  return (
    <div className="filters">

      <h2>Filters</h2>

      {/* Category filter */}
      <Section title="Category">

        {mode === 'sub'

          // Display subcategories
          ? meta.subcategories.map((s) => (
              <label key={s.name} className="check">
                <input
                  type="checkbox"
                  checked={filters.sub.includes(s.name)}
                  onChange={() => toggle('sub', s.name)}
                />
                {s.name}
                <small>({s.count})</small>
              </label>
            ))

          // Display main categories
          : meta.categories.map((c) => (
              <label key={c.slug} className="check">
                <input
                  type="checkbox"
                  checked={filters.cat.includes(c.slug)}
                  onChange={() => toggle('cat', c.slug)}
                />
                {categoryLabel(c.slug)}
                <small>({c.count})</small>
              </label>
            ))}

      </Section>

      {/* Size filter */}
      {sizes.length > 0 && (
        <Section title="Size">
          <div className="size-grid">

            {sizes.map((s) => (
              <button
                key={s}
                className={`size ${
                  filters.size.includes(s) ? 'sel' : ''
                }`}
                aria-pressed={filters.size.includes(s)}
                onClick={() => toggle('size', s)}
              >
                {s}
              </button>
            ))}

          </div>
        </Section>
      )}

      {/* Colour filter */}
      {colours.length > 0 && (
        <Section title="Colour">

          {colours.map((c) => (
            <label key={c} className="check">
              <input
                type="checkbox"
                checked={filters.colour.includes(c)}
                onChange={() => toggle('colour', c)}
              />

              {/* Display colour indicator */}
              <i
                className="dot"
                style={{ background: COLOUR_HEX[c] }}
              />

              {c}
            </label>
          ))}

        </Section>
      )}

      {/* Price range filter */}
      <Section title="Price Range">

        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={max}
          aria-label="Maximum price"
          onChange={(e) =>
            onChange({
              max: Number(e.target.value) >= 5000
                ? ''
                : e.target.value
            })
          }
        />

        <div className="range-labels">
          <span>₹0</span>

          <span>
            {Number(max) >= 5000
              ? '₹5,000+'
              : `Up to ₹${Number(max).toLocaleString('en-IN')}`}
          </span>
        </div>

      </Section>

      {/* Rating filter */}
      <Section title="Rating">

        {[4, 3, 2].map((r) => (
          <label key={r} className="check">
            <input
              type="radio"
              name="rating"
              checked={String(filters.rating) === String(r)}
              onChange={() => onChange({ rating: String(r) })}
            />

            {r} stars &amp; above
          </label>
        ))}

      </Section>

      {/* Clear all selected filters */}
      <button
        className="btn btn-outline btn-block"
        onClick={onClear}
      >
        Clear Filters
      </button>

    </div>
  );
}