import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Icon from '../components/Icons';
import SafeImage from '../components/SafeImage';
import ProductGrid from '../components/ProductGrid';

import {
  Loading,
  ErrorState,
  EmptyState,
  DemoNotice
} from '../components/States';

import { getProduct, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

import { formatPrice } from '../utils/formatPrice';

import {
  COLOUR_HEX,
  SIZE_ORDER,
  categoryLabel,
  categoryPath
} from '../utils/constants';

export default function ProductDetails() {

  // Get product slug from URL
  const { slug } = useParams();

  // Store product details and API status
  const [s, setS] = useState({
    loading: true,
    product: null,
    error: '',
    notFound: false,
    demo: false
  });

  // Store related products
  const [related, setRelated] = useState([]);

  // Store selected image, size, colour and quantity
  const [img, setImg] = useState(0);
  const [size, setSize] = useState('');
  const [colour, setColour] = useState('');
  const [qty, setQty] = useState(1);

  // Store delivery PIN and validation message
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  // Get cart, wishlist and toast functions
  const { addItem } = useCart();
  const wish = useWishlist();
  const { push } = useToast();

  // Fetch product details when slug changes
  useEffect(() => {

    // Reset product page states
    setS({
      loading: true,
      product: null,
      error: '',
      notFound: false,
      demo: false
    });

    setImg(0);
    setSize('');
    setQty(1);
    setPinMsg('');

    // Fetch selected product
    getProduct(slug)
      .then(({ product, demo }) => {

        // Store product details
        setS({
          loading: false,
          product,
          error: '',
          notFound: false,
          demo
        });

        // Select first available colour by default
        setColour(product.colours?.[0] || '');

        // Fetch related products
        getProducts({
          category: product.category,
          sub: product.subcategory,
          limit: 5
        }).then((r) => {
          setRelated(
            r.products
              .filter((p) => p.slug !== product.slug)
              .slice(0, 4)
          );
        });
      })
      .catch((e) => {

        // Handle product loading errors
        setS({
          loading: false,
          product: null,
          error: e.message,
          notFound: e.status === 404,
          demo: false
        });
      });

  }, [slug]);

  // Display loading component
  if (s.loading) {
    return <Loading />;
  }

  // Display if product does not exist
  if (s.notFound) {
    return (
      <div className="container">
        <EmptyState
          title="Product not found"
          text="This product does not exist or is no longer available."
          action={{
            to: '/collections',
            label: 'Browse products'
          }}
        />
      </div>
    );
  }

  // Display API error
  if (s.error) {
    return (
      <div className="container">
        <ErrorState message={s.error} />
      </div>
    );
  }

  // Store product details in a variable
  const p = s.product;

  // Check stock and discount
  const out = p.stock <= 0;
  const sale = p.originalPrice > p.price;

  const discount = Math.round(
    ((p.originalPrice - p.price) / p.originalPrice) * 100
  );

  // Sort product sizes
  const sizes = [...(p.sizes || [])].sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  );

  // Use product images or an empty placeholder
  const images = p.images?.length ? p.images : [''];

  // Add product to cart
  const add = () => {

    // Validate quantity based on stock
    if (qty < 1 || qty > Math.min(10, p.stock)) {
      return push(
        `Choose a quantity between 1 and ${Math.min(10, p.stock)}.`,
        'error'
      );
    }

    // Add selected product details to cart
    const r = addItem(p, { size, colour, qty });

    // Display success or error message
    push(r.message, r.ok ? 'success' : 'error');
  };

  // Validate delivery PIN code
  const checkPin = (e) => {
    e.preventDefault();

    // This is a general estimate, not live courier tracking
    setPinMsg(
      /^\d{6}$/.test(pin)
        ? 'Estimated delivery: 3–7 business days (general estimate, not a live courier check).'
        : 'Enter a valid 6-digit PIN code.'
    );
  };

  return (
    <div className="container pdp">

      {/* Breadcrumb navigation */}
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> ›{' '}
        <Link to={categoryPath(p.category)}>
          {categoryLabel(p.category)}
        </Link>{' '}
        › <span aria-current="page">{p.name}</span>
      </nav>

      {/* Show demo notice if demo catalogue is used */}
      {s.demo && <DemoNotice />}

      <div className="pdp-grid">

        {/* Product image gallery */}
        <div className="gallery">
          <div className="gallery-main">
            <SafeImage
              src={images[img]}
              alt={p.name}
              label={p.name}
            />
          </div>

          {/* Display thumbnail images */}
          {images.length > 1 && (
            <div className="thumbs">
              {images.map((im, i) => (
                <button
                  key={im}
                  className={i === img ? 'sel' : ''}
                  onClick={() => setImg(i)}
                  aria-label={`Show image ${i + 1}`}
                >
                  <SafeImage
                    src={im}
                    alt=""
                    label={`${i + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="pdp-info">

          <h1>{p.name}</h1>

          {/* Product price and discount */}
          <p className="price big">
            <strong>{formatPrice(p.price)}</strong>

            {sale && (
              <>
                <s>{formatPrice(p.originalPrice)}</s>
                <span className="tag tag-sale">
                  {discount}% OFF
                </span>
              </>
            )}
          </p>

          {/* Product rating */}
          <p className="rating">
            <Icon name="star" size={14} fill />
            {p.rating} · {p.numReviews} ratings
            <small>(demo catalogue data)</small>
          </p>

          <p>{p.description}</p>

          {/* Colour selection */}
          {p.colours?.length > 0 && (
            <div>
              <h2 className="label">
                Colour: {colour}
              </h2>

              <div
                className="swatches big"
                role="group"
                aria-label="Colour"
              >
                {p.colours.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${colour === c ? 'sel' : ''}`}
                    style={{
                      background: COLOUR_HEX[c] || '#ccc'
                    }}
                    aria-label={c}
                    aria-pressed={colour === c}
                    onClick={() => setColour(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selection */}
          {sizes.length > 0 && (
            <div>
              <h2 className="label">Size</h2>

              <div
                className="sizes"
                role="group"
                aria-label="Size"
              >
                {sizes.map((x) => (
                  <button
                    key={x}
                    className={`size ${size === x ? 'sel' : ''}`}
                    aria-pressed={size === x}
                    onClick={() => setSize(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selection and stock status */}
          <div className="qty-row">
            <div className="qty" role="group" aria-label="Quantity">

              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{qty}</span>

              <button
                onClick={() => setQty(Math.min(10, p.stock, qty + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p className={out ? 'err' : p.stock <= 5 ? 'warn' : 'ok'}>
              {out
                ? 'Out of stock'
                : p.stock <= 5
                  ? `Only ${p.stock} left`
                  : 'In stock'}
            </p>
          </div>

          {/* Cart and wishlist buttons */}
          <div className="pdp-actions">

            <button
              className="btn btn-primary"
              disabled={out}
              onClick={add}
            >
              {out ? 'Out of stock' : 'Add to Cart'}
            </button>

            <button
              className="btn btn-outline"
              onClick={() =>
                push(
                  wish.toggle(p)
                    ? 'Added to wishlist.'
                    : 'Removed from wishlist.',
                  'info'
                )
              }
            >
              <Icon
                name="heart"
                size={16}
                fill={wish.has(p.slug)}
              />

              {wish.has(p.slug)
                ? 'In Wishlist'
                : 'Add to Wishlist'}
            </button>
          </div>

          {/* Delivery PIN code form */}
          <form className="pin" onSubmit={checkPin}>
            <label htmlFor="pin">Delivery estimate</label>

            <div>
              <input
                id="pin"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter PIN code"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, ''))
                }
              />

              <button className="btn btn-outline btn-sm">
                Check
              </button>
            </div>

            {pinMsg && (
              <small role="status">{pinMsg}</small>
            )}
          </form>

          {/* Return policy link */}
          <p className="policy">
            <Icon name="refresh" size={16} />
            30-day returns on delivered orders.
            <Link to="/returns">Return policy</Link>
          </p>
        </div>
      </div>

      {/* Customer reviews section */}
      <section className="section">
        <h2>Customer Reviews</h2>
        <p className="muted">
          No customer reviews yet. Review collection is not part of this
          version; the rating above comes from the demo catalogue.
        </p>
      </section>

      {/* Display related products */}
      {related.length > 0 && (
        <section className="section">
          <h2>Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}

    </div>
  );
}