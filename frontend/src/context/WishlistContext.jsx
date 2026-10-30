import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);
const KEY = 'lumora_wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ } }, [items]);

  const has = (slug) => items.some((p) => p.slug === slug);
  // returns true when the product was ADDED, false when removed
  const toggle = (product) => {
    const added = !has(product.slug);
    setItems((prev) => (added ? [...prev, product] : prev.filter((p) => p.slug !== product.slug)));
    return added;
  };
  const remove = (slug) => setItems((prev) => prev.filter((p) => p.slug !== slug));
  return <WishlistContext.Provider value={{ items, count: items.length, has, toggle, remove }}>{children}</WishlistContext.Provider>;
}
