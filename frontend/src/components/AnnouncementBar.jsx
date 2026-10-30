import Icon from './Icons';

export default function AnnouncementBar() {
  return (
    <div className="announce">
      <div className="container announce-inner">
        <span><Icon name="truck" size={16} /> Free Shipping on Orders Above ₹999</span>
        <span><Icon name="refresh" size={16} /> Easy 30-Day Returns</span>
        <span><Icon name="shield" size={16} /> Secure &amp; Safe Payments</span>
      </div>
    </div>
  );
}
