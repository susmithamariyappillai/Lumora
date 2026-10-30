
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { user, logout, updateName } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);

  const save = async (e) => {
    e.preventDefault();

    try {
      await updateName(name);
      push('Profile updated.');
    } catch (err) {
      push(err.message, 'error');
    }
  };

  return (
    <div className="container auth">
      <h1>My Account</h1>

      <form onSubmit={save}>
        <label>
          Full name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Email
          <input value={user.email} disabled />
        </label>

        <button className="btn btn-primary btn-block">
          Save changes
        </button>
      </form>

      <div className="link-list">
        <Link to="/orders">My orders</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/returns">Returns</Link>
      </div>

      <button
        className="btn btn-outline btn-block"
        onClick={async () => {
          await logout();
          push('Logged out.', 'info');
          navigate('/');
        }}
      >
        Log out
      </button>
    </div>
  );
}
