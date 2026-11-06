import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icons';
import SafeImage from './SafeImage';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

import { formatPrice } from '../utils/formatPrice';
import { COLOUR_HEX, SIZE_ORDER } from '../utils/constants';

//  Displays product details and provides cart and wishlist options.
export default function ProductCard({ product }) {

  //  Get cart, wishlist and toast functions.
  const { addItem } = useCart();
  const wish = useWishlist();
  const { push } = useToast();

  // Store selected size and colour.
  const [size, setSize] = useState('');
  const [colour, setColour] = useState(product.colours?.[0] || '');

  //  Check stock and discount.
  const out = product.stock <= 0;
  const sale = product.originalPrice > product.price;

  const discount = product.discountPercent || (
    sale
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0
  );

  //  Arrange product sizes in the correct order.
  const sizes = [...(product.sizes || [])].sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  );

  //  Create product details page link.
  const link = `/product/${product.slug}`;

  //  Add selected product to cart.
  const onAdd = () => {
    const r = addItem(product, {
      size,
      colour,
      qty: 1
    });

    push(r.message, r.ok ? 'success' : 'error');
  };

  // Hint: Add or remove product from wishlist.
  const onWish = () => {
    push(
      wish.toggle(product)
        ? 'Added to wishlist.'
        : 'Removed from wishlist.',
      'info'
    );
  };

  return (
    <article className="card">

      {/* Product image and wishlist */}
      <div className="card-media">

        <Link to={link} aria-label={product.name}>
          <SafeImage
            src={product.images?.[0]}
            alt={product.name}
            label={product.name}
          />
        </Link>

        {product.isNewArrival && !out && (
          <span className="tag tag-new">New</span>
        )}

        {out && (
          <span className="tag tag-out">Out of stock</span>
        )}

        <button
          className={`wish ${wish.has(product.slug) ? 'on' : ''}`}
          onClick={onWish}
          aria-pressed={wish.has(product.slug)}
          aria-label={
            wish.has(product.slug)
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Icon
            name="heart"
            size={18}
            fill={wish.has(product.slug)}
          />
        </button>
      </div>

      {/* Product details */}
      <div className="card-body">

        <h3>
          <Link to={link}>{product.name}</Link>
        </h3>

        {/* Product price and discount */}
        <p className="price">
          <strong>{formatPrice(product.price)}</strong>

          {sale && (
            <>
              <s>{formatPrice(product.originalPrice)}</s>
              <span className="tag tag-sale">
                {discount}% OFF
              </span>
            </>
          )}
        </p>

        {/* Product rating */}
        <p className="rating">
          <Icon name="star" size={13} fill />
          {product.rating} ({product.numReviews})
        </p>

        {/* Colour selection */}
        {product.colours?.length > 0 && (
          <div className="swatches" role="group" aria-label="Colour">

            {product.colours.map((c) => (
              <button
                key={c}
                className={`swatch ${colour === c ? 'sel' : ''}`}
                style={{ background: COLOUR_HEX[c] || '#ccc' }}
                aria-label={c}
                aria-pressed={colour === c}
                title={c}
                onClick={() => setColour(c)}
              />
            ))}

          </div>
        )}

        {/* Size selection */}
        {sizes.length > 0 && (
          <div className="sizes" role="group" aria-label="Size">

            {sizes.map((s) => (
              <button
                key={s}
                disabled={out}
                className={`size ${size === s ? 'sel' : ''}`}
                aria-pressed={size === s}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}

          </div>
        )}

        {/* Add to cart button */}
        <button
          className="btn btn-primary btn-sm btn-block"
          disabled={out}
          onClick={onAdd}
        >
          {out ? 'Out of stock' : 'Add to Cart'}
        </button>

      </div>
    </article>
  );
}