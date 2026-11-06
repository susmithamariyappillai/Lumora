import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icons';

export default function SearchBar({ onDone }) {

  // Store the search text
  const [text, setText] = useState('');

  // Navigate to another page
  const navigate = useNavigate();

  // Handle search form submission
  const submit = (e) => {
    e.preventDefault();

    // Remove extra spaces
    const q = text.trim();

    // Stop if search text is empty
    if (!q) return;

    // Navigate to search page with search text
    navigate(`/search?q=${encodeURIComponent(q)}`);

    // Call onDone if it is provided
    onDone?.();
  };

  return (
    <form
      className="search"
      role="search"
      onSubmit={submit}
    >
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>

      <input
        id="site-search"
        type="search"
        placeholder="Search for products..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit" aria-label="Search">
        <Icon name="search" size={18} />
      </button>
    </form>
  );
}