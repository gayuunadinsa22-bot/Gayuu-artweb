/**
 * Simple in-memory sliding-window rate limiter for public API routes.
 *
 * NOTE: this is per-server-instance (fine for a single Node deployment /
 * `next start`; on serverless each instance has its own memory). For
 * multi-instance deployments swap in a Redis-backed limiter — the
 * `checkRateLimit` call sites stay the same.
 */

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

/** Prevents unbounded memory growth from unique keys (e.g. random IPs). */
const MAX_KEYS = 5000;

export interface RateLimitResult {
  ok: boolean;
  /** Seconds the caller should wait before retrying (when not ok). */
  retryAfterSec: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= MAX_KEYS) {
      // Drop the oldest buckets (insertion-ordered by Map).
      const oldest = buckets.keys().next().value;
      if (oldest !== undefined) buckets.delete(oldest);
    }
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }

  // Keep only hits inside the current window.
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const oldestHit = bucket.hits[0] ?? now;
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((oldestHit + windowMs - now) / 1000)),
    };
  }

  bucket.hits.push(now);
  return { ok: true, retryAfterSec: 0 };
}
