import { Link } from 'react-router-dom';

export const Loading = ({ text = 'Loading…' }) => <div className="state" role="status"><div className="spinner" aria-hidden="true" /><p>{text}</p></div>;

export const EmptyState = ({ title, text, action }) => (
  <div className="state">
    <h2>{title}</h2>
    {text && <p>{text}</p>}
    {action && <Link className="btn btn-primary" to={action.to}>{action.label}</Link>}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="state state-error" role="alert">
    <h2>Something went wrong</h2>
    <p>{message}</p>
    {onRetry && <button className="btn btn-outline" onClick={onRetry}>Try again</button>}
  </div>
);

// Shown when the API cannot be reached and the built-in catalogue is being used instead.
export const DemoNotice = () => (
  <div className="notice" role="note">
    <strong>Demo mode:</strong> the Lumora server is not reachable, so you are browsing the built-in demo catalogue. Nothing is saved to the database, and login and checkout will not work until the backend is running.
  </div>
);
