import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

// Create Wishlist context
const WishlistContext = createContext(null);

// Access wishlist details from other components
export const useWishlist = () => useContext(WishlistContext);

// Local storage key
const KEY = 'lumora_wishlist';

// Provide wishlist details to child components
export function WishlistProvider({ children }) {

  // Load wishlist items from localStorage
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });

  // Save wishlist items whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  // Check whether a product is already in wishlist
  const has = (slug) => {
    return items.some((p) => p.slug === slug);
  };

  // Add or remove a product from wishlist
  const toggle = (product) => {
    const added = !has(product.slug);

    setItems((prev) =>
      added
        ? [...prev, product]
        : prev.filter((p) => p.slug !== product.slug)
    );

    return added;
  };

  // Remove a specific product from wishlist
  const remove = (slug) => {
    setItems((prev) =>
      prev.filter((p) => p.slug !== slug)
    );
  };

  // Share wishlist data and functions with other components
  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        has,
        toggle,
        remove
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}