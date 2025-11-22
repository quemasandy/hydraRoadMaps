/**
 * ASYNC/AWAIT PATTERNS
 * Sequential vs parallel, error handling
 *
 * Big Tech: Modern async code, API calls, database operations
 */

// Sequential execution
async function processPaymentsSequential(amounts: number[]) {
  console.log('[Sequential] Processing...');
  const start = Date.now();

  for (const amount of amounts) {
    await processPayment(amount);
  }

  console.log(`[Sequential] Done in ${Date.now() - start}ms`);
}

// Parallel execution
async function processPaymentsParallel(amounts: number[]) {
  console.log('[Parallel] Processing...');
  const start = Date.now();

  await Promise.all(amounts.map(amount => processPayment(amount)));

  console.log(`[Parallel] Done in ${Date.now() - start}ms`);
}

async function processPayment(amount: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log(`  Processed $${amount}`);
}

// Error handling
async function safeProcessPayment(amount: number): Promise<string> {
  try {
    if (amount <= 0) throw new Error('Invalid amount');
    await processPayment(amount);
    return 'success';
  } catch (error) {
    console.error(`Error:`, error);
    return 'failed';
  }
}

// Demo
console.log('='.repeat(60));
console.log('ASYNC/AWAIT PATTERNS');
console.log('='.repeat(60));

(async () => {
  await processPaymentsSequential([100, 200]);
  await processPaymentsParallel([100, 200]);
})();

/**
 * PREGUNTAS:
 * 1. ¿Async/await vs promises?
 * 2. ¿Top-level await?
 * 3. ¿Async function return type?
 * 4. ¿Error handling patterns?
 * 5. ¿Async/await with loops?
 * 6. ¿Performance considerations?
 * 7. ¿Async/await in TypeScript?
 * 8. ¿Debugging async code?
 */

export { processPaymentsParallel };
