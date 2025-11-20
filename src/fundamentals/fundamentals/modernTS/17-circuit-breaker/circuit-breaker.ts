/**
 * MODERN TS: Circuit Breaker (Functional Wrapper)
 *
 * En OOP: Clase `CircuitBreaker` que envuelve un servicio.
 * En Modern TS: Higher-Order Function `withCircuitBreaker(fn)`.
 */

const withCircuitBreaker = <Args extends any[], Return>(
  fn: (...args: Args) => Promise<Return>,
  threshold = 3
) => {
  let failures = 0;
  let isOpen = false;

  return async (...args: Args): Promise<Return> => {
    if (isOpen) throw new Error('Circuit Open');

    try {
      const result = await fn(...args);
      failures = 0; // Reset on success
      return result;
    } catch (e) {
      failures++;
      if (failures >= threshold) {
        isOpen = true;
        setTimeout(() => (isOpen = false), 3000); // Reset after 3s
      }
      throw e;
    }
  };
};

// Uso
const unstableApi = async () => {
  if (Math.random() > 0.5) throw new Error('Fail');
  return 'Success';
};

const safeApi = withCircuitBreaker(unstableApi);
// safeApi().then(...)
