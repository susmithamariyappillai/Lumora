import CatalogView from '../components/CatalogView';

// Display New Arrivals page
export default function NewArrivals() {
  return (
    <CatalogView
      // Set page title
      title="New Arrivals"

      // Filter only newly added products
      base={{ newArrival: 'true' }}

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'New Arrivals' }
      ]}
    />
  );
}
