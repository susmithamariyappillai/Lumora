import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Loading } from '../components/States';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

import {
  getMyOrders,
  requestReturn
} from '../services/orderService';

import { formatDate } from '../utils/formatPrice';

export default function Returns() {

  // Get logged-in user details
  const { user } = useAuth();

  // Get popup message function
  const { push } = useToast();

  // Store user's orders
  const [orders, setOrders] = useState(null);

  // Store return reasons for each order
  const [reasons, setReasons] = useState({});

  // Fetch logged-in user's orders
  const load = () =>
    getMyOrders()
      .then(setOrders)
      .catch((e) => {
        push(e.message, 'error');
        setOrders([]);
      });

  // Load orders when user is available
  useEffect(() => {
    if (user) {
      load();
    } else {
      setOrders([]);
    }
  }, [user]); // eslint-disable-line

  // Submit return request
  const submit = async (id) => {
    try {
      // Send order ID and return reason to backend
      await requestReturn(id, reasons[id] || '');

      // Display success message
      push('Return requested.');

      // Refresh order list
      load();

    } catch (e) {
      // Display error message
      push(e.message, 'error');
    }
  };

  // Show only delivered orders
  const eligible = (orders || []).filter(
    (o) => o.orderStatus === 'Delivered'
  );

  return (
    <div className="container section prose">

      <h1 className="page-title">Returns &amp; Refunds</h1>

      <p>
        You can request a return within 30 days of delivery.
        Only delivered orders are eligible. After you submit
        a request, our team reviews it and updates your order status.
      </p>

      {/* Show login link if user is not logged in */}
      {!user && (
        <p>
          <Link to="/login" state={{ from: '/returns' }}>
            Log in
          </Link>{' '}
          to request a return.
        </p>
      )}

      {/* Show loading while fetching orders */}
      {user && orders === null && <Loading />}

      {/* Show message if no eligible orders are available */}
      {user && orders && !eligible.length && (
        <p className="muted">
          You have no delivered orders eligible for return right now.
        </p>
      )}

      {/* Display delivered orders */}
      {eligible.map((o) => (
        <div className="form-card" key={o._id}>

          <h2>{o.orderNumber}</h2>

          <small>
            Delivered {formatDate(o.deliveredAt || o.updatedAt)}
          </small>

          {/* Return reason input */}
          <label>
            Reason for return

            <textarea
              rows="3"
              value={reasons[o._id] || ''}
              onChange={(e) =>
                setReasons({
                  ...reasons,
                  [o._id]: e.target.value
                })
              }
            />
          </label>

          {/* Submit return request */}
          <button
            className="btn btn-primary"
            onClick={() => submit(o._id)}
          >
            Request return
          </button>

        </div>
      ))}

    </div>
  );
}