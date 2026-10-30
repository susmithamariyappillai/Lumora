import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading, ErrorState } from '../components/States';
import { getOrder, cancelOrder } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { formatDate, formatPrice } from '../utils/formatPrice';

const CANCELLABLE = ['Pending', 'Confirmed', 'Processing'];

// Order details + status history. These are the status changes recorded by Lumora, NOT live courier tracking.
export default function OrderTracking() {
  const { id } = useParams();
  const { push } = useToast();
  const [state, setState] = useState({ loading: true, order: null, error: '' });
  useEffect(() => { getOrder(id).then((order) => setState({ loading: false, order, error: '' })).catch((e) => setState({ loading: false, order: null, error: e.message })); }, [id]);
  if (state.loading) return <Loading />;
  if (state.error) return <div className="container"><ErrorState message={state.error} /></div>;
  const o = state.order;

  const cancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try { const updated = await cancelOrder(o._id); setState({ ...state, order: updated }); push('Order cancelled.'); }
    catch (e) { push(e.message, 'error'); }
  };

  return (
    <div className="container section">
      <h1 className="page-title">Order {o.orderNumber}</h1>
      <div className="cart-grid">
        <div className="form-card">
          <h2>Status: {o.orderStatus}</h2>
          <ol className="timeline">
            {o.statusHistory.map((h, i) => <li key={i}><strong>{h.status}</strong><small>{formatDate(h.at)}{h.note ? ` — ${h.note}` : ''}</small></li>)}
          </ol>
          <p className="muted">These are status updates recorded by Lumora. No courier tracking is connected.</p>
          <h2>Items</h2>
          <ul className="mini-list">{o.orderItems.map((i, k) => <li key={k}><span>{i.name} × {i.qty}<small>{[i.size, i.colour].filter(Boolean).join(' · ')}</small></span><span>{formatPrice(i.price * i.qty)}</span></li>)}</ul>
        </div>
        <aside className="summary">
          <p><span>Subtotal</span><span>{formatPrice(o.subtotal)}</span></p>
          <p><span>Shipping</span><span>{o.shippingCost ? formatPrice(o.shippingCost) : 'Free'}</span></p>
          <p className="total"><span>Total</span><span>{formatPrice(o.totalPrice)}</span></p>
          <p><span>Payment</span><span>{o.paymentMethod} · {o.paymentStatus}</span></p>
          <p><span>Placed</span><span>{formatDate(o.createdAt)}</span></p>
          <address>{o.shippingAddress.fullName}<br />{o.shippingAddress.address}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.postalCode}<br />{o.shippingAddress.phone}</address>
          {CANCELLABLE.includes(o.orderStatus) && <button className="btn btn-outline btn-block" onClick={cancel}>Cancel order</button>}
          {o.orderStatus === 'Delivered' && <Link className="btn btn-outline btn-block" to="/returns">Request a return</Link>}
        </aside>
      </div>
    </div>
  );
}
