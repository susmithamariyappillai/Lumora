import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loading, ErrorState, EmptyState } from '../components/States';
import { getMyOrders } from '../services/orderService';
import { formatDate, formatPrice } from '../utils/formatPrice';

export default function MyOrders() {
  const [state, setState] = useState({ loading: true, orders: [], error: '' });
  useEffect(() => { getMyOrders().then((orders) => setState({ loading: false, orders, error: '' })).catch((e) => setState({ loading: false, orders: [], error: e.message })); }, []);
  if (state.loading) return <Loading />;
  if (state.error) return <div className="container"><ErrorState message={state.error} /></div>;
  if (!state.orders.length) return <div className="container"><EmptyState title="No orders yet" text="When you place an order, it will appear here." action={{ to: '/collections', label: 'Start shopping' }} /></div>;
  return (
    <div className="container section">
      <h1 className="page-title">My Orders</h1>
      <ul className="order-list">
        {state.orders.map((o) => (
          <li key={o._id}>
            <div><strong>{o.orderNumber}</strong><small>{formatDate(o.createdAt)} · {o.orderItems.length} item(s)</small></div>
            <span className={`status status-${o.orderStatus.replace(/\s/g, '').toLowerCase()}`}>{o.orderStatus}</span>
            <strong>{formatPrice(o.totalPrice)}</strong>
            <Link className="btn btn-outline btn-sm" to={`/orders/${o._id}`}>View details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
