import { Link } from 'react-router-dom';
import { Logo } from './Navbar';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p className="footer-tag">More than just shopping.<br />It’s a lifestyle.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <Link to="/collections">All Products</Link><Link to="/women">Women</Link><Link to="/men">Men</Link>
          <Link to="/home-living">Home &amp; Living</Link><Link to="/beauty">Beauty</Link><Link to="/accessories">Accessories</Link>
        </div>
        <div>
          <h3>Customer Service</h3>
          <Link to="/contact">Contact Us</Link><Link to="/info/shipping-delivery">Shipping &amp; Delivery</Link>
          <Link to="/returns">Returns &amp; Refunds</Link><Link to="/info/size-guide">Size Guide</Link><Link to="/info/faqs">FAQs</Link>
        </div>
        <div>
          <h3>Information</h3>
          <Link to="/about">About Us</Link><Link to="/info/our-story">Our Story</Link><Link to="/info/sustainability">Sustainability</Link>
          <Link to="/info/privacy-policy">Privacy Policy</Link><Link to="/info/terms">Terms &amp; Conditions</Link>
        </div>
        <div>
          <h3>Payment Methods</h3>
          <p className="footer-pay">Cash on Delivery<br />Online payment via Razorpay (when enabled)</p>
        </div>
      </div>
      <p className="footer-copy">© 2026 Lumora. All Rights Reserved. Demo store — not a real shop.</p>
    </footer>
  );
}
