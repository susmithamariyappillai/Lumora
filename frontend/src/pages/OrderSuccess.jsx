import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading, ErrorState } from '../components/States';
import { getOrder } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';

export default function OrderSuccess() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, order: null, error: '' });
  useEffect(() => { getOrder(id).then((order) => setState({ loading: false, order, error: '' })).catch((e) => setState({ loading: false, order: null, error: e.message })); }, [id]);
  if (state.loading) return <Loading />;
  if (state.error) return <div className="container"><ErrorState message={state.error} /></div>;
  const o = state.order;
  return (
    <div className="container auth">
      <h1>Thank you, your order is placed</h1>
      <p>Order number: <strong>{o.orderNumber}</strong></p>
      <p>Total: <strong>{formatPrice(o.totalPrice)}</strong> · {o.paymentMethod === 'COD' ? 'Pay in cash on delivery' : `Payment: ${o.paymentStatus}`}</p>
      <p className="muted">This is a demo store. No real goods will be shipped.</p>
      <div className="pdp-actions"><Link className="btn btn-primary" to={`/orders/${o._id}`}>Track order</Link><Link className="btn btn-outline" to="/">Continue shopping</Link></div>
    </div>
  );
}
