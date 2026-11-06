// Import demo product data
import demoProducts from '../data/demoProducts';

// Import category details
import { CATEGORIES } from './constants';

// Convert comma-separated values into an array
const csv = (v) =>
  String(v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// Filter, search, sort and paginate demo products
export function queryDemo(p = {}) {

  // Get page number and product limit
  const page = Math.max(parseInt(p.page, 10) || 1, 1);
  const limit = parseInt(p.limit, 10) || 12;

  // Display only active products
  let list = demoProducts.filter((x) => x.isActive);

  // Filter products by category
  if (csv(p.category).length)
    list = list.filter((x) =>
      csv(p.category).includes(x.category)
    );

  // Filter products by subcategory
  if (csv(p.sub).length)
    list = list.filter((x) =>
      csv(p.sub).includes(x.subcategory)
    );

  // Filter products by size
  if (csv(p.size).length)
    list = list.filter((x) =>
      x.sizes.some((s) => csv(p.size).includes(s))
    );

  // Filter products by colour
  if (csv(p.colour).length)
    list = list.filter((x) =>
      x.colours.some((c) => csv(p.colour).includes(c))
    );

  // Filter products by product slugs
  if (csv(p.slugs).length)
    list = list.filter((x) =>
      csv(p.slugs).includes(x.slug)
    );

  // Filter products by minimum price
  if (p.minPrice)
    list = list.filter((x) => x.price >= Number(p.minPrice));

  // Filter products by maximum price
  if (p.maxPrice)
    list = list.filter((x) => x.price <= Number(p.maxPrice));

  // Filter products by minimum rating
  if (Number(p.rating) > 0)
    list = list.filter((x) =>
      x.rating >= Number(p.rating)
    );

  // Display only new arrival products
  if (p.newArrival === 'true')
    list = list.filter((x) => x.isNewArrival);

  // Display only best-selling products
  if (p.bestSeller === 'true')
    list = list.filter((x) => x.isBestSeller);

  // Display only products on sale
  if (p.onSale === 'true')
    list = list.filter((x) => x.originalPrice > x.price);

  // Get the search keyword
  const q = String(p.q || '').trim().toLowerCase();

  // Search products by name, description, category and subcategory
  if (q)
    list = list.filter((x) =>
      q.split(/\s+/).every((w) =>
        [x.name, x.description, x.subcategory, x.category]
          .join(' ')
          .toLowerCase()
          .includes(w)
      )
    );

  // Define product sorting methods
  const sorters = {
    // Best sellers first, then review count
    popularity: (a, b) =>
      Number(b.isBestSeller) - Number(a.isBestSeller) ||
      b.numReviews - a.numReviews,

    // Low price to high price
    'price-asc': (a, b) => a.price - b.price,

    // High price to low price
    'price-desc': (a, b) => b.price - a.price,

    // Newest products first
    newest: (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt),

    // Highest-rated products first
    rating: (a, b) =>
      b.rating - a.rating || b.numReviews - a.numReviews,
  };

  // Sort products; popularity is the default
  list = [...list].sort(sorters[p.sort] || sorters.popularity);

  // Get total number of filtered products
  const total = list.length;

  // Return products for the selected page
  return {
    products: list.slice((page - 1) * limit, page * limit),
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    limit
  };
}

// Generate category information from demo products
export function demoCategories() {
  return CATEGORIES.map(({ slug }) => {

    // Get products belonging to this category
    const items = demoProducts.filter((p) => p.category === slug);

    // Count products in each subcategory
    const subs = {};

    items.forEach((p) => {
      subs[p.subcategory] = (subs[p.subcategory] || 0) + 1;
    });

    // Return category details
    return {
      slug,
      count: items.length,

      // Convert subcategory counts into an array
      subcategories: Object.entries(subs).map(([name, count]) => ({
        name,
        count
      })),

      // Get unique colours
      colours: [...new Set(items.flatMap((p) => p.colours))],

      // Get unique sizes
      sizes: [...new Set(items.flatMap((p) => p.sizes))],
    };
  });
}

// Find one active demo product using its slug
export const findDemo = (slug) =>
  demoProducts.find((p) => p.slug === slug && p.isActive);