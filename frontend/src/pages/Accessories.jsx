import CatalogView from '../components/CatalogView';

// Display Accessories page
export default function Accessories() {

  return (
    <CatalogView

      // Page title and product category
      title="Accessories"
      base={{ category: 'accessories' }}

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Accessories' }
      ]}

      // Accessories page banner details
      hero={{
        eyebrow: 'ACCESSORIES',
        title: 'The Finishing',
        italicLine: 'Touch',
        text: 'Jewellery, bags, watches and more to complete your look.',
        cta: {
          label: 'Shop All Accessories',
          to: '/accessories#products'
        },
        image: '/images/accessories-hero.jpg',
        imageAlt: 'Handbag and sunglasses'
      }}

    />
  );
}