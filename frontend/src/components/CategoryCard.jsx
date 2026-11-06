
import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';

// This component displays one category card
export default function CategoryCard({ category, image, count }) {
  return (
    <Link to={category.path} className="cat-card">

      {/* Category Image */}
      <div className="cat-img">
        <SafeImage
          src={image}
          alt={category.label}
          label={category.short}
        />
      </div>

      {/* Category Name */}
      <h3>{category.short}</h3>

      {/* Number of Products */}
      <p>{count} items</p>

      {/* Shop Link */}
      <span className="cat-link">Shop Now</span>

    </Link>
  );
}
