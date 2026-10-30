import { useSearchParams } from 'react-router-dom';
import CatalogView from '../components/CatalogView';

export default function SearchResults() {
  const [sp] = useSearchParams();
  const q = sp.get('q') || '';
  return (
    <CatalogView
      key={q} title="Search results" crumbs={[{ label: 'Home', to: '/' }, { label: 'Search' }]}
      emptyText="Check the spelling or try a more general word like “dress” or “bag”."
    />
  );
}
