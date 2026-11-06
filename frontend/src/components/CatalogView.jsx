
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

// Convert comma-separated values into an array
const csv = (value) => String(value || '').split(',').filter(Boolean);

export default function CatalogView({
  title,
  crumbs,
  hero,
  base = {},
  promo,
  showFilters = true,
  emptyText
}) {
  // URL parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Component states
  const [productsData, setProductsData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const baseKey = JSON.stringify(base);

  // Get filters from URL
  const filters = {
    sub: csv(searchParams.get('sub')),
    cat: csv(searchParams.get('cat')),
    size: csv(searchParams.get('size')),
    colour: csv(searchParams.get('colour')),
    max: searchParams.get('max') || '',
    rating: searchParams.get('rating') || ''
  };

  const sort = searchParams.get('sort') || 'popularity';
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const view = searchParams.get('view') || 'grid';
  const search = searchParams.get('q') || '';

  // Update URL filters
  const updateFilters = (changes, keepPage = false) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      const newValue = Array.isArray(value) ? value.join(',') : value;

      if (newValue === '' || newValue == null) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, newValue);
      }
    });

    if (!keepPage) {
      updatedParams.delete('page');
    }

    setSearchParams(updatedParams, { replace: true });
  };

  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams();

    if (search) params.set('q', search);

    setSearchParams(params, { replace: true });
  };

  // Get categories from backend
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  // Prepare API parameters
  const apiParams = useMemo(() => ({
    ...base,
    category: base.category || filters.cat.join(','),
    sub: filters.sub.join(','),
    size: filters.size.join(','),
    colour: filters.colour.join(','),
    maxPrice: filters.max,
    rating: filters.rating,
    sort,
    page,
    limit: PAGE_SIZE,
    q: search || base.q
  }), [baseKey, searchParams.toString()]);

  // Load products from backend
  const loadProducts = () => {
    setLoading(true);
    setError('');

    getProducts(apiParams)
      .then((data) => {
        setProductsData(data);
        setIsDemo(data.demo);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setProductsData(null);
        setIsDemo(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [apiParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prepare category information for filters
  const selectedCategory = base.category
    ? categories.find((item) => item.slug === base.category)
    : null;

  const filterMeta = selectedCategory
    ? { ...selectedCategory, mode: 'sub', categories: [] }
    : {
        mode: 'cat',
        categories,
        subcategories: [],
        sizes: [...new Set(categories.flatMap((item) => item.sizes))],
        colours: [...new Set(categories.flatMap((item) => item.colours))]
      };

  const total = productsData?.total || 0;
  const from = total ? (productsData.page - 1) * productsData.limit + 1 : 0;
  const to = productsData ? Math.min(productsData.page * productsData.limit, total) : 0;

  // Filter sidebar
  const sidebar = (
    <FilterSidebar
      meta={filterMeta}
      mode={filterMeta.mode}
      filters={filters}
      onChange={(changes) => updateFilters(changes)}
      onClear={clearFilters}
    />
  );

  return (
    <>
      {hero && <HeroBanner {...hero} />}

      <div className="container">

        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((item, index) => (
            <span key={item.label}>
              {index < crumbs.length - 1 ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        {!hero && (
          <h1 className="page-title">
            {title} {search && `: ${search}`}
          </h1>
        )}

        {isDemo && <DemoNotice />}

        <div className={`catalog ${showFilters ? '' : 'no-filters'}`}>

          {showFilters && (
            <aside className="sidebar-desktop">
              {sidebar}
            </aside>
          )}

          <section id="products">

            <div className="toolbar">
              <p>
                {productsData
                  ? `Showing ${from}–${to} of ${total} products`
                  : ''}
              </p>

              <div className="toolbar-right">

                {showFilters && (
                  <button
                    className="btn btn-outline btn-sm filter-open"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <Icon name="filter" size={16} /> Filters
                  </button>
                )}

                <SortDropdown
                  value={sort}
                  onChange={(value) =>
                    updateFilters({ sort: value === 'popularity' ? '' : value })
                  }
                />

                <button
                  className="icon-btn"
                  onClick={() => updateFilters({ view: '' }, true)}
                  aria-label="Grid view"
                >
                  <Icon name="grid" />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => updateFilters({ view: 'list' }, true)}
                  aria-label="List view"
                >
                  <Icon name="list" />
                </button>

              </div>
            </div>

            {loading && <Loading text="Loading products..." />}

            {error && (
              <ErrorState
                message={error}
                onRetry={loadProducts}
              />
            )}

            {!loading && productsData && (
              <>
                <ProductGrid
                  products={productsData.products}
                  view={view}
                  emptyTitle={search ? `No results for ${search}` : 'No products found'}
                  emptyText={emptyText || 'Try different keywords or clear your filters.'}
                />

                <Pagination
                  page={productsData.page}
                  pages={productsData.pages}
                  onChange={(newPage) => {
                    updateFilters(
                      { page: newPage === 1 ? '' : newPage },
                      true
                    );
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            )}

            {promo && (
              <section className="promo">
                <SafeImage src={promo.image} alt={promo.alt} label={promo.alt} />

                <div>
                  <p className="eyebrow">Special Offer</p>
                  <h2>{promo.title}</h2>
                  <p>{promo.text}</p>
                </div>

                <Link to={promo.to} className="btn btn-primary">
                  Explore Now <Icon name="arrow" size={16} />
                </Link>
              </section>
            )}

          </section>
        </div>
      </div>

      {drawerOpen && (
        <div className="drawer-back" onClick={() => setDrawerOpen(false)}>
          <div
            className="drawer"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="icon-btn drawer-close"
              onClick={() => setDrawerOpen(false)}
            >
              <Icon name="close" />
            </button>

            {sidebar}

            <button
              className="btn btn-primary btn-block"
              onClick={() => setDrawerOpen(false)}
            >
              Show {total} products
            </button>
          </div>
        </div>
      )}
    </>
  );
}
