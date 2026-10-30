import CatalogView from '../components/CatalogView';

export default function Men() {
  return (
    <CatalogView
      title="Men's Fashion" base={{ category: 'men' }}
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Men' }]}
      hero={{ eyebrow: "MEN'S FASHION", title: 'Dressed for', italicLine: 'the Day Ahead', text: 'Everyday essentials, smart shirts and layers that work hard.', cta: { label: 'Shop All Men', to: '/men#products' }, image: '/images/men-hero.jpg', imageAlt: 'Man in casual outfit' }}
    />
  );
}
