import CatalogView from '../components/CatalogView';

// Main reference page: hero, breadcrumb, toolbar, filters, grid, pagination, offer banner.
export default function Women() {
  return (
    <CatalogView
      title="Women's Fashion"
      base={{ category: 'women' }}
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Women' }]}
      hero={{
        eyebrow: "WOMEN'S FASHION", title: 'Every Look', italicLine: 'Tells a Story',
        text: 'From casual days to special moments, find your perfect style.',
        cta: { label: 'Shop All Women', to: '/women#products' }, image: '/images/women-hero.jpg', imageAlt: 'Woman wearing a pink floral top',
      }}
      
    />
  );
}
