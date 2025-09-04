## lazy-image-preloader

Lightweight helper for lazy-loading images with simple transitions and automatic WebP detection.

### Description

The `preloadImages` function observes images in the DOM (by selector) and loads them when they enter the viewport. It supports priority ordering, simple transitions (`fade`, `slide-in`, `scale`), automatic WebP selection, and a fallback for browsers without `IntersectionObserver`.

### Installation

```
npm install lazy-image-preloader
```

For local development:

```
npm install
# then import from `src/index.js` or build with your bundler
```

### Basic usage

Import and initialize the preloader for a selector of images:

```javascript
import { preloadImages } from 'lazy-image-preloader';

preloadImages('.lazy-img');
```

### Expected HTML

Add `data-src` (and optionally `data-src-webp` and `data-priority`) to your `img` elements:

```html
<img class="lazy-img" data-src="/images/photo.jpg" data-src-webp="/images/photo.webp" data-priority="high" alt="...">
```

### API

`preloadImages(selector, options = {})`

Available options:

- `priority` (string) — Default: `'low'`. Used when an image does not have `data-priority`. Images with `data-priority="high"` are ordered first.
- `transition` (string) — `'fade'` (default), `'slide-in'`, `'scale'` or `'none'`. Controls the animation applied when the image appears.
- `onImageLoaded` (function) — Callback invoked with the `img` element when an image finishes loading.
- `onAllImagesLoaded` (function) — Callback invoked when all images have been loaded.

Return: none. The module also dispatches a DOM custom event `image-loaded` on the `img` element when it finishes loading.

### Events and callbacks

You can listen for the `image-loaded` custom event on each image:

```javascript
document.querySelectorAll('.lazy-img').forEach(img => {
  img.addEventListener('image-loaded', (e) => {
    const loadedImg = e.detail.img;
    // do something with loadedImg
  });
});
```

Or use the function callbacks:

```javascript
preloadImages('.lazy-img', {
  transition: 'slide-in',
  onImageLoaded: (img) => console.log('loaded', img.src),
  onAllImagesLoaded: () => console.log('all images loaded'),
});
```

### Support and fallback

- Detects WebP support at runtime and uses `data-src-webp` when available.
- Uses `IntersectionObserver` when present for efficiency. If not available, falls back to a `scroll`/`resize` based check using `getBoundingClientRect`.

### Edge cases and notes

- If no images match the selector the function logs a `console.warn` and exits gracefully.
- Ensure your `img` elements start with a placeholder (for example a tiny inline image or `src="data:image/gif;base64,..."`) or no `src` until the real source is loaded.

### Tests

This repository includes tests using Jest. To run tests locally:

```
npm install
npm test
```

### Contributing

If you'd like to contribute, open an issue or a pull request. Keep PRs small and add tests for functional changes.
