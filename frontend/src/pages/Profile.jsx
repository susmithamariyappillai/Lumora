import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {

  // Get user details and authentication functions
  const { user, logout, updateName } = useAuth();

  // Get popup message function
  const { push } = useToast();

  // Navigate between pages
  const navigate = useNavigate();

  // Store user's current name
  const [name, setName] = useState(user.name);

  // Update profile name
  const save = async (e) => {
    e.preventDefault();

    try {
      // Send updated name to backend
      await updateName(name);

      // Show success message
      push('Profile updated.');

    } catch (err) {
      // Show error message
      push(err.message, 'error');
    }
  };

  return (
    <div className="container auth">

      <h1>My Account</h1>

      {/* Profile update form */}
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

          {/* Email is displayed but cannot be edited */}
          <input value={user.email} disabled />
        </label>

        <button className="btn btn-primary btn-block">
          Save changes
        </button>

      </form>

      {/* Account navigation links */}
      <div className="link-list">
        <Link to="/orders">My orders</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/returns">Returns</Link>
      </div>

      {/* Logout button */}
      <button
        className="btn btn-outline btn-block"
        onClick={async () => {

          // Logout the current user
          await logout();

          // Display logout message
          push('Logged out.', 'info');

          // Navigate to homepage
          navigate('/');
        }}
      >
        Log out
      </button>

    </div>
  );
}