/**
 * Circuit Breaker Pattern for Serverless
 *
 * Protege servicios externos de sobrecarga y evita cascading failures
 */

interface CircuitState {
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime?: number;
  successCount: number;
}

export class CircuitBreaker {
  private state: CircuitState;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private readonly successThreshold: number;

  constructor(
    failureThreshold: number = 5,
    resetTimeout: number = 60000,
    successThreshold: number = 2,
  ) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.successThreshold = successThreshold;
    this.state = {
      status: 'CLOSED',
      failureCount: 0,
      successCount: 0,
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state.status === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state.status = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.state.failureCount = 0;

    if (this.state.status === 'HALF_OPEN') {
      this.state.successCount++;
      if (this.state.successCount >= this.successThreshold) {
        this.state.status = 'CLOSED';
        this.state.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();

    if (this.state.failureCount >= this.failureThreshold) {
      this.state.status = 'OPEN';
    }
  }

  private shouldAttemptReset(): boolean {
    return (
      this.state.lastFailureTime !== undefined &&
      Date.now() - this.state.lastFailureTime >= this.resetTimeout
    );
  }

  getState(): CircuitState {
    return { ...this.state };
  }
}

/**
 * Usage example with external API call
 */
const breaker = new CircuitBreaker(5, 60000, 2);

export async function callExternalAPI(url: string) {
  return breaker.execute(async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  });
}

/**
 * ============================================================================
 * Retry Pattern with Exponential Backoff
 * ============================================================================
 */

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      }
    }
  }

  throw lastError!;
}

/**
 * ============================================================================
 * Bulkhead Pattern
 * ============================================================================
 * Aislar recursos para prevenir que un componente consuma todos los recursos
 */

export class Bulkhead {
  private activeRequests: number = 0;
  private readonly maxConcurrent: number;

  constructor(maxConcurrent: number) {
    this.maxConcurrent = maxConcurrent;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.activeRequests >= this.maxConcurrent) {
      throw new Error('Bulkhead full - request rejected');
    }

    this.activeRequests++;
    try {
      return await fn();
    } finally {
      this.activeRequests--;
    }
  }
}

/**
 * Lambda-specific: Use Reserved Concurrency for bulkhead isolation
 *
 * En SAM template:
 *   CriticalFunction:
 *     Type: AWS::Serverless::Function
 *     Properties:
 *       ReservedConcurrentExecutions: 10  # Max 10 concurrent executions
 */
