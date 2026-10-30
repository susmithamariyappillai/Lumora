export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null; // no pagination when everything fits on one page
  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} className={n === page ? 'active' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)}>{n}</button>
      ))}
      <button disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page">›</button>
    </nav>
  );
}
