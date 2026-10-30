import { SORTS } from '../utils/constants';

export default function SortDropdown({ value, onChange }) {
  return (
    <label className="sort">
      <span>Sort by:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    </label>
  );
}
