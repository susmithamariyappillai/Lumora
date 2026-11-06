import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import HeroBanner from '../components/HeroBanner';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import SafeImage from '../components/SafeImage';
import Icon from '../components/Icons';

import { Loading, ErrorState, DemoNotice } from '../components/States';
import { getProducts, getCategories } from '../services/productService';
import { CATEGORIES } from '../utils/constants';

// Benefits displayed on the homepage
const BENEFITS = [
  ['truck', 'Free Shipping', 'On orders above ₹999'],
  ['shield', 'Secure Payment', 'Cash on Delivery or Razorpay'],
  ['refresh', 'Easy Returns', '30-day return policy'],
  ['headset', 'Support', 'Contact us any time'],
];

// Sample review content
const DEMO_REVIEWS = [
  ['Priya S', "The quality is amazing and the dress looks exactly as shown. I really loved it!"],
  ['Anu M', "Beautiful collection with great packaging. The product arrived safely and on time."],
  ['Raju L', "Loved the design and quality. Shopping at Lumora was a wonderful experience."],
];

export default function Home() {

  // Store homepage product data and loading/error status
  const [data, setData] = useState({
    loading: true,
    error: '',
    arrivals: [],
    best: [],
    demo: false
  });

  // Store category information
  const [cats, setCats] = useState([]);

  // Fetch new arrivals and best-selling products
  const load = () => {
    setData((d) => ({
      ...d,
      loading: true,
      error: ''
    }));

    Promise.all([
      getProducts({
        newArrival: 'true',
        sort: 'newest',
        limit: 6
      }),
      getProducts({
        bestSeller: 'true',
        limit: 6
      })
    ])
      .then(([a, b]) => {
        // Update product data after successful API response
        setData({
          loading: false,
          error: '',
          arrivals: a.products,
          best: b.products,
          demo: a.demo
        });
      })
      .catch((e) => {
        // Store error if API request fails
        setData((d) => ({
          ...d,
          loading: false,
          error: e.message
        }));
      });
  };

  // Load products and categories when homepage opens
  useEffect(() => {
    load();

    getCategories()
      .then((r) => setCats(r.categories))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Main homepage banner */}
      <HeroBanner
        tall
        eyebrow="NEW SEASON COLLECTION"
        title="Style That"
        italicLine="Speaks You"
        text="Discover fashion and lifestyle essentials designed for every moment."
        cta={{ label: 'Shop Women', to: '/women' }}
        secondary={{
          label: 'Explore Collections',
          to: '/collections'
        }}
        image="/images/hero-fashion.jpg"
        imageAlt="Woman in a pink dress with flowers"
      />

      {/* Display shopping benefits */}
      <section className="benefits container" aria-label="Our promises">
        {BENEFITS.map(([icon, t, s]) => (
          <div key={t}>
            <span className="benefit-icon">
              <Icon name={icon} size={22} />
            </span>

            <div>
              <strong>{t}</strong>
              <small>{s}</small>
            </div>
          </div>
        ))}
      </section>

      {/* Display product categories */}
      <section className="container section">
        <div className="section-head">
          <h2>Shop by Category</h2>

          <Link to="/collections">
            Browse all <Icon name="arrow" size={14} />
          </Link>
        </div>

        <div className="cat-row">
          {CATEGORIES.map((c) => (
            <CategoryCard
              key={c.slug}
              category={c}
              image={`/images/categories/${c.slug}.jpg`}
              count={
                cats.find((x) => x.slug === c.slug)?.count ?? '—'
              }
            />
          ))}
        </div>
      </section>

      {/* Promotional sale banner */}
      <section className="container">
        <div className="promo promo-home">
          <div>
            <p className="eyebrow">Limited time offer</p>
            <h2>Spring Sale is Live!</h2>
            <p>Enjoy up to 40% off on selected collections.</p>

            <Link to="/deals" className="btn btn-pink">
              Explore Deals <Icon name="arrow" size={16} />
            </Link>
          </div>

          <div className="promo-badge" aria-hidden="true">
            <small>UP TO</small>
            <strong>40%</strong>
            <small>OFF</small>
          </div>

          <SafeImage
            src="/images/sale-banner.jpg"
            alt="Navy handbag with sunglasses"
            label="Sale banner"
          />
        </div>
      </section>

      {/* New arrivals and best-selling products */}
      <section className="container section">
        {data.demo && <DemoNotice />}

        <div className="section-head">
          <h2>New Arrivals</h2>
          <Link to="/new-arrivals">
            View all <Icon name="arrow" size={14} />
          </Link>
        </div>

        {/* Show loading, error or product list */}
        {data.loading ? (
          <Loading />
        ) : data.error ? (
          <ErrorState
            message={data.error}
            onRetry={load}
          />
        ) : (
          <ProductGrid products={data.arrivals} />
        )}

        <div className="section-head">
          <h2>Best Sellers</h2>
          <Link to="/collections?sort=popularity">
            View all <Icon name="arrow" size={14} />
          </Link>
        </div>

        {!data.loading && !data.error && (
          <ProductGrid products={data.best} />
        )}
      </section>

      {/* Display sample customer reviews */}
      <section className="container reviews" aria-label="Sample reviews">
        <div>
          <h2>What Our Customers Say</h2>
          <p>
            A little style, a lot of confidence.
            Experience the Lumora difference.
          </p>
        </div>

        {DEMO_REVIEWS.map(([name, text]) => (
          <blockquote key={name}>
            <strong>{name}</strong>
            <small></small>
            <p>{text}</p>
          </blockquote>
        ))}
      </section>

      {/* Newsletter subscription section */}
      <section className="container section">
        <Newsletter />
      </section>
    </>
  );
}