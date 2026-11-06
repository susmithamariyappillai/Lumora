import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Loading, ErrorState } from '../components/States';
import { getOrder } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';

export default function OrderSuccess() {

  // Get order ID from the URL
  const { id } = useParams();

  // Store loading status, order details and error
  const [state, setState] = useState({
    loading: true,
    order: null,
    error: ''
  });

  // Fetch order details when the page loads or ID changes
  useEffect(() => {
    getOrder(id)
      .then((order) => {
        // Store order details after successful API response
        setState({
          loading: false,
          order,
          error: ''
        });
      })
      .catch((e) => {
        // Store error if API request fails
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

  // Store fetched order details in a variable
  const o = state.order;

  return (
    <div className="container auth">

      {/* Order confirmation message */}
      <h1>Thank you, your order is placed</h1>

      {/* Display order number */}
      <p>
        Order number: <strong>{o.orderNumber}</strong>
      </p>

      {/* Display total amount and payment details */}
      <p>
        Total: <strong>{formatPrice(o.totalPrice)}</strong>
        {' · '}
        {o.paymentMethod === 'COD'
          ? 'Pay in cash on delivery'
          : `Payment: ${o.paymentStatus}`}
      </p>

      {/* Demo store information */}
      <p className="muted">
        This is a demo store. No real goods will be shipped.
      </p>

      {/* Navigation buttons */}
      <div className="pdp-actions">

        <Link
          className="btn btn-primary"
          to={`/orders/${o._id}`}
        >
          Track order
        </Link>

        <Link className="btn btn-outline" to="/">
          Continue shopping
        </Link>

      </div>
    </div>
  );
}