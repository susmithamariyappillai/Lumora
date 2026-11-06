// Import product data from JSON file
import data from './products.json';

// Prepare demo products
const demoProducts = data.map((p) => {

  // Calculate discount percentage
  const discountPercent =
    p.originalPrice > p.price
      ? Math.round(
          ((p.originalPrice - p.price) / p.originalPrice) * 100
        )
      : 0;

  // Return product with additional details
  return {
    ...p,
    _id: p.sku,
    discountPercent
  };
});

// Export demo products
export default demoProducts;