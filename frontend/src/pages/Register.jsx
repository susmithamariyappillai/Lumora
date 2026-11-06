import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {

  // Get register function from AuthContext
  const { register } = useAuth();

  // Get popup message function
  const { push } = useToast();

  // Navigate between pages
  const navigate = useNavigate();

  // Store registration form details
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Store validation error message
  const [error, setError] = useState('');

  // Track registration loading status
  const [busy, setBusy] = useState(false);

  // Update individual form fields
  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.value
    });

  // Handle registration form submission
  const submit = async (e) => {
    e.preventDefault();

    // Clear previous error
    setError('');

    // Validate full name
    if (form.name.trim().length < 2) {
      return setError('Please enter your full name.');
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError('Please enter a valid email address.');
    }

    // Check password length
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }

    // Check password confirmation
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    // Start registration loading
    setBusy(true);

    try {
      // Send registration details
      await register(form);

      // Show success message
      push('Account created. Welcome to Lumora!');

      // Navigate to homepage
      navigate('/');

    } catch (err) {
      // Display registration error
      setError(err.message);

    } finally {
      // Stop loading whether success or error
      setBusy(false);
    }
  };

  return (
    <div className="container auth">

      <h1>Create account</h1>

      {/* Registration form */}
      <form onSubmit={submit} noValidate>

        <label>
          Full name

          <input
            autoComplete="name"
            value={form.name}
            onChange={set('name')}
          />
        </label>

        <label>
          Email

          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
          />
        </label>

        <label>
          Password (8+ characters)

          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
          />
        </label>

        <label>
          Confirm password

          <input
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
          />
        </label>

        {/* Display validation errors */}
        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}

        {/* Disable button while registering */}
        <button
          className="btn btn-primary btn-block"
          disabled={busy}
        >
          {busy ? 'Creating…' : 'Create account'}
        </button>

      </form>

      {/* Link to login page */}
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>

    </div>
  );
}