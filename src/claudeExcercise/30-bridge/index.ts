/**
 * BRIDGE PATTERN
 * Separa abstracción de implementación para que ambas puedan variar independientemente.
 * Evita explosión de subclases.
 *
 * Big Tech: Payment methods x Platforms, UI components x Renderers
 */

// Implementation interface
interface PaymentImplementation {
  processPayment(amount: number): Promise<boolean>;
  refund(transactionId: string, amount: number): Promise<boolean>;
}

// Concrete Implementations
class StripeImplementation implements PaymentImplementation {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`[Stripe] Processing $${amount}`);
    return true;
  }

  async refund(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[Stripe] Refunding $${amount} for ${transactionId}`);
    return true;
  }
}

class PayPalImplementation implements PaymentImplementation {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`[PayPal] Processing $${amount}`);
    return true;
  }

  async refund(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[PayPal] Refunding $${amount} for ${transactionId}`);
    return true;
  }
}

class CryptoImplementation implements PaymentImplementation {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`[Crypto] Processing $${amount} in BTC`);
    return true;
  }

  async refund(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[Crypto] Refunds not supported for blockchain payments`);
    return false;
  }
}

// Abstraction
abstract class PaymentMethod {
  constructor(protected implementation: PaymentImplementation) {}

  abstract pay(amount: number): Promise<boolean>;
  abstract requestRefund(transactionId: string, amount: number): Promise<boolean>;
}

// Refined Abstractions
class OneTimePayment extends PaymentMethod {
  async pay(amount: number): Promise<boolean> {
    console.log(`[OneTimePayment] Initiating one-time payment`);
    return await this.implementation.processPayment(amount);
  }

  async requestRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[OneTimePayment] Requesting refund`);
    return await this.implementation.refund(transactionId, amount);
  }
}

class SubscriptionPayment extends PaymentMethod {
  async pay(amount: number): Promise<boolean> {
    console.log(`[SubscriptionPayment] Initiating recurring payment`);
    // Additional subscription logic
    return await this.implementation.processPayment(amount);
  }

  async requestRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[SubscriptionPayment] Refunding subscription payment`);
    // Additional subscription refund logic
    return await this.implementation.refund(transactionId, amount);
  }
}

class InstallmentPayment extends PaymentMethod {
  constructor(implementation: PaymentImplementation, private installments: number) {
    super(implementation);
  }

  async pay(amount: number): Promise<boolean> {
    const installmentAmount = amount / this.installments;
    console.log(`[InstallmentPayment] Processing ${this.installments} installments of $${installmentAmount}`);

    // Process first installment
    return await this.implementation.processPayment(installmentAmount);
  }

  async requestRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(`[InstallmentPayment] Refunding installment plan`);
    return await this.implementation.refund(transactionId, amount);
  }
}

// Demo
async function demo() {
  console.log('='.repeat(50));
  console.log('BRIDGE PATTERN - Payment Processing');
  console.log('='.repeat(50));

  // One-time payments with different implementations
  console.log('\n1. One-Time Payment via Stripe:');
  const stripeOneTime = new OneTimePayment(new StripeImplementation());
  await stripeOneTime.pay(100);

  console.log('\n2. One-Time Payment via PayPal:');
  const paypalOneTime = new OneTimePayment(new PayPalImplementation());
  await paypalOneTime.pay(100);

  // Subscription with different implementations
  console.log('\n3. Subscription via Stripe:');
  const stripeSubscription = new SubscriptionPayment(new StripeImplementation());
  await stripeSubscription.pay(9.99);

  console.log('\n4. Subscription via Crypto:');
  const cryptoSubscription = new SubscriptionPayment(new CryptoImplementation());
  await cryptoSubscription.pay(9.99);

  // Installments
  console.log('\n5. Installment Payment via PayPal:');
  const paypalInstallments = new InstallmentPayment(new PayPalImplementation(), 3);
  await paypalInstallments.pay(300);

  // Refunds
  console.log('\n6. Refund via Stripe:');
  await stripeOneTime.requestRefund('txn_123', 100);

  console.log('\n7. Refund via Crypto (not supported):');
  await cryptoSubscription.requestRefund('txn_456', 9.99);

  /**
   * Benefits:
   * - Can add new payment types (OneTime, Subscription, Installment) without modifying implementations
   * - Can add new implementations (Stripe, PayPal, Crypto) without modifying payment types
   * - Avoids: OneTimeStripePayment, OneTimePayPalPayment, SubscriptionStripePayment, etc.
   */
}

demo();

/**
 * PREGUNTAS:
 * 1. ¿Bridge vs Adapter difference?
 * 2. ¿Cuándo usar Bridge vs Strategy?
 * 3. ¿Cómo evita explosión de subclases?
 * 4. ¿Payment methods x Platforms = cuántas clases sin Bridge?
 * 5. ¿Bridge viola YAGNI?
 * 6. ¿Cómo testear Bridge?
 * 7. ¿Bridge con dependency injection?
 * 8. ¿Cuándo abstracción e implementación deben variar independientemente?
 */

export { PaymentImplementation, PaymentMethod, OneTimePayment, SubscriptionPayment };
