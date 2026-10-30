import CatalogView from '../components/CatalogView';

export default function Collections() {
  return <CatalogView title="All Collections" crumbs={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} />;
}
