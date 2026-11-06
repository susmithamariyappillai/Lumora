// Import useEffect hook from React
import { useEffect } from 'react';

// Import routing components from React Router
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

// Import common website components
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import all website pages
import Home from './pages/Home';
import Women from './pages/Women';
import Men from './pages/Men';
import Beauty from './pages/Beauty';
import Accessories from './pages/Accessories';
import HomeLiving from './pages/HomeLiving';
import Deals from './pages/Deals';
import NewArrivals from './pages/NewArrivals';
import Collections from './pages/Collections';
import SearchResults from './pages/SearchResults';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Returns from './pages/Returns';
import Contact from './pages/Contact';
import About from './pages/About';
import InfoPage from './pages/InfoPage';
import NotFound from './pages/NotFound';

// Common layout shared by all pages
function Layout() {

  // Get current URL path and hash
  const { pathname, hash } = useLocation();

  // Handle scrolling when the route changes
  useEffect(() => {

    // If URL has no hash, scroll to the top
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Scroll to the section mentioned in the URL hash
    const timer = setTimeout(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 300);

    // Clear the timer when the route changes
    return () => clearTimeout(timer);

  }, [pathname, hash]);

  return (
    <>
      {/* Skip link for keyboard accessibility */}
      <a href="#main" className="skip">
        Skip to content
      </a>

      {/* Common components */}
      <AnnouncementBar />
      <Navbar />

      {/* Display the selected page */}
      <main id="main">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

// Reusable function to protect private pages
const priv = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

// Main application component
export default function App() {
  return (
    <Routes>

      {/* Common layout for all routes */}
      <Route element={<Layout />}>

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/women" element={<Women />} />
        <Route path="/men" element={<Men />} />
        <Route path="/beauty" element={<Beauty />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/home-living" element={<HomeLiving />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:slug" element={<ProductDetails />} />

        {/* Login and registration pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Cart and wishlist pages */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Protected pages – login required */}
        <Route path="/checkout" element={priv(<Checkout />)} />
        <Route path="/order-success/:id" element={priv(<OrderSuccess />)} />
        <Route path="/orders" element={priv(<MyOrders />)} />
        <Route path="/orders/:id" element={priv(<OrderTracking />)} />
        <Route path="/profile" element={priv(<Profile />)} />

        {/* Other information pages */}
        <Route path="/returns" element={<Returns />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/info/:slug" element={<InfoPage />} />

        {/* Display page not found for unknown URLs */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
}