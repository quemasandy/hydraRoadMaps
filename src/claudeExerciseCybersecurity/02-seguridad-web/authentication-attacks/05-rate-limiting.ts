/**
 * Advanced Rate Limiting Strategies
 */

export class SlidingWindowRateLimiter {
    private requests: Map<string, number[]> = new Map();

    constructor(
        private maxRequests: number,
        private windowMs: number
    ) {}

    tryRequest(identifier: string): boolean {
        const now = Date.now();
        const timestamps = this.requests.get(identifier) || [];

        // Filtrar requests fuera de ventana
        const validTimestamps = timestamps.filter(
            ts => now - ts < this.windowMs
        );

        if (validTimestamps.length >= this.maxRequests) {
            return false;
        }

        validTimestamps.push(now);
        this.requests.set(identifier, validTimestamps);
        return true;
    }
}

export class TokenBucketRateLimiter {
    private buckets: Map<string, { tokens: number; lastRefill: number }> = new Map();

    constructor(
        private capacity: number,
        private refillRate: number // tokens por segundo
    ) {}

    tryConsume(identifier: string): boolean {
        const now = Date.now();
        let bucket = this.buckets.get(identifier);

        if (!bucket) {
            bucket = { tokens: this.capacity, lastRefill: now };
            this.buckets.set(identifier, bucket);
        }

        // Refill tokens
        const elapsed = (now - bucket.lastRefill) / 1000;
        bucket.tokens = Math.min(
            this.capacity,
            bucket.tokens + elapsed * this.refillRate
        );
        bucket.lastRefill = now;

        if (bucket.tokens >= 1) {
            bucket.tokens -= 1;
            return true;
        }

        return false;
    }
}

export function demonstrateRateLimiters(): void {
    console.log('\n=== Rate Limiting Strategies ===\n');

    console.log('1. Sliding Window:');
    const sliding = new SlidingWindowRateLimiter(3, 5000); // 3 requests per 5s

    for (let i = 0; i < 5; i++) {
        const allowed = sliding.tryRequest('user1');
        console.log(`   Request ${i + 1}: ${allowed ? '✅' : '❌'}`);
    }

    console.log('\n2. Token Bucket:');
    const bucket = new TokenBucketRateLimiter(5, 1); // 5 tokens, refill 1/s

    for (let i = 0; i < 7; i++) {
        const allowed = bucket.tryConsume('user2');
        console.log(`   Request ${i + 1}: ${allowed ? '✅' : '❌'}`);
    }
}

if (require.main === module) {
    demonstrateRateLimiters();
}
