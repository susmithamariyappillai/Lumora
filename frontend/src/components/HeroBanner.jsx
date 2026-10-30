import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import Icon from './Icons';

// Text on the left, photo on the right fading into the ivory background.
export default function HeroBanner({ eyebrow, title, italicLine, text, cta, image, imageAlt, secondary, tall = false }) {
  return (
    <section className={`hero ${tall ? 'hero-tall' : ''}`}>
      <div className="hero-media"><SafeImage src={image} alt={imageAlt} label={imageAlt} /></div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}{italicLine && <><br /><em>{italicLine}</em></>}</h1>
          <p className="hero-text">{text}</p>
          <div className="hero-actions">
            <Link to={cta.to} className="btn btn-primary">{cta.label} <Icon name="arrow" size={16} /></Link>
            {secondary && <Link to={secondary.to} className="btn btn-outline">{secondary.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
