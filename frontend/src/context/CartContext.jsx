import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import { getProductsBySlugs } from '../services/productService';

// Create cart context
const CartContext = createContext(null);

// Access cart details from other components
export const useCart = () => useContext(CartContext);

// Local storage key and maximum quantity
const KEY = 'lumora_cart';
const MAX_QTY = 10;

// Create a unique key for each product variant
const lineKey = (slug, size, colour) =>
  `${slug}|${size || ''}|${colour || ''}`;

// Load cart items from localStorage
function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

// Provide cart details to child components
export function CartProvider({ children }) {

  // Store cart items
  const [items, setItems] = useState(load);

  // Save cart items whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full/blocked */
    }
  }, [items]);

  // Add product to cart
  const addItem = useCallback((product, {
    size = '',
    colour = '',
    qty = 1
  }) => {

    // Check product stock
    if (product.stock <= 0) {
      return { ok: false, message: 'This product is out of stock.' };
    }

    // Check whether size is selected
    if (product.sizes?.length && !size) {
      return { ok: false, message: 'Please choose a size.' };
    }

    // Create unique product key
    const key = lineKey(product.slug, size, colour);

    // Calculate existing quantity of this product
    const inCartForProduct = items
      .filter((i) => i.slug === product.slug)
      .reduce((s, i) => s + i.qty, 0);

    // Check available stock
    if (inCartForProduct + qty > product.stock) {
      return {
        ok: false,
        message: `Only ${product.stock} in stock${inCartForProduct ? ` (you already have ${inCartForProduct} in your cart)` : ''}.`
      };
    }

    setItems((prev) => {
      // Check whether the same product variant already exists
      const existing = prev.find((i) => i.key === key);

      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) }
            : i
        );
      }

      // Add new product to cart
      return [
        ...prev,
        {
          key,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0] || '',
          price: product.price,
          size,
          colour,
          qty,
          stock: product.stock
        }
      ];
    });

    return {
      ok: true,
      message: `${product.name} added to cart.`
    };

  }, [items]);

  // Update product quantity
  const updateQty = (key, qty) =>
    setItems((prev) =>
      prev.map((i) => {

        if (i.key !== key) return i;

        // Calculate quantity of other variants of the same product
        const others = prev
          .filter((x) => x.slug === i.slug && x.key !== key)
          .reduce((s, x) => s + x.qty, 0);

        // Keep quantity within allowed limits
        return {
          ...i,
          qty: Math.max(1, Math.min(qty, MAX_QTY, i.stock - others))
        };
      })
    );

  // Remove one product from cart
  const removeItem = (key) =>
    setItems((prev) => prev.filter((i) => i.key !== key));

  // Remove all products from cart
  const clear = () => setItems([]);

  // Refresh product price and stock from server
  const refresh = useCallback(async () => {

    // Get unique product slugs
    const slugs = [...new Set(items.map((i) => i.slug))];

    if (!slugs.length) return [];

    // Get latest product details
    const fresh = await getProductsBySlugs(slugs);

    const bySlug = Object.fromEntries(
      fresh.map((p) => [p.slug, p])
    );

    const notes = [];
    const next = [];

    // Check every cart item
    items.forEach((i) => {
      const p = bySlug[i.slug];

      // Remove unavailable products
      if (!p || p.stock <= 0) {
        notes.push(`${i.name} is no longer available and was removed.`);
        return;
      }

      // Check price changes
      if (p.price !== i.price) {
        notes.push(`Price of ${i.name} changed.`);
      }

      // Adjust quantity based on available stock
      const qty = Math.min(i.qty, p.stock);

      if (qty < i.qty) {
        notes.push(`${i.name}: only ${p.stock} left, quantity reduced.`);
      }

      // Store updated product details
      next.push({
        ...i,
        price: p.price,
        stock: p.stock,
        qty,
        name: p.name,
        image: p.images?.[0] || i.image
      });
    });

    setItems(next);
    return notes;

  }, [items]);

  // Calculate total cart quantity
  const count = items.reduce((s, i) => s + i.qty, 0);

  // Calculate total cart price
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  // Share cart data and functions with other components
  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        addItem,
        updateQty,
        removeItem,
        clear,
        refresh
      }}
    >
      {children}
    </CartContext.Provider>
  );
}