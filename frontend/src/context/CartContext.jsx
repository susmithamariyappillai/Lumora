import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProductsBySlugs } from '../services/productService';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);
const KEY = 'lumora_cart';
const MAX_QTY = 10;
const lineKey = (slug, size, colour) => `${slug}|${size || ''}|${colour || ''}`;

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }

// Cart lines remember product info only for DISPLAY. The server re-reads real prices when you check out.
export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage full/blocked */ } }, [items]);

  const addItem = useCallback((product, { size = '', colour = '', qty = 1 }) => {
    if (product.stock <= 0) return { ok: false, message: 'This product is out of stock.' };
    if (product.sizes?.length && !size) return { ok: false, message: 'Please choose a size.' };
    const key = lineKey(product.slug, size, colour);
    const inCartForProduct = items.filter((i) => i.slug === product.slug).reduce((s, i) => s + i.qty, 0);
    if (inCartForProduct + qty > product.stock) return { ok: false, message: `Only ${product.stock} in stock${inCartForProduct ? ` (you already have ${inCartForProduct} in your cart)` : ''}.` };
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i)); // same variant = one line
      return [...prev, { key, slug: product.slug, name: product.name, image: product.images?.[0] || '', price: product.price, size, colour, qty, stock: product.stock }];
    });
    return { ok: true, message: `${product.name} added to cart.` };
  }, [items]);

  const updateQty = (key, qty) => setItems((prev) => prev.map((i) => {
    if (i.key !== key) return i;
    const others = prev.filter((x) => x.slug === i.slug && x.key !== key).reduce((s, x) => s + x.qty, 0);
    return { ...i, qty: Math.max(1, Math.min(qty, MAX_QTY, i.stock - others)) };
  }));
  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clear = () => setItems([]);

  // Re-check price & stock with the server (or demo catalogue). Returns a list of messages about changes.
  const refresh = useCallback(async () => {
    const slugs = [...new Set(items.map((i) => i.slug))];
    if (!slugs.length) return [];
    const fresh = await getProductsBySlugs(slugs);
    const bySlug = Object.fromEntries(fresh.map((p) => [p.slug, p]));
    const notes = [];
    const next = [];
    items.forEach((i) => {
      const p = bySlug[i.slug];
      if (!p || p.stock <= 0) { notes.push(`${i.name} is no longer available and was removed.`); return; }
      if (p.price !== i.price) notes.push(`Price of ${i.name} changed.`);
      const qty = Math.min(i.qty, p.stock);
      if (qty < i.qty) notes.push(`${i.name}: only ${p.stock} left, quantity reduced.`);
      next.push({ ...i, price: p.price, stock: p.stock, qty, name: p.name, image: p.images?.[0] || i.image });
    });
    setItems(next);
    return notes;
  }, [items]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  return <CartContext.Provider value={{ items, count, subtotal, addItem, updateQty, removeItem, clear, refresh }}>{children}</CartContext.Provider>;
}
