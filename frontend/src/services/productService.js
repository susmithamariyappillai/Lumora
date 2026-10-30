import { api } from './api';
import { queryDemo, demoCategories, findDemo } from '../utils/catalogue';
import demoProducts from '../data/demoProducts';

// Every function returns { ..., demo: true } when the server is down and the built-in demo catalogue is used.
export async function getProducts(params) {
  try { return { ...(await api.get('/products', params)), demo: false }; }
  catch (e) { if (e.unavailable) return { ...queryDemo(params), demo: true }; throw e; }
}

export async function getCategories() {
  try { return { categories: (await api.get('/products/categories')).categories, demo: false }; }
  catch (e) { if (e.unavailable) return { categories: demoCategories(), demo: true }; throw e; }
}

export async function getProduct(slug) {
  try { return { product: (await api.get(`/products/${slug}`)).product, demo: false }; }
  catch (e) {
    if (e.unavailable) { const p = findDemo(slug); if (!p) { const nf = new Error('Product not found.'); nf.status = 404; throw nf; } return { product: p, demo: true }; }
    throw e;
  }
}

export async function getProductsBySlugs(slugs) {
  if (!slugs.length) return [];
  return (await getProducts({ slugs: slugs.join(','), limit: 48 })).products;
}

export const allDemoCount = demoProducts.length;
