const CacheManager = require('../../src/cache/cacheManager'); // Ensure path correctness

describe('CacheManager', () => {
  let cacheManager;

  beforeEach(() => {
    // Create a new instance for each test to prevent state sharing
    cacheManager = new CacheManager();
  });

  test('sets and gets a value correctly', () => {
    cacheManager.set('testKey', 'testValue');
    expect(cacheManager.get('testKey')).toBe('testValue');
  });

  test('checks if a key exists', () => {
    cacheManager.set('exists', 'yes');
    expect(cacheManager.has('exists')).toBeTruthy();
    expect(cacheManager.has('doesNotExist')).toBeFalsy();
  });

  test('deletes a key correctly', () => {
    cacheManager.set('toDelete', 'deleteMe');
    expect(cacheManager.has('toDelete')).toBeTruthy();
    cacheManager.delete('toDelete');
    expect(cacheManager.has('toDelete')).toBeFalsy();
  });

  test('clears the cache correctly', () => {
    cacheManager.set('key1', 'value1');
    cacheManager.set('key2', 'value2');
    cacheManager.clear();
    expect(cacheManager.has('key1')).toBeFalsy();
    expect(cacheManager.has('key2')).toBeFalsy();
  });

  test('returns the correct size of the cache', () => {
    expect(cacheManager.size()).toBe(0);
    cacheManager.set('key1', 'value1');
    cacheManager.set('key2', 'value2');
    expect(cacheManager.size()).toBe(2);
    cacheManager.delete('key1');
    expect(cacheManager.size()).toBe(1);
  });
});
