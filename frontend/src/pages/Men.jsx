import CatalogView from '../components/CatalogView';

// Display Men's Fashion page
export default function Men() {
  return (
    <CatalogView
      // Set page title
      title="Men's Fashion"

      // Filter products by men category
      base={{ category: 'men' }}

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Men' }
      ]}

      // Hero banner details
      hero={{
        eyebrow: "MEN'S FASHION",
        title: 'Dressed for',
        italicLine: 'the Day Ahead',
        text: 'Everyday essentials, smart shirts and layers that work hard.',

        // Banner button
        cta: {
          label: 'Shop All Men',
          to: '/men#products'
        },

        // Banner image
        image: '/images/men-hero.jpg',
        imageAlt: 'Man in casual outfit'
      }}
    />
  );
}