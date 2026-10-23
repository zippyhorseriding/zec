type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 10;
const MAX_BUCKETS = 5000;

/**
 * Small in-memory rate limiter for form submissions.
 *
 * This is intentionally dependency-free. On serverless hosting each instance has
 * its own memory, so it is a best-effort abuse guard rather than a hard limit.
 * The honeypot field in the enquiry parser is the primary spam defence.
 */
export function consumeRateLimit(key: string): boolean {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (existing.count >= MAX_REQUESTS) {
    return false;
  }

  existing.count += 1;
  return true;
}
