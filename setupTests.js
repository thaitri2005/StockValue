// setupTests.js
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// This goes in your setupTests.js or a similar file included in your Jest setup.

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observations = new Map();
  }

  observe(target, options) {
    this.observations.set(target, options);
    // Optionally, you can trigger the callback with mock entries if your test depends on ResizeObserver's behavior
    this.callback(
      [{ target, contentRect: target.getBoundingClientRect() }],
      this,
    );
  }

  unobserve(target) {
    this.observations.delete(target);
  }

  disconnect() {
    this.observations.clear();
  }
};

// Mock for requestAnimationFrame (if needed)
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

// Mock for cancelAnimationFrame (if needed)
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};
