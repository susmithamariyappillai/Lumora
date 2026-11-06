import CatalogView from '../components/CatalogView';

// Display Home & Living products
export default function HomeLiving() {
  return (
    <CatalogView
      // Set page title
      title="Home & Living"

      // Filter products by category
      base={{ category: 'home-living' }}

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Home & Living' }
      ]}

      // Hero banner details
      hero={{
        eyebrow: 'HOME & LIVING',
        title: 'Make Home',
        italicLine: 'Feel Like You',
        text: 'Cushions, bedding, lighting and decor for every room.',

        // Banner button
        cta: {
          label: 'Shop Home & Living',
          to: '/home-living#products'
        },

        // Banner image
        image: '/images/home-living-hero.jpg',
        imageAlt: 'Cushions and a plant'
      }}
    />
  );
}