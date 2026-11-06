import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from './States';

export default function ProtectedRoute({ children }) {

  // Get user login details and loading status.
  const { user, loading } = useAuth();

  // Get the current page URL.
  const location = useLocation();

  // Show loading while checking login status.
  if (loading) {
    return <Loading text="Checking your session…" />;
  }

  // If user is not logged in, redirect to login page.
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // If user is logged in, show the requested page.
  return children;
}