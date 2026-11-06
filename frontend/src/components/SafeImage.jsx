import { useState } from 'react';

export default function SafeImage({
  src,
  alt,
  label,
  className = '',
  ...rest
}) {
  // Track image loading failure
  const [failed, setFailed] = useState(false);

  // Show placeholder if image is missing or fails to load
  if (!src || failed) {
    return (
      <div
        className={`img-placeholder ${className}`}
        role="img"
        aria-label={`${alt || label || 'Image'} (placeholder: image file not added yet)`}
      >
        <span>{label || alt || 'Image'}</span>
        <small>image not added yet</small>
      </div>
    );
  }

  // Display the image
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
