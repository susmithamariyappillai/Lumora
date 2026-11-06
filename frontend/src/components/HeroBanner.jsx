import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import Icon from './Icons';

export default function HeroBanner({
  eyebrow,
  title,
  italicLine,
  text,
  cta,
  image,
  imageAlt,
  secondary,
  tall = false
}) {
  return (
    <section className={`hero ${tall ? 'hero-tall' : ''}`}>

      {/* Banner image */}
      <div className="hero-media">
        <SafeImage src={image} alt={imageAlt} label={imageAlt} />
      </div>

      {/* Banner content */}
      <div className="container hero-inner">
        <div className="hero-copy">

          <p className="eyebrow">{eyebrow}</p>

          <h1>
            {title}
            {italicLine && (
              <>
                <br />
                <em>{italicLine}</em>
              </>
            )}
          </h1>

          <p className="hero-text">{text}</p>

          {/* Buttons */}
          <div className="hero-actions">
            <Link to={cta.to} className="btn btn-primary">
              {cta.label}
              <Icon name="arrow" size={16} />
            </Link>

            {secondary && (
              <Link to={secondary.to} className="btn btn-outline">
                {secondary.label}
              </Link>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}