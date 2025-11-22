
// ✅ AFTER: Easy to Test
// We ask for the dependency in the constructor (Dependency Injection).
// In tests, we pass a "Fake" version. In production, we pass the "Real" version.

// 1. The Contract
interface PaymentProvider {
  charge(amount: number): Promise<void>;
}

// 2. The Class under test
export class PaymentService {
  constructor(private provider: PaymentProvider) {}

  async processPayment(amount: number) {
    if (amount <= 0) throw new Error('Invalid amount');
    
    // We don't know (or care) if this is Stripe, PayPal, or a Fake.
    await this.provider.charge(amount);
    
    return 'Success';
  }
}

// 3. The Real Implementation (for Production)
export class StripeProvider implements PaymentProvider {
  async charge(amount: number) {
    // await axios.post(...)
    console.log('Calling Real Stripe API...');
  }
}

// 4. The Fake Implementation (for Tests)
// No network calls! Fast and deterministic.
export class MockPaymentProvider implements PaymentProvider {
  async charge(amount: number) {
    console.log('Mock charge called - nothing really happened');
    return Promise.resolve();
  }
}

// Test Usage:
// const service = new PaymentService(new MockPaymentProvider());
// service.processPayment(100); // Safe!
