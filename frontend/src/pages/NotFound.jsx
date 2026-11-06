import { EmptyState } from '../components/States';

// Display page not found screen
export default function NotFound() {
  return (
    <div className="container">

      {/* Show error message and home button */}
      <EmptyState
        title="Page not found"
        text="The page you are looking for does not exist."
        action={{
          to: '/',
          label: 'Go to home'
        }}
      />

    </div>
  );
}