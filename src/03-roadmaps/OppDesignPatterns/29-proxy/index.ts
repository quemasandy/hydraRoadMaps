/**
 * PROXY PATTERN
 * Provee un sustituto o placeholder para controlar acceso a otro objeto.
 * Tipos: Virtual, Protection, Remote, Caching, Logging
 *
 * Big Tech: CDN (proxy para contenido), API rate limiting, lazy loading
 */

// Subject interface
interface PaymentGateway {
  processPayment(amount: number, cardToken: string): Promise<PaymentResult>;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

// Real Subject (expensive to create/use)
class RealPaymentGateway implements PaymentGateway {
  constructor() {
    console.log('[RealGateway] Initializing connection (expensive)...');
    // Simulate expensive initialization
  }

  async processPayment(amount: number, cardToken: string): Promise<PaymentResult> {
    console.log(`[RealGateway] Processing $${amount}...`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      transactionId: 'txn_' + Date.now(),
      message: 'Payment processed successfully'
    };
  }
}

// Virtual Proxy: Lazy initialization
class LazyPaymentGatewayProxy implements PaymentGateway {
  private realGateway: RealPaymentGateway | null = null;

  async processPayment(amount: number, cardToken: string): Promise<PaymentResult> {
    // Create real object only when needed
    if (!this.realGateway) {
      console.log('[Proxy] First use - creating real gateway');
      this.realGateway = new RealPaymentGateway();
    }

    return this.realGateway.processPayment(amount, cardToken);
  }
}

// Protection Proxy: Access control
class ProtectionPaymentProxy implements PaymentGateway {
  constructor(
    private realGateway: PaymentGateway,
    private userRole: string
  ) {}

  async processPayment(amount: number, cardToken: string): Promise<PaymentResult> {
    // Check permissions
    if (this.userRole !== 'admin' && amount > 1000) {
      console.log('[Proxy] Access denied: Large payment requires admin');
      return {
        success: false,
        transactionId: '',
        message: 'Insufficient permissions for large payments'
      };
    }

    console.log('[Proxy] Access granted');
    return this.realGateway.processPayment(amount, cardToken);
  }
}

// Caching Proxy
class CachingPaymentProxy implements PaymentGateway {
  private cache = new Map<string, PaymentResult>();

  constructor(private realGateway: PaymentGateway) {}

  async processPayment(amount: number, cardToken: string): Promise<PaymentResult> {
    const cacheKey = `${amount}-${cardToken}`;

    // Check cache (for idempotency)
    if (this.cache.has(cacheKey)) {
      console.log('[Proxy] Returning cached result (duplicate request)');
      return this.cache.get(cacheKey)!;
    }

    // Process and cache
    console.log('[Proxy] Cache miss - processing');
    const result = await this.realGateway.processPayment(amount, cardToken);
    this.cache.set(cacheKey, result);

    return result;
  }
}

// Logging Proxy
class LoggingPaymentProxy implements PaymentGateway {
  constructor(private realGateway: PaymentGateway) {}

  async processPayment(amount: number, cardToken: string): Promise<PaymentResult> {
    const start = Date.now();
    console.log(`[Proxy] Payment started: $${amount}`);

    try {
      const result = await this.realGateway.processPayment(amount, cardToken);
      const duration = Date.now() - start;

      console.log(`[Proxy] Payment completed in ${duration}ms: ${result.transactionId}`);
      return result;
    } catch (error) {
      console.log(`[Proxy] Payment failed:`, error);
      throw error;
    }
  }
}

// Rate Limiting Proxy
class RateLimitingProxy implements PaymentGateway {
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly maxRequests = 10;
  private readonly windowMs = 60000; // 1 minute

  constructor(private realGateway: PaymentGateway) {}

  async processPayment(amount: number, cardToken: string): Promise<PaymentResult> {
    // Reset window if needed
    if (Date.now() - this.windowStart > this.windowMs) {
      this.requestCount = 0;
      this.windowStart = Date.now();
    }

    // Check rate limit
    if (this.requestCount >= this.maxRequests) {
      console.log('[Proxy] Rate limit exceeded');
      return {
        success: false,
        transactionId: '',
        message: 'Rate limit exceeded. Try again later.'
      };
    }

    this.requestCount++;
    console.log(`[Proxy] Request ${this.requestCount}/${this.maxRequests}`);

    return this.realGateway.processPayment(amount, cardToken);
  }
}

// Demo
async function demo() {
  console.log('='.repeat(50));
  console.log('PROXY PATTERN - Payment Gateway');
  console.log('='.repeat(50));

  console.log('\n1. Lazy Proxy:');
  const lazyProxy = new LazyPaymentGatewayProxy();
  await lazyProxy.processPayment(100, 'tok_visa');
  await lazyProxy.processPayment(200, 'tok_visa');

  console.log('\n2. Protection Proxy:');
  const realGateway = new RealPaymentGateway();
  const protectedProxy = new ProtectionPaymentProxy(realGateway, 'user');
  await protectedProxy.processPayment(500, 'tok_visa');
  await protectedProxy.processPayment(2000, 'tok_visa'); // Denied

  console.log('\n3. Caching Proxy (Idempotency):');
  const cachingProxy = new CachingPaymentProxy(new RealPaymentGateway());
  await cachingProxy.processPayment(300, 'tok_123');
  await cachingProxy.processPayment(300, 'tok_123'); // From cache

  console.log('\n4. Logging Proxy:');
  const loggingProxy = new LoggingPaymentProxy(new RealPaymentGateway());
  await loggingProxy.processPayment(400, 'tok_visa');
}

demo();

/**
 * PREGUNTAS:
 * 1. ¿Proxy vs Decorator difference?
 * 2. ¿Cuándo usar cada tipo de proxy?
 * 3. ¿Cómo Stripe usa proxy para rate limiting?
 * 4. ¿Proxy transparente vs no-transparente?
 * 5. ¿Performance overhead de proxies?
 * 6. ¿Cómo combinar múltiples proxies?
 * 7. ¿Proxy para mocking en tests?
 * 8. ¿ES6 Proxy vs Proxy pattern?
 */

export { PaymentGateway, RealPaymentGateway, LazyPaymentGatewayProxy, ProtectionPaymentProxy };
