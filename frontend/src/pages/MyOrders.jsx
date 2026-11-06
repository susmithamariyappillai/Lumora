import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Loading, ErrorState, EmptyState } from '../components/States';
import { getMyOrders } from '../services/orderService';
import { formatDate, formatPrice } from '../utils/formatPrice';

export default function MyOrders() {

  // Store loading status, orders and error message
  const [state, setState] = useState({
    loading: true,
    orders: [],
    error: ''
  });

  // Fetch logged-in user's orders when page loads
  useEffect(() => {
    getMyOrders()
      .then((orders) => {
        // Store the fetched orders
        setState({
          loading: false,
          orders,
          error: ''
        });
      })
      .catch((e) => {
        // Store error if API request fails
        setState({
          loading: false,
          orders: [],
          error: e.message
        });
      });
  }, []);

  // Display loading component
  if (state.loading) {
    return <Loading />;
  }

  // Display error message
  if (state.error) {
    return (
      <div className="container">
        <ErrorState message={state.error} />
      </div>
    );
  }

  // Display message if there are no orders
  if (!state.orders.length) {
    return (
      <div className="container">
        <EmptyState
          title="No orders yet"
          text="When you place an order, it will appear here."
          action={{
            to: '/collections',
            label: 'Start shopping'
          }}
        />
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="page-title">My Orders</h1>

      {/* Display all orders */}
      <ul className="order-list">
        {state.orders.map((o) => (
          <li key={o._id}>

            {/* Order number, date and item count */}
            <div>
              <strong>{o.orderNumber}</strong>
              <small>
                {formatDate(o.createdAt)} · {o.orderItems.length} item(s)
              </small>
            </div>

            {/* Display order status */}
            <span
              className={`status status-${o.orderStatus.replace(/\s/g, '').toLowerCase()}`}
            >
              {o.orderStatus}
            </span>

            {/* Display total order price */}
            <strong>{formatPrice(o.totalPrice)}</strong>

            {/* Navigate to order details */}
            <Link
              className="btn btn-outline btn-sm"
              to={`/orders/${o._id}`}
            >
              View details
            </Link>

          </li>
        ))}
      </ul>
    </div>
  );
}