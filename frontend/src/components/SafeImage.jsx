import { useState } from 'react';

// Shows the image; if the file is missing, shows a clearly labelled placeholder (never a random unrelated photo).
export default function SafeImage({ src, alt, label, className = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`img-placeholder ${className}`} role="img" aria-label={`${alt || label || 'Image'} (placeholder: image file not added yet)`}>
        <span>{label || alt || 'Image'}</span>
        <small>image not added yet</small>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...rest} />;
}
