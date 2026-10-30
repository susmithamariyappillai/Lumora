// Client-side version of the server's filtering. Used ONLY in demo mode (when the API is unreachable).
import demoProducts from '../data/demoProducts';
import { CATEGORIES } from './constants';

const csv = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

export function queryDemo(p = {}) {
  const page = Math.max(parseInt(p.page, 10) || 1, 1);
  const limit = parseInt(p.limit, 10) || 12;
  let list = demoProducts.filter((x) => x.isActive);
  if (csv(p.category).length) list = list.filter((x) => csv(p.category).includes(x.category));
  if (csv(p.sub).length) list = list.filter((x) => csv(p.sub).includes(x.subcategory));
  if (csv(p.size).length) list = list.filter((x) => x.sizes.some((s) => csv(p.size).includes(s)));
  if (csv(p.colour).length) list = list.filter((x) => x.colours.some((c) => csv(p.colour).includes(c)));
  if (csv(p.slugs).length) list = list.filter((x) => csv(p.slugs).includes(x.slug));
  if (p.minPrice) list = list.filter((x) => x.price >= Number(p.minPrice));
  if (p.maxPrice) list = list.filter((x) => x.price <= Number(p.maxPrice));
  if (Number(p.rating) > 0) list = list.filter((x) => x.rating >= Number(p.rating));
  if (p.newArrival === 'true') list = list.filter((x) => x.isNewArrival);
  if (p.bestSeller === 'true') list = list.filter((x) => x.isBestSeller);
  if (p.onSale === 'true') list = list.filter((x) => x.originalPrice > x.price);
  const q = String(p.q || '').trim().toLowerCase();
  if (q) list = list.filter((x) => q.split(/\s+/).every((w) => [x.name, x.description, x.subcategory, x.category].join(' ').toLowerCase().includes(w)));

  const sorters = {
    popularity: (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.numReviews - a.numReviews,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    rating: (a, b) => b.rating - a.rating || b.numReviews - a.numReviews,
  };
  list = [...list].sort(sorters[p.sort] || sorters.popularity);
  const total = list.length;
  return { products: list.slice((page - 1) * limit, page * limit), total, page, pages: Math.max(Math.ceil(total / limit), 1), limit };
}

export function demoCategories() {
  return CATEGORIES.map(({ slug }) => {
    const items = demoProducts.filter((p) => p.category === slug);
    const subs = {};
    items.forEach((p) => { subs[p.subcategory] = (subs[p.subcategory] || 0) + 1; });
    return {
      slug, count: items.length,
      subcategories: Object.entries(subs).map(([name, count]) => ({ name, count })),
      colours: [...new Set(items.flatMap((p) => p.colours))],
      sizes: [...new Set(items.flatMap((p) => p.sizes))],
    };
  });
}

export const findDemo = (slug) => demoProducts.find((p) => p.slug === slug && p.isActive);
