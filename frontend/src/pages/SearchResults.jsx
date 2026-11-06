import { useSearchParams } from 'react-router-dom';
import CatalogView from '../components/CatalogView';

export default function SearchResults() {

  // Get query parameters from the URL
  const [sp] = useSearchParams();

  // Get search keyword from URL
  const q = sp.get('q') || '';

  return (
    <CatalogView
      // Reset CatalogView when search keyword changes
      key={q}

      // Page title
      title="Search results"

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Search' }
      ]}

      // Message displayed when no products are found
      emptyText="Check the spelling or try a more general word like “dress” or “bag”."
    />
  );
}