import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from './Icons';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import HeroBanner from './HeroBanner';
import SafeImage from './SafeImage';
import { Loading, ErrorState, DemoNotice } from './States';
import { getProducts, getCategories } from '../services/productService';
import { PAGE_SIZE } from '../utils/constants';

const csv = (v) => String(v || '').split(',').filter(Boolean);

// ONE reusable listing page used by Women, Men, Beauty, Accessories, Home & Living,
// Collections, New Arrivals, Deals and Search. Filters live in the URL, so links can be shared.
export default function CatalogView({ title, crumbs, hero, base = {}, promo, showFilters = true, emptyText }) {
  const [sp, setSp] = useSearchParams();
  const [state, setState] = useState({ loading: true, error: '', data: null, demo: false });
  const [cats, setCats] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const baseKey = JSON.stringify(base);

  const filters = { sub: csv(sp.get('sub')), cat: csv(sp.get('cat')), size: csv(sp.get('size')), colour: csv(sp.get('colour')), max: sp.get('max') || '', rating: sp.get('rating') || '' };
  const sort = sp.get('sort') || 'popularity';
  const page = Math.max(parseInt(sp.get('page'), 10) || 1, 1);
  const view = sp.get('view') || 'grid';
  const q = sp.get('q') || '';

  // update URL params; changing any filter resets to page 1
  const patch = (changes, keepPage = false) => {
    const next = new URLSearchParams(sp);
    Object.entries(changes).forEach(([k, v]) => {
      const val = Array.isArray(v) ? v.join(',') : v;
      if (val === '' || val === undefined || val === null) next.delete(k); else next.set(k, val);
    });
    if (!keepPage) next.delete('page');
    setSp(next, { replace: true });
  };
  const clear = () => { const next = new URLSearchParams(); if (q) next.set('q', q); setSp(next, { replace: true }); };

  useEffect(() => { getCategories().then((r) => setCats(r.categories)).catch(() => {}); }, []);

  const apiParams = useMemo(() => ({
    ...base,
    category: base.category || filters.cat.join(','),
    sub: filters.sub.join(','), size: filters.size.join(','), colour: filters.colour.join(','),
    maxPrice: filters.max, rating: filters.rating, sort, page, limit: PAGE_SIZE, q: q || base.q,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [baseKey, sp.toString()]);

  const load = () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    getProducts(apiParams)
      .then((data) => setState({ loading: false, error: '', data, demo: data.demo }))
      .catch((e) => setState({ loading: false, error: e.message, data: null, demo: false }));
  };
  useEffect(load, [apiParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // sidebar options: one category -> its subcategories; otherwise the list of categories
  const single = base.category && cats.find((c) => c.slug === base.category);
  const meta = single
    ? { ...single, mode: 'sub', categories: [] }
    : { mode: 'cat', categories: cats, subcategories: [], sizes: [...new Set(cats.flatMap((c) => c.sizes))], colours: [...new Set(cats.flatMap((c) => c.colours))] };

  const d = state.data;
  const from = d && d.total ? (d.page - 1) * d.limit + 1 : 0;
  const to = d ? Math.min(d.page * d.limit, d.total) : 0;
  const sidebar = <FilterSidebar meta={meta} mode={meta.mode} filters={filters} onChange={(c) => patch(c)} onClear={clear} />;

  return (
    <>
      {hero && <HeroBanner {...hero} />}
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (i < crumbs.length - 1 ? <span key={c.label}><Link to={c.to}>{c.label}</Link> › </span> : <span key={c.label} aria-current="page">{c.label}</span>))}
        </nav>
        {!hero && <h1 className="page-title">{title}{q && <>: “{q}”</>}</h1>}
        {state.demo && <DemoNotice />}

        <div className={`catalog ${showFilters ? '' : 'no-filters'}`}>
          {showFilters && <aside className="sidebar-desktop" aria-label="Filters">{sidebar}</aside>}
          <section id="products" aria-live="polite">
            <div className="toolbar">
              <p>{d ? (d.total ? `Showing ${from}–${to} of ${d.total} products` : '0 products found') : ' '}</p>
              <div className="toolbar-right">
                {showFilters && <button className="btn btn-outline btn-sm filter-open" onClick={() => setDrawer(true)}><Icon name="filter" size={16} /> Filters</button>}
                <SortDropdown value={sort} onChange={(v) => patch({ sort: v === 'popularity' ? '' : v })} />
                <button className={`icon-btn ${view === 'grid' ? 'active' : ''}`} aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => patch({ view: '' }, true)}><Icon name="grid" /></button>
                <button className={`icon-btn ${view === 'list' ? 'active' : ''}`} aria-label="List view" aria-pressed={view === 'list'} onClick={() => patch({ view: 'list' }, true)}><Icon name="list" /></button>
              </div>
            </div>
            {state.loading && <Loading text="Loading products…" />}
            {state.error && <ErrorState message={state.error} onRetry={load} />}
            {!state.loading && d && (
              <>
                <ProductGrid products={d.products} view={view} emptyTitle={q ? `No results for “${q}”` : 'No products found'} emptyText={emptyText || 'Try different keywords, or clear your filters.'} />
                <Pagination page={d.page} pages={d.pages} onChange={(n) => { patch({ page: n === 1 ? '' : n }, true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              </>
            )}
            {promo && (
              <section className="promo">
                <SafeImage src={promo.image} alt={promo.alt} label={promo.alt} />
                <div><p className="eyebrow">Special Offer</p><h2>{promo.title}</h2><p>{promo.text}</p></div>
                <Link to={promo.to} className="btn btn-primary">Explore Now <Icon name="arrow" size={16} /></Link>
              </section>
            )}
          </section>
        </div>
      </div>

      {drawer && (
        <div className="drawer-back" onClick={() => setDrawer(false)}>
          <div className="drawer" role="dialog" aria-modal="true" aria-label="Filters" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn drawer-close" aria-label="Close filters" onClick={() => setDrawer(false)}><Icon name="close" /></button>
            {sidebar}
            <button className="btn btn-primary btn-block" onClick={() => setDrawer(false)}>Show {d?.total ?? ''} products</button>
          </div>
        </div>
      )}
    </>
  );
}
