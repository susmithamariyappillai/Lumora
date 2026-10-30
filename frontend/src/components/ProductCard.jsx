import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icons';
import SafeImage from './SafeImage';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import { COLOUR_HEX, SIZE_ORDER } from '../utils/constants';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const wish = useWishlist();
  const { push } = useToast();
  const [size, setSize] = useState('');
  const [colour, setColour] = useState(product.colours?.[0] || '');
  const out = product.stock <= 0;
  const sale = product.originalPrice > product.price;
  const discount = product.discountPercent || (sale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);
  const sizes = [...(product.sizes || [])].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  const link = `/product/${product.slug}`;

  const onAdd = () => {
    const r = addItem(product, { size, colour, qty: 1 });
    push(r.message, r.ok ? 'success' : 'error');
  };
  const onWish = () => push(wish.toggle(product) ? 'Added to wishlist.' : 'Removed from wishlist.', 'info');

  return (
    <article className="card">
      <div className="card-media">
        <Link to={link} aria-label={product.name}><SafeImage src={product.images?.[0]} alt={product.name} label={product.name} /></Link>
        {product.isNewArrival && !out && <span className="tag tag-new">New</span>}
        {out && <span className="tag tag-out">Out of stock</span>}
        <button className={`wish ${wish.has(product.slug) ? 'on' : ''}`} onClick={onWish} aria-pressed={wish.has(product.slug)} aria-label={wish.has(product.slug) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}>
          <Icon name="heart" size={18} fill={wish.has(product.slug)} />
        </button>
      </div>
      <div className="card-body">
        <h3><Link to={link}>{product.name}</Link></h3>
        <p className="price">
          <strong>{formatPrice(product.price)}</strong>
          {sale && <><s>{formatPrice(product.originalPrice)}</s><span className="tag tag-sale">{discount}% OFF</span></>}
        </p>
        <p className="rating"><Icon name="star" size={13} fill /> {product.rating} ({product.numReviews})</p>
        {product.colours?.length > 0 && (
          <div className="swatches" role="group" aria-label="Colour">
            {product.colours.map((c) => (
              <button key={c} className={`swatch ${colour === c ? 'sel' : ''}`} style={{ background: COLOUR_HEX[c] || '#ccc' }} aria-label={c} aria-pressed={colour === c} title={c} onClick={() => setColour(c)} />
            ))}
          </div>
        )}
        {sizes.length > 0 && (
          <div className="sizes" role="group" aria-label="Size">
            {sizes.map((s) => <button key={s} disabled={out} className={`size ${size === s ? 'sel' : ''}`} aria-pressed={size === s} onClick={() => setSize(s)}>{s}</button>)}
          </div>
        )}
        <button className="btn btn-primary btn-sm btn-block" disabled={out} onClick={onAdd}>{out ? 'Out of stock' : 'Add to Cart'}</button>
      </div>
    </article>
  );
}
