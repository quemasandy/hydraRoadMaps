/**
 * PROMISE PATTERNS
 * Promise.all, Promise.race, Promise.allSettled, chaining
 *
 * Big Tech: Async operations, parallel processing, timeouts
 */

// Parallel execution
async function fetchAllData() {
  const [user, orders, payments] = await Promise.all([
    fetchUser(),
    fetchOrders(),
    fetchPayments()
  ]);
  return { user, orders, payments };
}

// Race (timeout pattern)
async function fetchWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeout)
  );
  return Promise.race([promise, timeoutPromise]);
}

// Helper functions
async function fetchUser() {
  await delay(100);
  return { id: '1', name: 'Alice' };
}

async function fetchOrders() {
  await delay(200);
  return [{ id: 'ord_1' }];
}

async function fetchPayments() {
  await delay(150);
  return [{ id: 'pay_1' }];
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Demo
console.log('='.repeat(60));
console.log('PROMISE PATTERNS');
console.log('='.repeat(60));

(async () => {
  const data = await fetchAllData();
  console.log('Fetched:', data);

  try {
    await fetchWithTimeout(delay(2000), 1000);
  } catch (e: any) {
    console.log('Timeout:', e.message);
  }
})();

/**
 * PREGUNTAS:
 * 1. ¿Promise.all vs Promise.allSettled?
 * 2. ¿Promise.race use cases?
 * 3. ¿Error handling in Promise.all?
 * 4. ¿Sequential vs parallel?
 * 5. ¿Promise chaining best practices?
 * 6. ¿Promise cancellation?
 * 7. ¿AbortController with promises?
 * 8. ¿Promise memory leaks?
 */

export { fetchWithTimeout };
