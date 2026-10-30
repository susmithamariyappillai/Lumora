import { useSearchParams } from 'react-router-dom';
import CatalogView from '../components/CatalogView';

// Real discounted products only (originalPrice > price).
export default function Deals() {
  const [sp] = useSearchParams();
  const category = sp.get('category') || '';
  return <CatalogView key={category} title="Deals" base={{ onSale: 'true', ...(category ? { category } : {}) }} crumbs={[{ label: 'Home', to: '/' }, { label: 'Deals' }]} />;
}
