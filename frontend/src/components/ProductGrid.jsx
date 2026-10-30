import ProductCard from './ProductCard';
import { EmptyState } from './States';

export default function ProductGrid({ products, view = 'grid', emptyTitle = 'No products found', emptyText = 'Try changing or clearing your filters.' }) {
  if (!products.length) return <EmptyState title={emptyTitle} text={emptyText} />;
  return <div className={`grid ${view === 'list' ? 'grid-list' : ''}`}>{products.map((p) => <ProductCard key={p.slug} product={p} />)}</div>;
}
