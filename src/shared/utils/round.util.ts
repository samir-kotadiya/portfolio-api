import crypto from 'crypto';
export function roundShares(value: number, precision: number): number {

    const factor = Math.pow(10, precision);

    return Math.floor(value * factor) / factor;
}

/**
 * Generates a stable idempotency key from a JSON object.
 */
export function  generateIdempotencyKey(payload: any) {
  // 1. Canonicalise: Sort keys alphabetically for a consistent string
  const sortedPayload = JSON.stringify(payload, Object.keys(payload).sort());

  // 2. Hash: Use SHA-256 for a collision-resistant unique ID
  return crypto
    .createHash('sha256')
    .update(sortedPayload)
    .digest('hex');
}