import CatalogView from '../components/CatalogView';

// Women page uses reusable CatalogView component
export default function Women() {
  return (
    <CatalogView

      // Page title
      title="Women's Fashion"

      // Filter products by women category
      base={{ category: 'women' }}

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Women' }
      ]}

      // Hero banner details
      hero={{
        eyebrow: "WOMEN'S FASHION",
        title: 'Every Look',
        italicLine: 'Tells a Story',

        text: 'From casual days to special moments, find your perfect style.',

        // Hero banner button
        cta: {
          label: 'Shop All Women',
          to: '/women#products'
        },

        // Hero banner image
        image: '/images/women-hero.jpg',
        imageAlt: 'Woman wearing a pink floral top',
      }}
    />
  );
}