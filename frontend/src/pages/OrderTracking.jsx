import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Loading, ErrorState } from '../components/States';
import { getOrder, cancelOrder } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { formatDate, formatPrice } from '../utils/formatPrice';

// Orders that can be cancelled
const CANCELLABLE = [
  'Pending',
  'Confirmed',
  'Processing'
];

// Display order details and status history
export default function OrderTracking() {

  // Get order ID from URL
  const { id } = useParams();

  // Get toast message function
  const { push } = useToast();

  // Store loading, order details and error
  const [state, setState] = useState({
    loading: true,
    order: null,
    error: ''
  });

  // Fetch order details when page loads or ID changes
  useEffect(() => {
    getOrder(id)
      .then((order) => {
        setState({
          loading: false,
          order,
          error: ''
        });
      })
      .catch((e) => {
        setState({
          loading: false,
          order: null,
          error: e.message
        });
      });
  }, [id]);

  // Display loading component
  if (state.loading) {
    return <Loading />;
  }

  // Display error component
  if (state.error) {
    return (
      <div className="container">
        <ErrorState message={state.error} />
      </div>
    );
  }

  // Store order details in a variable
  const o = state.order;

  // Handle order cancellation
  const cancel = async () => {

    // Ask user for confirmation
    if (!window.confirm('Cancel this order?')) return;

    try {
      // Call backend API to cancel the order
      const updated = await cancelOrder(o._id);

      // Update order details
      setState({
        ...state,
        order: updated
      });

      // Show success message
      push('Order cancelled.');

    } catch (e) {
      // Show cancellation error
      push(e.message, 'error');
    }
  };

  return (
    <div className="container section">

      {/* Display order number */}
      <h1 className="page-title">
        Order {o.orderNumber}
      </h1>

      <div className="cart-grid">

        <div className="form-card">

          {/* Current order status */}
          <h2>Status: {o.orderStatus}</h2>

          {/* Display order status history */}
          <ol className="timeline">
            {o.statusHistory.map((h, i) => (
              <li key={i}>
                <strong>{h.status}</strong>

                <small>
                  {formatDate(h.at)}
                  {h.note ? ` — ${h.note}` : ''}
                </small>
              </li>
            ))}
          </ol>

          <p className="muted">
            These are status updates recorded by Lumora.
            No courier tracking is connected.
          </p>

          {/* Display ordered products */}
          <h2>Items</h2>

          <ul className="mini-list">
            {o.orderItems.map((i, k) => (
              <li key={k}>
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

        </div>

        {/* Order price and shipping details */}
        <aside className="summary">

          <p>
            <span>Subtotal</span>
            <span>{formatPrice(o.subtotal)}</span>
          </p>

          <p>
            <span>Shipping</span>
            <span>
              {o.shippingCost
                ? formatPrice(o.shippingCost)
                : 'Free'}
            </span>
          </p>

          <p className="total">
            <span>Total</span>
            <span>{formatPrice(o.totalPrice)}</span>
          </p>

          <p>
            <span>Payment</span>
            <span>
              {o.paymentMethod} · {o.paymentStatus}
            </span>
          </p>

          <p>
            <span>Placed</span>
            <span>{formatDate(o.createdAt)}</span>
          </p>

          {/* Display delivery address */}
          <address>
            {o.shippingAddress.fullName}
            <br />
            {o.shippingAddress.address}, {o.shippingAddress.city},
            {o.shippingAddress.state} {o.shippingAddress.postalCode}
            <br />
            {o.shippingAddress.phone}
          </address>

          {/* Show cancel button for eligible orders */}
          {CANCELLABLE.includes(o.orderStatus) && (
            <button
              className="btn btn-outline btn-block"
              onClick={cancel}
            >
              Cancel order
            </button>
          )}

          {/* Show return option if order is delivered */}
          {o.orderStatus === 'Delivered' && (
            <Link
              className="btn btn-outline btn-block"
              to="/returns"
            >
              Request a return
            </Link>
          )}

        </aside>
      </div>
    </div>
  );
}