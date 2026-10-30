import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icons';

export default function SearchBar({ onDone }) {
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault(); // Enter key and the button both submit this form
    const q = text.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onDone?.();
  };
  return (
    <form className="search" role="search" onSubmit={submit}>
      <label htmlFor="site-search" className="sr-only">Search products</label>
      <input id="site-search" type="search" placeholder="Search for products..." value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit" aria-label="Search"><Icon name="search" size={18} /></button>
    </form>
  );
}
