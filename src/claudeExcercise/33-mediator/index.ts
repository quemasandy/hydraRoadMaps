/**
 * MEDIATOR PATTERN
 * Define un objeto que encapsula cómo interactúan un conjunto de objetos.
 * Promueve loose coupling evitando que los objetos se refieran explícitamente entre sí.
 *
 * Big Tech: Message brokers (RabbitMQ, Kafka), API Gateway, Orchestration services
 */

// Mediator interface
interface PaymentMediator {
  notify(sender: Component, event: string, data?: any): Promise<void>;
}

// Base Component
abstract class Component {
  protected mediator: PaymentMediator;

  constructor(mediator: PaymentMediator) {
    this.mediator = mediator;
  }

  setMediator(mediator: PaymentMediator): void {
    this.mediator = mediator;
  }
}

// Components that communicate through mediator

// 1. Card Validator
class CardValidator extends Component {
  async validate(cardNumber: string, cvv: string, expiry: string): Promise<boolean> {
    console.log(`[CardValidator] Validating card ending in ${cardNumber.slice(-4)}...`);

    // Simple validation
    const isValid = cardNumber.length === 16 && cvv.length === 3;

    if (isValid) {
      console.log(`[CardValidator] ✓ Card valid`);
      await this.mediator.notify(this, 'card_validated', { cardNumber });
    } else {
      console.log(`[CardValidator] ✗ Card invalid`);
      await this.mediator.notify(this, 'card_invalid');
    }

    return isValid;
  }
}

// 2. Fraud Detection
class FraudDetector extends Component {
  async check(amount: number, cardNumber: string): Promise<boolean> {
    console.log(`[FraudDetector] Analyzing transaction for $${amount}...`);

    // Simulate fraud check
    await new Promise(resolve => setTimeout(resolve, 50));

    const isSafe = amount < 10000 && Math.random() > 0.1; // 90% pass rate

    if (isSafe) {
      console.log(`[FraudDetector] ✓ Transaction looks safe`);
      await this.mediator.notify(this, 'fraud_check_passed', { amount });
    } else {
      console.log(`[FraudDetector] ⚠️  Suspicious activity detected`);
      await this.mediator.notify(this, 'fraud_detected', { amount });
    }

    return isSafe;
  }
}

// 3. Payment Processor
class PaymentGateway extends Component {
  async processCharge(amount: number, cardToken: string): Promise<string> {
    console.log(`[PaymentGateway] Processing charge of $${amount}...`);

    // Simulate gateway delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const transactionId = `txn_${Date.now()}`;

    console.log(`[PaymentGateway] ✓ Payment processed: ${transactionId}`);
    await this.mediator.notify(this, 'payment_processed', { transactionId, amount });

    return transactionId;
  }

  async refund(transactionId: string, amount: number): Promise<void> {
    console.log(`[PaymentGateway] Refunding ${transactionId}...`);
    await this.mediator.notify(this, 'refund_processed', { transactionId, amount });
  }
}

// 4. Notification Service
class NotificationService extends Component {
  async sendSuccessEmail(transactionId: string, amount: number): Promise<void> {
    console.log(`[Notification] 📧 Sending success email for ${transactionId} ($${amount})`);
  }

  async sendFailureEmail(reason: string): Promise<void> {
    console.log(`[Notification] 📧 Sending failure email: ${reason}`);
  }

  async sendFraudAlert(amount: number): Promise<void> {
    console.log(`[Notification] 🚨 Sending fraud alert for $${amount}`);
  }
}

// 5. Accounting System
class AccountingService extends Component {
  private balance = 0;

  async recordRevenue(amount: number, transactionId: string): Promise<void> {
    this.balance += amount;
    console.log(`[Accounting] 💰 Recorded revenue: +$${amount} | Balance: $${this.balance}`);
  }

  async recordRefund(amount: number): Promise<void> {
    this.balance -= amount;
    console.log(`[Accounting] 💸 Recorded refund: -$${amount} | Balance: $${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

// Concrete Mediator: Payment Orchestrator
class PaymentOrchestrator implements PaymentMediator {
  private cardValidator: CardValidator;
  private fraudDetector: FraudDetector;
  private gateway: PaymentGateway;
  private notifications: NotificationService;
  private accounting: AccountingService;

  constructor() {
    // Create components
    this.cardValidator = new CardValidator(this);
    this.fraudDetector = new FraudDetector(this);
    this.gateway = new PaymentGateway(this);
    this.notifications = new NotificationService(this);
    this.accounting = new AccountingService(this);
  }

  // Orchestrate the payment flow based on events
  async notify(sender: Component, event: string, data?: any): Promise<void> {
    console.log(`  [Orchestrator] Event received: ${event}`);

    switch (event) {
      case 'card_validated':
        // Card validated → run fraud check
        break;

      case 'card_invalid':
        await this.notifications.sendFailureEmail('Invalid card information');
        break;

      case 'fraud_check_passed':
        // Fraud check passed → process payment
        break;

      case 'fraud_detected':
        await this.notifications.sendFraudAlert(data.amount);
        break;

      case 'payment_processed':
        // Payment processed → record accounting + send notification
        await this.accounting.recordRevenue(data.amount, data.transactionId);
        await this.notifications.sendSuccessEmail(data.transactionId, data.amount);
        break;

      case 'refund_processed':
        await this.accounting.recordRefund(data.amount);
        await this.notifications.sendSuccessEmail(data.transactionId, data.amount);
        break;
    }
  }

  // Public API: Process Payment (orchestrates all components)
  async processPayment(cardNumber: string, cvv: string, expiry: string, amount: number): Promise<boolean> {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Processing payment: $${amount}`);
    console.log('='.repeat(50));

    // Step 1: Validate card
    const cardValid = await this.cardValidator.validate(cardNumber, cvv, expiry);
    if (!cardValid) {
      console.log('❌ Payment failed: Card validation failed\n');
      return false;
    }

    // Step 2: Fraud check
    const fraudCheckPassed = await this.fraudDetector.check(amount, cardNumber);
    if (!fraudCheckPassed) {
      console.log('❌ Payment failed: Fraud detected\n');
      return false;
    }

    // Step 3: Process charge
    const transactionId = await this.gateway.processCharge(amount, cardNumber);

    console.log(`✅ Payment successful: ${transactionId}\n`);
    return true;
  }

