import ProductCard from './ProductCard';
import { EmptyState } from './States';

//  Displays multiple products in grid or list view.
export default function ProductGrid({
  products,
  view = 'grid',
  emptyTitle = 'No products found',
  emptyText = 'Try changing or clearing your filters.'
}) {

  // If there are no products, display an empty message.
  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle}
        text={emptyText}
      />
    );
  }

  //  Display all products using ProductCard.
  return (
    <div className={`grid ${view === 'list' ? 'grid-list' : ''}`}>
      {products.map((p) => (
        <ProductCard
          key={p.slug}
          product={p}
        />
      ))}
    </div>
  );
}