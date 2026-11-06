import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from './Icons';
import SearchBar from './SearchBar';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/constants';

// Logo component
export function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M16 29V12M16 12c-4-1-6-4-6-8 4 1 6 4 6 8zm0 0c4-1 6-4 6-8-4 1-6 4-6 8zM16 20c-4-1-7-3-8-7 4 0 7 3 8 7zm0 0c4-1 7-3 8-7-4 0-7 3-8 7z" />
      </svg>

      <span className="logo-text">LUMORA</span>
    </span>
  );
}

// Navbar component
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  const { count } = useCart();
  const wish = useWishlist();
  const { user } = useAuth();

  const close = () => {
    setOpen(false);
    setShopOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">

        {/* Logo */}
        <Link
          to="/"
          className="logo-link"
          aria-label="Lumora home"
          onClick={close}
        >
          <Logo />
        </Link>

        {/* Navigation links */}
        <nav
          className={`nav-links ${open ? 'open' : ''}`}
          aria-label="Main"
        >
          <div
            className="dropdown"
            onMouseLeave={() => setShopOpen(false)}
          >
            <button
              className="nav-link"
              aria-expanded={shopOpen}
              aria-haspopup="true"
              onClick={() => setShopOpen(!shopOpen)}
              onMouseEnter={() => setShopOpen(true)}
            >
              Shop <Icon name="chevron" size={14} />
            </button>

            {shopOpen && (
              <div className="dropdown-menu">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    to={category.path}
                    onClick={close}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink className="nav-link" to="/collections" onClick={close}>
            Collections
          </NavLink>

          <NavLink className="nav-link" to="/new-arrivals" onClick={close}>
            New Arrivals
          </NavLink>

          <NavLink className="nav-link" to="/deals" onClick={close}>
            Deals
          </NavLink>

          <NavLink className="nav-link" to="/about" onClick={close}>
            About
          </NavLink>

          <div className="nav-search-mobile">
            <SearchBar onDone={close} />
          </div>
        </nav>

        {/* Right side */}
        <div className="nav-right">

          <div className="nav-search-desktop">
            <SearchBar />
          </div>

          <Link
            to={user ? '/profile' : '/login'}
            className="icon-btn"
            aria-label={user ? 'My account' : 'Log in'}
          >
            <Icon name="user" />
          </Link>

          <Link
            to="/wishlist"
            className="icon-btn"
            aria-label={`Wishlist, ${wish.count} items`}
          >
            <Icon name="heart" />

            {wish.count > 0 && (
              <span className="badge-count">{wish.count}</span>
            )}
          </Link>

          <Link
            to="/cart"
            className="icon-btn"
            aria-label={`Cart, ${count} items`}
          >
            <Icon name="bag" />

            {count > 0 && (
              <span className="badge-count">{count}</span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="icon-btn menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>

        </div>
      </div>
    </header>
  );
}