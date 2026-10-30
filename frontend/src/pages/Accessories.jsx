import CatalogView from '../components/CatalogView';

export default function Accessories() {
  return (
    <CatalogView
      title="Accessories" base={{ category: 'accessories' }}
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Accessories' }]}
      hero={{ eyebrow: 'ACCESSORIES', title: 'The Finishing', italicLine: 'Touch', text: 'Jewellery, bags, watches and more to complete your look.', cta: { label: 'Shop All Accessories', to: '/accessories#products' }, image: '/images/accessories-hero.jpg', imageAlt: 'Handbag and sunglasses' }}
    />
  );
}
