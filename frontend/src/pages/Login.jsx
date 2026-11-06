import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {

  // Get login function from AuthContext
  const { login } = useAuth();

  // Get toast message function
  const { push } = useToast();

  // Used to navigate between pages
  const navigate = useNavigate();

  // Get the previous page path
  const from = useLocation().state?.from || '/';

  // Store email and password
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  // Store error message
  const [error, setError] = useState('');

  // Track login button loading status
  const [busy, setBusy] = useState(false);

  // Handle login form submission
  const submit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError('Please enter a valid email address.');
    }

    // Check password
    if (!form.password) {
      return setError('Please enter your password.');
    }

    setBusy(true);

    try {
      // Call login function
      await login(form.email, form.password);

      // Show success message
      push('Welcome back!');

      // Navigate to the previous page
      navigate(from, { replace: true });

    } catch (err) {
      // Display login error
      setError(err.message);

    } finally {
      // Stop loading status
      setBusy(false);
    }
  };

  return (
    <div className="container auth">
      <h1>Log in</h1>

      <form onSubmit={submit} noValidate>

        {/* Email input */}
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </label>

        {/* Password input */}
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </label>

        {/* Display error message */}
        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}

        {/* Login button */}
        <button
          className="btn btn-primary btn-block"
          disabled={busy}
        >
          {busy ? 'Logging in…' : 'Log in'}
        </button>

      </form>

      <p>
        New to Lumora? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}