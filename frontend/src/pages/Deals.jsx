import { useSearchParams } from 'react-router-dom';
import CatalogView from '../components/CatalogView';

// Display products that have discounts
export default function Deals() {

  // Get query parameters from the URL
  const [sp] = useSearchParams();

  // Get the category from the URL
  const category = sp.get('category') || '';

  return (
    <CatalogView
      // Reset CatalogView when category changes
      key={category}

      // Set page title
      title="Deals"

      // Show only discounted products
      // If category exists, filter by that category too
      base={{
        onSale: 'true',
        ...(category ? { category } : {})
      }}

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Deals' }
      ]}
    />
  );
}