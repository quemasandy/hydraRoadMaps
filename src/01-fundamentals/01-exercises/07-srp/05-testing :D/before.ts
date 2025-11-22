
// ❌ BEFORE: Hard to Test
// This class creates its own dependencies internally.
// To test 'calculateFee', you are FORCED to make real HTTP calls or use complex mocks.

import axios from 'axios'; // Hard dependency

export class PaymentService {
  async processPayment(amount: number) {
    // Logic we want to test:
    if (amount <= 0) throw new Error('Invalid amount');

    // Side effect we want to avoid during tests:
    // This will actually try to hit the Stripe API!
    await axios.post('https://api.stripe.com/charge', { amount });
    
    return 'Success';
  }
}
