import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../components/States';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getMyOrders, requestReturn } from '../services/orderService';
import { formatDate } from '../utils/formatPrice';

export default function Returns() {
  const { user } = useAuth();
  const { push } = useToast();
  const [orders, setOrders] = useState(null);
  const [reasons, setReasons] = useState({});

  const load = () => getMyOrders().then(setOrders).catch((e) => { push(e.message, 'error'); setOrders([]); });
  useEffect(() => { if (user) load(); else setOrders([]); }, [user]); // eslint-disable-line

  const submit = async (id) => {
    try { await requestReturn(id, reasons[id] || ''); push('Return requested.'); load(); }
    catch (e) { push(e.message, 'error'); }
  };
  const eligible = (orders || []).filter((o) => o.orderStatus === 'Delivered');

  return (
    <div className="container section prose">
      <h1 className="page-title">Returns &amp; Refunds</h1>
      <p>You can request a return within 30 days of delivery. Only delivered orders are eligible. After you submit a request, our team reviews it and updates your order status.</p>
      {!user && <p><Link to="/login" state={{ from: '/returns' }}>Log in</Link> to request a return.</p>}
      {user && orders === null && <Loading />}
      {user && orders && !eligible.length && <p className="muted">You have no delivered orders eligible for return right now.</p>}
      {eligible.map((o) => (
        <div className="form-card" key={o._id}>
          <h2>{o.orderNumber}</h2><small>Delivered {formatDate(o.deliveredAt || o.updatedAt)}</small>
          <label>Reason for return<textarea rows="3" value={reasons[o._id] || ''} onChange={(e) => setReasons({ ...reasons, [o._id]: e.target.value })} /></label>
          <button className="btn btn-primary" onClick={() => submit(o._id)}>Request return</button>
        </div>
      ))}
    </div>
  );
}
