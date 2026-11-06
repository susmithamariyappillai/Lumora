import CatalogView from '../components/CatalogView';

// Display All Collections page
export default function Collections() {

  return (
    <CatalogView
      // Set page title
      title="All Collections"

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Collections' }
      ]}
    />
  );
}