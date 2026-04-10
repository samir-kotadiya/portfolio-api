type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

class Cache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Set value in cache with TTL (seconds)
   */
  set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;

    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Delete key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }
}

export default new Cache();