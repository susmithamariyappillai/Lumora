// The demo catalogue is a copy of backend/data/products.json (run "npm run sync-catalogue" in backend to refresh).
// It is used ONLY when the API server cannot be reached, so you can still browse the design.
import data from './products.json';

const demoProducts = data.map((p) => ({ ...p, _id: p.sku, discountPercent: p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0 }));
export default demoProducts;
