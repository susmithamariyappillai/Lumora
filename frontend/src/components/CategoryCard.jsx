import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';

export default function CategoryCard({ category, image, count }) {
  return (
    <Link to={category.path} className="cat-card" aria-label={`Shop ${category.label}`}>
      <div className="cat-img"><SafeImage src={image} alt={category.label} label={category.short} /></div>
      <h3>{category.short}</h3>
      <p>{count} items</p>
      <span className="cat-link">Shop Now</span>
    </Link>
  );
}
