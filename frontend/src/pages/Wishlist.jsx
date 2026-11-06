import { Link } from 'react-router-dom';

import SafeImage from '../components/SafeImage';
import { EmptyState } from '../components/States';

import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import { formatPrice } from '../utils/formatPrice';

export default function Wishlist() {

  // Get wishlist products and remove function
  const { items, remove } = useWishlist();

  // Get add-to-cart function
  const { addItem } = useCart();

  // Get popup message function
  const { push } = useToast();

  // Display message if wishlist is empty
  if (!items.length) {
    return (
      <div className="container">
        <EmptyState
          title="Your wishlist is empty"
          text="Tap the heart on any product to save it here."
          action={{
            to: '/collections',
            label: 'Browse products'
          }}
        />
      </div>
    );
  }

  // Move wishlist product to cart
  const move = (p) => {

    // Ask user to select size first if product has sizes
    if (p.sizes?.length) {
      return push(
        'Choose a size on the product page first.',
        'info'
      );
    }

    // Add product to cart with quantity 1
    const r = addItem(p, {
      colour: p.colours?.[0] || '',
      qty: 1
    });

    // Display success or error message
    push(
      r.ok ? 'Moved to cart.' : r.message,
      r.ok ? 'success' : 'error'
    );

    // Remove from wishlist if successfully added to cart
    if (r.ok) {
      remove(p.slug);
    }
  };

  return (
    <div className="container section">

      {/* Wishlist heading and product count */}
      <h1 className="page-title">
        Your Wishlist ({items.length})
      </h1>

      {/* Display wishlist products */}
      <div className="grid">

        {items.map((p) => (
          <article className="card" key={p.slug}>

            {/* Product image */}
            <div className="card-media">
              <Link to={`/product/${p.slug}`}>
                <SafeImage
                  src={p.images?.[0]}
                  alt={p.name}
                  label={p.name}
                />
              </Link>
            </div>

            <div className="card-body">

              {/* Product name */}
              <h3>
                <Link to={`/product/${p.slug}`}>
                  {p.name}
                </Link>
              </h3>

              {/* Product price */}
              <p className="price">
                <strong>{formatPrice(p.price)}</strong>
              </p>

              {/* Move product to cart */}
              <button
                className="btn btn-primary btn-sm btn-block"
                onClick={() => move(p)}
              >
                {p.sizes?.length ? 'Choose size' : 'Move to Cart'}
              </button>

              {/* Remove product from wishlist */}
              <button
                className="link-btn"
                onClick={() => {
                  remove(p.slug);
                  push('Removed from wishlist.', 'info');
                }}
              >
                Remove
              </button>

            </div>
          </article>
        ))}

      </div>
    </div>
  );
}