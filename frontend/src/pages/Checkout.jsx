import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { EmptyState } from '../components/States';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

import { createOrder } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';

import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from '../utils/constants';

// Display checkout page
export default function Checkout() {

  // Get cart details and functions
  const { items, subtotal, clear, refresh } = useCart();

  // Get logged-in user details
  const { user } = useAuth();

  // Get popup message function
  const { push } = useToast();

  // Navigate to another page
  const navigate = useNavigate();

  // Store shipping form details
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Store validation errors
  const [errors, setErrors] = useState({});

  // Store server error message
  const [serverError, setServerError] = useState('');

  // Track order submission status
  const [busy, setBusy] = useState(false);

  // Create unique key to prevent duplicate orders
  const idemKey = useRef(crypto.randomUUID());

  // Refresh product price and stock when checkout opens
  useEffect(() => {
    refresh()
      .then((messages) => {
        messages.forEach((m) => push(m, 'info'));
      })
      .catch(() => {});
  }, []);

  // Show message if cart is empty
  if (!items.length) {
    return (
      <div className="container">
        <EmptyState
          title="Your cart is empty"
          action={{
            to: '/collections',
            label: 'Continue shopping',
          }}
        />
      </div>
    );
  }

  // Calculate shipping charge
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  // Update form fields
  const set = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  // Validate all form fields
  const validate = () => {
    const e = {};

    if (form.fullName.trim().length < 2) {
      e.fullName = 'Enter your full name.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email.';
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      e.phone = 'Enter a valid 10-digit mobile number.';
    }

    if (form.address.trim().length < 5) {
      e.address = 'Enter your full address.';
    }

    if (form.city.trim().length < 2) {
      e.city = 'Enter your city.';
    }

    if (form.state.trim().length < 2) {
      e.state = 'Enter your state.';
    }

    if (!/^\d{6}$/.test(form.postalCode)) {
      e.postalCode = 'Postal code must be 6 digits.';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  // Clear cart and navigate to order success page
  const finish = (order) => {
    clear();

    navigate(`/order-success/${order._id}`, {
      replace: true,
    });
  };

  // Handle order submission
  const submit = async (ev) => {
    ev.preventDefault();
    setServerError('');

    // Stop if form validation fails
    if (!validate()) {
      return push('Please fix the highlighted fields.', 'error');
    }

    setBusy(true);

    try {
      // Send order details to backend
      const res = await createOrder({
        items: items.map((i) => ({
          slug: i.slug,
          qty: i.qty,
          size: i.size,
          colour: i.colour,
        })),

        shippingAddress: form,
        paymentMethod: 'COD',
        idempotencyKey: idemKey.current,
      });

      // Complete order after successful response
      finish(res.order);

    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  // Reusable function to create form fields
  const field = (key, label, props = {}) => (
    <label className={errors[key] ? 'has-error' : ''}>
      {label}

      <input
        value={form[key]}
        onChange={set(key)}
        aria-invalid={Boolean(errors[key])}
        {...props}
      />

      {errors[key] && (
        <small className="err">{errors[key]}</small>
      )}
    </label>
  );

  return (
    <div className="container section">

      <h1 className="page-title">Checkout</h1>

      <form className="cart-grid" onSubmit={submit} noValidate>

        {/* Shipping details form */}
        <div className="form-card">
          <h2>Shipping Details</h2>

          <div className="form-grid">

            {field('fullName', 'Full name', {
              autoComplete: 'name',
            })}

            {field('email', 'Email', {
              type: 'email',
              autoComplete: 'email',
            })}

            {field('phone', 'Phone number', {
              inputMode: 'numeric',
              maxLength: 10,
              autoComplete: 'tel',
            })}

            {field('postalCode', 'Postal code', {
              inputMode: 'numeric',
              maxLength: 6,
              autoComplete: 'postal-code',
            })}

            <div className="span2">
              {field('address', 'Address', {
                autoComplete: 'street-address',
              })}
            </div>

            {field('city', 'City', {
              autoComplete: 'address-level2',
            })}

            {field('state', 'State', {
              autoComplete: 'address-level1',
            })}

          </div>

          {/* Payment method */}
          <h2>Payment Method</h2>

          <label className="radio">
            <input type="radio" name="pay" checked readOnly />
            Cash on Delivery
          </label>

          <small className="muted">
            Pay when your order is delivered to your address.
          </small>

          {/* Display server error */}
          {serverError && (
            <p className="err" role="alert">
              {serverError}
            </p>
          )}
        </div>

        {/* Order summary */}
        <aside className="summary">
          <h2>Your Order</h2>

          {/* Display selected products */}
          <ul className="mini-list">
            {items.map((i) => (
              <li key={i.key}>
                <span>
                  {i.name} × {i.qty}

                  <small>
                    {[i.size, i.colour].filter(Boolean).join(' · ')}
                  </small>
                </span>

                <span>
                  {formatPrice(i.price * i.qty)}
                </span>
              </li>
            ))}
          </ul>

          {/* Display price details */}
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

          {/* Submit order */}
          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Placing order…' : 'Place Order'}
          </button>

          <Link to="/cart" className="btn btn-outline btn-block">
            Back to Cart
          </Link>

        </aside>
      </form>
    </div>
  );
}