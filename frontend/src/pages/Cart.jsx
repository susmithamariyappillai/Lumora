import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import SafeImage from '../components/SafeImage';
import { EmptyState } from '../components/States';

import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import { formatPrice } from '../utils/formatPrice';
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE
} from '../utils/constants';

// Display shopping cart page
export default function Cart() {

  // Get cart details and functions
  const {
    items,
    subtotal,
    updateQty,
    removeItem,
    refresh
  } = useCart();

  // Get popup message function
  const { push } = useToast();

  // Navigate to another page
  const navigate = useNavigate();

  // Check product price and stock when opening cart
  useEffect(() => {
    refresh()
      .then((notes) => {
        notes.forEach((n) => push(n, 'info'));
      })
      .catch(() => {});
  }, []); // eslint-disable-line

  // Display message if cart is empty
  if (!items.length) {
    return (
      <div className="container">
        <EmptyState
          title="Your cart is empty"
          text="Add something you love and it will show up here."
          action={{
            to: '/collections',
            label: 'Continue shopping'
          }}
        />
      </div>
    );
  }

  // Calculate shipping charge
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return (
    <div className="container section">

      <h1 className="page-title">Your Cart</h1>

      <div className="cart-grid">

        {/* Display cart products */}
        <ul className="cart-list">
          {items.map((i) => (
            <li key={i.key}>

              {/* Product image */}
              <Link
                to={`/product/${i.slug}`}
                className="cart-img"
              >
                <SafeImage
                  src={i.image}
                  alt={i.name}
                  label={i.name}
                />
              </Link>

              {/* Product details */}
              <div className="cart-info">

                <Link to={`/product/${i.slug}`}>
                  <strong>{i.name}</strong>
                </Link>

                <small>
                  {[
                    i.size && `Size: ${i.size}`,
                    i.colour && `Colour: ${i.colour}`
                  ].filter(Boolean).join(' · ')}
                </small>

                <span>{formatPrice(i.price)} each</span>

                {/* Update product quantity */}
                <div
                  className="qty"
                  role="group"
                  aria-label={`Quantity for ${i.name}`}
                >
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(i.key, i.qty - 1)}
                  >
                    −
                  </button>

                  <span>{i.qty}</span>

                  <button
                    aria-label="Increase quantity"
                    onClick={() => updateQty(i.key, i.qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Product total and remove button */}
              <div className="cart-right">
                <strong>
                  {formatPrice(i.price * i.qty)}
                </strong>

                <button
                  className="link-btn"
                  onClick={() => removeItem(i.key)}
                >
                  Remove
                </button>
              </div>

            </li>
          ))}
        </ul>

        {/* Display order summary */}
        <aside className="summary">

          <h2>Order summary</h2>

          <p>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </p>

          <p>
            <span>Shipping</span>
            <span>
              {shipping ? formatPrice(shipping) : 'Free'}
            </span>
          </p>

          <p className="total">
            <span>Total</span>
            <span>{formatPrice(subtotal + shipping)}</span>
          </p>

          <small>
            Final prices are confirmed by the server at checkout.
          </small>

          {/* Navigate to checkout page */}
          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

          <Link
            to="/collections"
            className="btn btn-outline btn-block"
          >
            Continue shopping
          </Link>

        </aside>
      </div>
    </div>
  );
}