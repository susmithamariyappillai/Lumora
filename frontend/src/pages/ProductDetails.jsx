import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icons';
import SafeImage from '../components/SafeImage';
import ProductGrid from '../components/ProductGrid';
import { Loading, ErrorState, EmptyState, DemoNotice } from '../components/States';
import { getProduct, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import { COLOUR_HEX, SIZE_ORDER, categoryLabel, categoryPath } from '../utils/constants';

export default function ProductDetails() {
  const { slug } = useParams();
  const [s, setS] = useState({ loading: true, product: null, error: '', notFound: false, demo: false });
  const [related, setRelated] = useState([]);
  const [img, setImg] = useState(0);
  const [size, setSize] = useState('');
  const [colour, setColour] = useState('');
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const { addItem } = useCart();
  const wish = useWishlist();
  const { push } = useToast();

  useEffect(() => {
    setS({ loading: true, product: null, error: '', notFound: false, demo: false });
    setImg(0); setSize(''); setQty(1); setPinMsg('');
    getProduct(slug)
      .then(({ product, demo }) => {
        setS({ loading: false, product, error: '', notFound: false, demo });
        setColour(product.colours?.[0] || '');
        getProducts({ category: product.category, sub: product.subcategory, limit: 5 }).then((r) => setRelated(r.products.filter((p) => p.slug !== product.slug).slice(0, 4)));
      })
      .catch((e) => setS({ loading: false, product: null, error: e.message, notFound: e.status === 404, demo: false }));
  }, [slug]);

  if (s.loading) return <Loading />;
  if (s.notFound) return <div className="container"><EmptyState title="Product not found" text="This product does not exist or is no longer available." action={{ to: '/collections', label: 'Browse products' }} /></div>;
  if (s.error) return <div className="container"><ErrorState message={s.error} /></div>;

  const p = s.product;
  const out = p.stock <= 0;
  const sale = p.originalPrice > p.price;
  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  const sizes = [...(p.sizes || [])].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  const images = p.images?.length ? p.images : [''];

  const add = () => {
    if (qty < 1 || qty > Math.min(10, p.stock)) return push(`Choose a quantity between 1 and ${Math.min(10, p.stock)}.`, 'error');
    const r = addItem(p, { size, colour, qty });
    push(r.message, r.ok ? 'success' : 'error');
  };
  const checkPin = (e) => {
    e.preventDefault();
    // No courier API is connected, so we only validate the format and show a general estimate.
    setPinMsg(/^\d{6}$/.test(pin) ? 'Estimated delivery: 3–7 business days (general estimate, not a live courier check).' : 'Enter a valid 6-digit PIN code.');
  };

  return (
    <div className="container pdp">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> › <Link to={categoryPath(p.category)}>{categoryLabel(p.category)}</Link> › <span aria-current="page">{p.name}</span>
      </nav>
      {s.demo && <DemoNotice />}
      <div className="pdp-grid">
        <div className="gallery">
          <div className="gallery-main"><SafeImage src={images[img]} alt={p.name} label={p.name} /></div>
          {images.length > 1 && <div className="thumbs">{images.map((im, i) => <button key={im} className={i === img ? 'sel' : ''} onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`}><SafeImage src={im} alt="" label={`${i + 1}`} /></button>)}</div>}
        </div>
        <div className="pdp-info">
          <h1>{p.name}</h1>
          <p className="price big"><strong>{formatPrice(p.price)}</strong>{sale && <><s>{formatPrice(p.originalPrice)}</s><span className="tag tag-sale">{discount}% OFF</span></>}</p>
          <p className="rating"><Icon name="star" size={14} fill /> {p.rating} · {p.numReviews} ratings <small>(demo catalogue data)</small></p>
          <p>{p.description}</p>

          {p.colours?.length > 0 && (
            <div><h2 className="label">Colour: {colour}</h2>
              <div className="swatches big" role="group" aria-label="Colour">{p.colours.map((c) => <button key={c} className={`swatch ${colour === c ? 'sel' : ''}`} style={{ background: COLOUR_HEX[c] || '#ccc' }} aria-label={c} aria-pressed={colour === c} onClick={() => setColour(c)} />)}</div></div>
          )}
          {sizes.length > 0 && (
            <div><h2 className="label">Size</h2>
              <div className="sizes" role="group" aria-label="Size">{sizes.map((x) => <button key={x} className={`size ${size === x ? 'sel' : ''}`} aria-pressed={size === x} onClick={() => setSize(x)}>{x}</button>)}</div></div>
          )}
          <div className="qty-row">
            <div className="qty" role="group" aria-label="Quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button><span>{qty}</span>
              <button onClick={() => setQty(Math.min(10, p.stock, qty + 1))} aria-label="Increase quantity">+</button>
            </div>
            <p className={out ? 'err' : p.stock <= 5 ? 'warn' : 'ok'}>{out ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left` : 'In stock'}</p>
          </div>
          <div className="pdp-actions">
            <button className="btn btn-primary" disabled={out} onClick={add}>{out ? 'Out of stock' : 'Add to Cart'}</button>
            <button className="btn btn-outline" onClick={() => push(wish.toggle(p) ? 'Added to wishlist.' : 'Removed from wishlist.', 'info')}>
              <Icon name="heart" size={16} fill={wish.has(p.slug)} /> {wish.has(p.slug) ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
          <form className="pin" onSubmit={checkPin}>
            <label htmlFor="pin">Delivery estimate</label>
            <div><input id="pin" inputMode="numeric" maxLength={6} placeholder="Enter PIN code" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} /><button className="btn btn-outline btn-sm">Check</button></div>
            {pinMsg && <small role="status">{pinMsg}</small>}
          </form>
          <p className="policy"><Icon name="refresh" size={16} /> 30-day returns on delivered orders. <Link to="/returns">Return policy</Link></p>
        </div>
      </div>

      <section className="section"><h2>Customer Reviews</h2><p className="muted">No customer reviews yet. Review collection is not part of this version; the rating above comes from the demo catalogue.</p></section>
      {related.length > 0 && <section className="section"><h2>Related Products</h2><ProductGrid products={related} /></section>}
    </div>
  );
}