  getAccountingBalance(): number {
    return this.accounting.getBalance();
  }

  // Expose gateway for refunds
  async issueRefund(transactionId: string, amount: number): Promise<void> {
    await this.gateway.refund(transactionId, amount);
  }
}

// Demo
async function demo() {
  console.log('='.repeat(60));
  console.log('MEDIATOR PATTERN - Payment Orchestration');
  console.log('='.repeat(60));

  const orchestrator = new PaymentOrchestrator();

  // Process multiple payments
  await orchestrator.processPayment('4111111111111111', '123', '12/25', 99.99);
  await orchestrator.processPayment('4111111111111111', '123', '12/25', 249.50);
  await orchestrator.processPayment('invalid', '12', '12/25', 149.99); // Invalid card
  await orchestrator.processPayment('4111111111111111', '123', '12/25', 15000); // High risk

  // Issue refund
  console.log('\n--- Issuing Refund ---');
  await orchestrator.issueRefund('txn_123', 99.99);

  // Final balance
  console.log('\n--- Final State ---');
  console.log(`Accounting Balance: $${orchestrator.getAccountingBalance()}`);
}

demo();

/**
 * Real-world example: Checkout Flow Mediator
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: E-commerce Checkout Mediator');
console.log('='.repeat(60));

interface CheckoutMediator {
  notify(event: string, data?: any): void;
}

class Cart {
  constructor(private mediator: CheckoutMediator) {}

  validate(): boolean {
    console.log('[Cart] Validating items...');
    this.mediator.notify('cart_validated');
    return true;
  }
}

class ShippingCalculator {
  constructor(private mediator: CheckoutMediator) {}

  calculate(address: string): number {
    console.log('[Shipping] Calculating shipping cost...');
    const cost = 15.99;
    this.mediator.notify('shipping_calculated', { cost });
    return cost;
  }
}

class TaxCalculator {
  constructor(private mediator: CheckoutMediator) {}

  calculate(subtotal: number, state: string): number {
    console.log('[Tax] Calculating tax...');
    const tax = subtotal * 0.08; // 8% tax
    this.mediator.notify('tax_calculated', { tax });
    return tax;
  }
}

class CheckoutOrchestrator implements CheckoutMediator {
  private cart: Cart;
  private shipping: ShippingCalculator;
  private tax: TaxCalculator;
  private totals = { subtotal: 0, shipping: 0, tax: 0, total: 0 };

  constructor() {
    this.cart = new Cart(this);
    this.shipping = new ShippingCalculator(this);
    this.tax = new TaxCalculator(this);
  }

  notify(event: string, data?: any): void {
    console.log(`  [Orchestrator] ${event}`);

    if (event === 'shipping_calculated') {
      this.totals.shipping = data.cost;
    } else if (event === 'tax_calculated') {
      this.totals.tax = data.tax;
    }
  }

  async checkout(subtotal: number, address: string, state: string): Promise<number> {
    console.log('\n--- Starting Checkout ---');
    this.totals.subtotal = subtotal;

    this.cart.validate();
    this.shipping.calculate(address);
    this.tax.calculate(subtotal, state);

    this.totals.total = this.totals.subtotal + this.totals.shipping + this.totals.tax;

    console.log('\n--- Order Summary ---');
    console.log(`Subtotal: $${this.totals.subtotal.toFixed(2)}`);
    console.log(`Shipping: $${this.totals.shipping.toFixed(2)}`);
    console.log(`Tax:      $${this.totals.tax.toFixed(2)}`);
    console.log(`Total:    $${this.totals.total.toFixed(2)}`);

    return this.totals.total;
  }
}

const checkout = new CheckoutOrchestrator();
checkout.checkout(199.99, '123 Main St', 'CA');

/**
 * PREGUNTAS:
 * 1. ¿Mediator vs Observer difference?
 * 2. ¿Cuándo usar Mediator vs direct communication?
 * 3. ¿Cómo Kafka actúa como mediator?
 * 4. ¿Mediator pattern en microservices (API Gateway)?
 * 5. ¿God object antipattern en Mediator?
 * 6. ¿Testing de mediator vs components individuales?
 * 7. ¿Mediator vs Facade difference?
 * 8. ¿Event-driven architecture con Mediator?
 */

export { PaymentOrchestrator, PaymentMediator, Component };
