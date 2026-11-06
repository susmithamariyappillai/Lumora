import { SORTS } from '../utils/constants';

export default function SortDropdown({ value, onChange }) {

  // Display sorting options
  return (
    <label className="sort">

      <span>Sort by:</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {/* Display each sorting option  option name*/}
        {SORTS.map((s) => (
          <option
            key={s.value}
            value={s.value}
          >
            {s.label}
          </option>
        ))}
      </select>

    </label>
  );
}