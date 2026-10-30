
import { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

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

function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const timer = setTimeout(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const priv = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
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

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={priv(<Checkout />)} />
        <Route path="/order-success/:id" element={priv(<OrderSuccess />)} />
        <Route path="/orders" element={priv(<MyOrders />)} />
        <Route path="/orders/:id" element={priv(<OrderTracking />)} />
        <Route path="/profile" element={priv(<Profile />)} />

        <Route path="/returns" element={<Returns />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/info/:slug" element={<InfoPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
