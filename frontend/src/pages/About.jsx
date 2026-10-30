import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container section prose">
      <h1 className="page-title">About Lumora</h1>
      <p> Welcome to Lumora, where fashion meets elegance and everyday living
  becomes more beautiful. Explore our collections of women's fashion,
  men's fashion, beauty, accessories, and home essentials — all in one place.</p>
      <p> Discover styles that inspire confidence, express your personality,
  and bring a touch of elegance to your everyday lifestyle.</p>
      <Link className="btn btn-primary" to="/collections">Browse the collection</Link>
    </div>
  );
}
