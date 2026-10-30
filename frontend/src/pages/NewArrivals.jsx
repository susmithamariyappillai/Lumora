import CatalogView from '../components/CatalogView';

export default function NewArrivals() {
  return <CatalogView title="New Arrivals" base={{ newArrival: 'true' }} crumbs={[{ label: 'Home', to: '/' }, { label: 'New Arrivals' }]} />;
}
