import { EmptyState } from '../components/States';

export default function NotFound() {
  return <div className="container"><EmptyState title="Page not found" text="The page you are looking for does not exist." action={{ to: '/', label: 'Go to home' }} /></div>;
}
