// test/index.test.js
import { preloadImages } from '../src/index.js';

describe('preloadImages', () => {
  beforeEach(() => {
    // Reset document body
    document.body.innerHTML = '';
    // Mock console.warn
    console.warn = jest.fn();
  });

  test('should warn if no images are found', () => {
    preloadImages('.non-existent');
    expect(console.warn).toHaveBeenCalledWith('No images found for selector:', '.non-existent');
  });

  test('should observe images with IntersectionObserver', () => {
    // Mock IntersectionObserver
    const observe = jest.fn();
    const unobserve = jest.fn();
    global.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve,
    }));

    // Create a test image
    document.body.innerHTML = '<img class="lazy-img" data-src="test.jpg">';
    preloadImages('.lazy-img', { priority: 'high', transition: 'fade' });

    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(observe).toHaveBeenCalledWith(document.querySelector('.lazy-img'));
  });
});