/**
 * MEMOIZATION PATTERN
 * Cache function results for performance
 *
 * Big Tech: React.memo, useMemo, expensive computations
 */

// Memoization decorator
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, any>();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`[Memo] Cache hit for ${key}`);
      return cache.get(key);
    }

    console.log(`[Memo] Computing for ${key}`);
    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

// Expensive function
function calculateDiscount(amount: number, tier: string): number {
  console.log(`  [Calc] Calculating discount for ${amount}, ${tier}...`);
  // Simulate expensive computation
  let result = amount;
  for (let i = 0; i < 1000000; i++) {
    result += 0.0001;
  }

  const discounts: any = { bronze: 0.05, silver: 0.10, gold: 0.15 };
  return amount * discounts[tier];
}

const memoizedDiscount = memoize(calculateDiscount);

// Demo
console.log('='.repeat(60));
console.log('MEMOIZATION - Discount Calculation');
console.log('='.repeat(60));

console.log('\nFirst call:');
console.log(`Discount: $${memoizedDiscount(1000, 'gold')}`);

console.log('\nSecond call (same args):');
console.log(`Discount: $${memoizedDiscount(1000, 'gold')}`);

console.log('\nThird call (different args):');
console.log(`Discount: $${memoizedDiscount(1000, 'silver')}`);

/**
 * PREGUNTAS:
 * 1. ¿Memoization vs caching?
 * 2. ¿When to memoize?
 * 3. ¿Memory leaks with memoization?
 * 4. ¿Cache invalidation strategies?
 * 5. ¿Memoization in React (useMemo, React.memo)?
 * 6. ¿LRU cache for memoization?
 * 7. ¿Memoization with impure functions?
 * 8. ¿Performance trade-offs?
 */

export { memoize };
