import CatalogView from '../components/CatalogView';

// Display Beauty page
export default function Beauty() {

  return (
    <CatalogView

      // Page title and product category
      title="Beauty"
      base={{ category: 'beauty' }}

      // Breadcrumb navigation
      crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Beauty' }
      ]}

      // Beauty page banner details
      hero={{
        eyebrow: 'BEAUTY',
        title: 'Simple Care,',
        italicLine: 'Every Day',
        text: 'Skincare, makeup and hair-care basics for your daily routine.',
        cta: {
          label: 'Shop All Beauty',
          to: '/beauty#products'
        },
        image: '/images/beauty-hero.jpg',
        imageAlt: 'Skincare bottles'
      }}

    />
  );
}