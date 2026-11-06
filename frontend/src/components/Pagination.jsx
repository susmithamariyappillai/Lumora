

export default function Pagination({ page, pages, onChange }) {

  // If only one page is available, hide pagination.
  if (pages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination">

      {/* Previous button */}
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {/* Display all page numbers */}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={n === page ? 'active' : ''}
          aria-current={n === page ? 'page' : undefined}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}

      {/* Next button */}
      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        ›
      </button>

    </nav>
  );
}
