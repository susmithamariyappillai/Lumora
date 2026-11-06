// Import API functions
import { api } from './api';

// Import demo catalogue helper functions
import { queryDemo, demoCategories, findDemo } from '../utils/catalogue';

// Import demo product data
import demoProducts from '../data/demoProducts';

// Get products from backend or demo catalogue
export async function getProducts(params) {
  try {
    // Fetch products from backend
    return {
      ...(await api.get('/products', params)),
      demo: false
    };
  } catch (e) {
    // If server is unavailable, use demo products
    if (e.unavailable) {
      return { ...queryDemo(params), demo: true };
    }

    // Throw other errors
    throw e;
  }
}

// Get all product categories
export async function getCategories() {
  try {
    // Fetch categories from backend
    return {
      categories: (await api.get('/products/categories')).categories,
      demo: false
    };
  } catch (e) {
    // Use demo categories if server is unavailable
    if (e.unavailable) {
      return { categories: demoCategories(), demo: true };
    }

    throw e;
  }
}

// Get a single product using its slug
export async function getProduct(slug) {
  try {
    // Fetch product details from backend
    return {
      product: (await api.get(`/products/${slug}`)).product,
      demo: false
    };
  } catch (e) {
    // Search for the product in demo data
    if (e.unavailable) {
      const p = findDemo(slug);

      // If product is not found, throw a 404 error
      if (!p) {
        const nf = new Error('Product not found.');
        nf.status = 404;
        throw nf;
      }

      return { product: p, demo: true };
    }

    throw e;
  }
}

// Get multiple products using their slugs
export async function getProductsBySlugs(slugs) {
  // Return empty array if no slugs are provided
  if (!slugs.length) return [];

  // Convert slugs into a comma-separated string
  return (
    await getProducts({
      slugs: slugs.join(','),
      limit: 48
    })
  ).products;
}

// Get the total number of built-in demo products
export const allDemoCount = demoProducts.length;