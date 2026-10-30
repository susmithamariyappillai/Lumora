import CatalogView from '../components/CatalogView';

export default function HomeLiving() {
  return (
    <CatalogView
      title="Home & Living" base={{ category: 'home-living' }}
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Home & Living' }]}
      hero={{ eyebrow: 'HOME & LIVING', title: 'Make Home', italicLine: 'Feel Like You', text: 'Cushions, bedding, lighting and decor for every room.', cta: { label: 'Shop Home & Living', to: '/home-living#products' }, image: '/images/home-living-hero.jpg', imageAlt: 'Cushions and a plant' }}
    />
  );
}
