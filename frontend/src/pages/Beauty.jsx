import CatalogView from '../components/CatalogView';

export default function Beauty() {
  return (
    <CatalogView
      title="Beauty" base={{ category: 'beauty' }}
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Beauty' }]}
      hero={{ eyebrow: 'BEAUTY', title: 'Simple Care,', italicLine: 'Every Day', text: 'Skincare, makeup and hair-care basics for your daily routine.', cta: { label: 'Shop All Beauty', to: '/beauty#products' }, image: '/images/beauty-hero.jpg', imageAlt: 'Skincare bottles' }}
    />
  );
}
