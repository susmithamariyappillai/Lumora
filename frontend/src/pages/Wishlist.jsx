import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import { EmptyState } from '../components/States';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';

export default function Wishlist() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();
  const { push } = useToast();
  if (!items.length) return <div className="container"><EmptyState title="Your wishlist is empty" text="Tap the heart on any product to save it here." action={{ to: '/collections', label: 'Browse products' }} /></div>;

  const move = (p) => {
    if (p.sizes?.length) return push('Choose a size on the product page first.', 'info');
    const r = addItem(p, { colour: p.colours?.[0] || '', qty: 1 });
    push(r.ok ? 'Moved to cart.' : r.message, r.ok ? 'success' : 'error');
    if (r.ok) remove(p.slug);
  };

  return (
    <div className="container section">
      <h1 className="page-title">Your Wishlist ({items.length})</h1>
      <div className="grid">
        {items.map((p) => (
          <article className="card" key={p.slug}>
            <div className="card-media"><Link to={`/product/${p.slug}`}><SafeImage src={p.images?.[0]} alt={p.name} label={p.name} /></Link></div>
            <div className="card-body">
              <h3><Link to={`/product/${p.slug}`}>{p.name}</Link></h3>
              <p className="price"><strong>{formatPrice(p.price)}</strong></p>
              <button className="btn btn-primary btn-sm btn-block" onClick={() => move(p)}>{p.sizes?.length ? 'Choose size' : 'Move to Cart'}</button>
              <button className="link-btn" onClick={() => { remove(p.slug); push('Removed from wishlist.', 'info'); }}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
