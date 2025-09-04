export function preloadImages(selector, options = {}) {
  const {
    priority = 'low',
    transition = 'fade', // Added support for 'slide-in', 'scale'
    onImageLoaded = null, // Callback for custom event
    onAllImagesLoaded = null, // Callback when all images are loaded
  } = options;

  // Select all images with the given selector
  const images = document.querySelectorAll(selector);
  if (!images.length) {
    console.warn('No images found for selector:', selector);
    return;
  }

  // Track loaded images for all-images-loaded event
  let loadedCount = 0;
  const totalImages = images.length;

  // Sort images by priority (high first)
  const sortedImages = Array.from(images).sort((a, b) => {
    const aPriority = a.dataset.priority || priority;
    const bPriority = b.dataset.priority || priority;
    return aPriority === 'high' && bPriority !== 'high' ? -1 : 1;
  });

  // Check WebP support
  const supportsWebP = (() => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  })();

  // Fallback for browsers without IntersectionObserver
  const hasIntersectionObserver = 'IntersectionObserver' in window;
  const loadImage = (img) => {
    const src = supportsWebP && img.dataset.srcWebp ? img.dataset.srcWebp : img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.removeAttribute('data-src-webp');

      // Apply transition
      if (transition !== 'none') {
        img.style.transition = transition === 'fade'
          ? 'opacity 0.5s ease-in'
          : transition === 'slide-in'
          ? 'transform 0.5s ease-in, opacity 0.5s ease-in'
          : transition === 'scale'
          ? 'transform 0.5s ease-in, opacity 0.5s ease-in'
          : 'opacity 0.5s ease-in';
        img.style.opacity = 0;
        if (transition === 'slide-in') {
          img.style.transform = 'translateY(20px)';
        } else if (transition === 'scale') {
          img.style.transform = 'scale(0.8)';
        }
        img.onload = () => {
          img.style.opacity = 1;
          if (transition === 'slide-in') {
            img.style.transform = 'translateY(0)';
          } else if (transition === 'scale') {
            img.style.transform = 'scale(1)';
          }
          // Dispatch custom event
          const event = new CustomEvent('image-loaded', { detail: { img } });
          img.dispatchEvent(event);
          if (onImageLoaded) onImageLoaded(img);
          loadedCount++;
          if (loadedCount === totalImages && onAllImagesLoaded) {
            onAllImagesLoaded();
          }
        };
        img.onerror = () => {
          console.error('Failed to load image:', src);
        };
      }
    }
  };

  if (hasIntersectionObserver) {
    // Set up IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          obs.unobserve(img);
        }
      });
    }, observerOptions);

    // Observe each image
    sortedImages.forEach(img => {
      observer.observe(img);
    });
  } else {
    // Fallback: Load images based on scroll/resize
    const checkImages = () => {
      sortedImages.forEach(img => {
        if (!img.dataset.src) return; // Skip already loaded images
        const rect = img.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
        if (isInViewport) {
          loadImage(img);
        }
      });
    };
    window.addEventListener('scroll', checkImages);
    window.addEventListener('resize', checkImages);
    checkImages(); // Initial check
  }
}