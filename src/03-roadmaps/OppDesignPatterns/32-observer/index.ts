/**
 * OBSERVER PATTERN
 * Define una dependencia uno-a-muchos entre objetos para que cuando uno cambie estado,
 * todos sus dependientes sean notificados automáticamente.
 *
 * Big Tech: Event-driven architectures, Pub/Sub (AWS SNS, Google Pub/Sub), Webhooks
 */

// Subject interface
interface PaymentSubject {
  attach(observer: PaymentObserver): void;
  detach(observer: PaymentObserver): void;
  notify(event: PaymentEvent): void;
}

// Observer interface
interface PaymentObserver {
  update(event: PaymentEvent): void;
  getName(): string;
}

// Event data
interface PaymentEvent {
  type: 'payment_succeeded' | 'payment_failed' | 'refund_issued' | 'chargeback';
  paymentId: string;
  amount: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Concrete Subject: Payment Processor
class PaymentProcessor implements PaymentSubject {
  private observers: PaymentObserver[] = [];
  private events: PaymentEvent[] = [];

  attach(observer: PaymentObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      console.log(`[Processor] Observer ${observer.getName()} already attached`);
      return;
    }

    console.log(`[Processor] ✓ Attached observer: ${observer.getName()}`);
    this.observers.push(observer);
  }

  detach(observer: PaymentObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log(`[Processor] Observer ${observer.getName()} not found`);
      return;
    }

    this.observers.splice(observerIndex, 1);
    console.log(`[Processor] ✗ Detached observer: ${observer.getName()}`);
  }

  notify(event: PaymentEvent): void {
    console.log(`\n[Processor] 📢 Notifying ${this.observers.length} observers about: ${event.type}`);
    this.events.push(event);

    for (const observer of this.observers) {
      observer.update(event);
    }
  }

  // Business methods that trigger notifications
  async processPayment(paymentId: string, amount: number): Promise<void> {
    console.log(`\n[Processor] Processing payment ${paymentId} for $${amount}...`);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));

    const success = Math.random() > 0.2; // 80% success rate

    if (success) {
      this.notify({
        type: 'payment_succeeded',
        paymentId,
        amount,
        timestamp: new Date(),
        metadata: { processor: 'Stripe' }
      });
    } else {
      this.notify({
        type: 'payment_failed',
        paymentId,
        amount,
        timestamp: new Date(),
        metadata: { reason: 'Insufficient funds' }
      });
    }
  }

  async issueRefund(paymentId: string, amount: number): Promise<void> {
    console.log(`\n[Processor] Issuing refund for ${paymentId}...`);

    this.notify({
      type: 'refund_issued',
      paymentId,
      amount,
      timestamp: new Date()
    });
  }

  getEventHistory(): PaymentEvent[] {
    return this.events;
  }
}

// Concrete Observers

// 1. Email Service (sends notifications)
class EmailNotificationService implements PaymentObserver {
  update(event: PaymentEvent): void {
    console.log(`  [Email] 📧 Sending email for ${event.type}`);

    switch (event.type) {
      case 'payment_succeeded':
        console.log(`    → "Payment of $${event.amount} successful!"`);
        break;
      case 'payment_failed':
        console.log(`    → "Payment of $${event.amount} failed. Please update payment method."`);
        break;
      case 'refund_issued':
        console.log(`    → "Refund of $${event.amount} has been processed."`);
        break;
    }
  }

  getName(): string {
    return 'EmailNotificationService';
  }
}

// 2. Accounting System (records transactions)
class AccountingSystem implements PaymentObserver {
  private ledger: Array<{ event: string; amount: number; balance: number }> = [];
  private balance = 0;

  update(event: PaymentEvent): void {
    console.log(`  [Accounting] 💰 Recording transaction: ${event.type}`);

    switch (event.type) {
      case 'payment_succeeded':
        this.balance += event.amount;
        this.ledger.push({ event: event.type, amount: event.amount, balance: this.balance });
        console.log(`    → Credit: +$${event.amount} | Balance: $${this.balance}`);
        break;
      case 'refund_issued':
      case 'chargeback':
        this.balance -= event.amount;
        this.ledger.push({ event: event.type, amount: -event.amount, balance: this.balance });
        console.log(`    → Debit: -$${event.amount} | Balance: $${this.balance}`);
        break;
      case 'payment_failed':
        console.log(`    → No accounting entry (payment failed)`);
        break;
    }
  }

  getName(): string {
    return 'AccountingSystem';
  }

  getBalance(): number {
    return this.balance;
  }

  getLedger() {
    return this.ledger;
  }
}

// 3. Analytics Service (tracks metrics)
class AnalyticsService implements PaymentObserver {
  private metrics = {
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    refunds: 0,
    totalRevenue: 0
  };

  update(event: PaymentEvent): void {
    console.log(`  [Analytics] 📊 Tracking metric: ${event.type}`);

    switch (event.type) {
      case 'payment_succeeded':
        this.metrics.totalPayments++;
        this.metrics.successfulPayments++;
        this.metrics.totalRevenue += event.amount;
        console.log(`    → Success rate: ${this.getSuccessRate()}%`);
        break;
      case 'payment_failed':
        this.metrics.totalPayments++;
        this.metrics.failedPayments++;
        console.log(`    → Success rate: ${this.getSuccessRate()}%`);
        break;
      case 'refund_issued':
        this.metrics.refunds++;
        this.metrics.totalRevenue -= event.amount;
        break;
    }
  }

  getName(): string {
    return 'AnalyticsService';
  }

  getSuccessRate(): number {
    if (this.metrics.totalPayments === 0) return 0;
    return Math.round((this.metrics.successfulPayments / this.metrics.totalPayments) * 100);
  }

  getMetrics() {
    return this.metrics;
  }
}

// 4. Fraud Detection System (monitors suspicious activity)
class FraudDetectionSystem implements PaymentObserver {
  private suspiciousPayments: string[] = [];

  update(event: PaymentEvent): void {
    console.log(`  [Fraud] 🔍 Analyzing: ${event.type}`);

    // Simple fraud detection rules
    if (event.amount > 5000) {
      console.log(`    ⚠️  High-value transaction flagged: $${event.amount}`);
      this.suspiciousPayments.push(event.paymentId);
    } else if (event.type === 'chargeback') {
      console.log(`    ⚠️  Chargeback detected - investigating`);
      this.suspiciousPayments.push(event.paymentId);
    } else {
      console.log(`    ✓ Transaction looks legitimate`);
    }
  }

  getName(): string {
    return 'FraudDetectionSystem';
  }

  getSuspiciousPayments(): string[] {
    return this.suspiciousPayments;
  }
}

// 5. Webhook Service (notifies external systems)
class WebhookService implements PaymentObserver {
  constructor(private webhookUrl: string) {}

  update(event: PaymentEvent): void {
    console.log(`  [Webhook] 🔗 Sending webhook to: ${this.webhookUrl}`);
    console.log(`    → POST ${this.webhookUrl}`);
    console.log(`    → Body: ${JSON.stringify({ event: event.type, id: event.paymentId })}`);
  }

  getName(): string {
    return 'WebhookService';
  }
}

// Demo
async function demo() {
  console.log('='.repeat(60));
  console.log('OBSERVER PATTERN - Payment Event System');
  console.log('='.repeat(60));

  // Create subject
  const processor = new PaymentProcessor();

  // Create observers
  const emailService = new EmailNotificationService();
  const accountingSystem = new AccountingSystem();
  const analyticsService = new AnalyticsService();
  const fraudDetection = new FraudDetectionSystem();
  const webhookService = new WebhookService('https://merchant.com/webhooks/payment');

  // Attach observers
  console.log('\n--- Attaching Observers ---');
  processor.attach(emailService);
  processor.attach(accountingSystem);
  processor.attach(analyticsService);
  processor.attach(fraudDetection);
  processor.attach(webhookService);

  // Process payments (observers are automatically notified)
  await processor.processPayment('pay_001', 99.99);
  await processor.processPayment('pay_002', 249.50);
  await processor.processPayment('pay_003', 6500.00); // High value - triggers fraud alert
  await processor.processPayment('pay_004', 149.99);

  // Issue refund
  await processor.issueRefund('pay_002', 249.50);

  // Simulate chargeback
  console.log('\n[Processor] Processing chargeback notification...');
  processor.notify({
    type: 'chargeback',
    paymentId: 'pay_001',
    amount: 99.99,
    timestamp: new Date()
  });

  // Show final state
  console.log('\n' + '='.repeat(60));
  console.log('Final System State');
  console.log('='.repeat(60));

  console.log('\n[Accounting] Final Balance:', `$${accountingSystem.getBalance()}`);
  console.log('[Analytics] Metrics:', analyticsService.getMetrics());
  console.log('[Fraud] Suspicious Payments:', fraudDetection.getSuspiciousPayments());

  // Demonstrate detaching observer
  console.log('\n--- Detaching Email Service ---');
  processor.detach(emailService);

  await processor.processPayment('pay_005', 79.99);
  console.log('\n(Notice: No email notification sent for pay_005)');
}

demo();

/**
 * Real-world example: Stripe-like Webhook System
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: Stripe Webhook Architecture');
console.log('='.repeat(60));

interface StripeEvent {
  type: string;
  data: any;
}

interface StripeWebhookEndpoint {
  url: string;
  events: string[];
  active: boolean;
}

class StripeEventDispatcher {
  private endpoints: Map<string, StripeWebhookEndpoint> = new Map();

  registerEndpoint(id: string, endpoint: StripeWebhookEndpoint): void {
    this.endpoints.set(id, endpoint);
    console.log(`[Stripe] Registered webhook: ${endpoint.url}`);
  }

  removeEndpoint(id: string): void {
    this.endpoints.delete(id);
    console.log(`[Stripe] Removed webhook: ${id}`);
  }

  async dispatch(event: StripeEvent): Promise<void> {
    console.log(`\n[Stripe] Dispatching event: ${event.type}`);

    for (const [id, endpoint] of this.endpoints) {
      // Only notify if endpoint listens to this event type
      if (endpoint.active && endpoint.events.includes(event.type)) {
        console.log(`  → Sending to ${endpoint.url}`);
        // In production: await httpClient.post(endpoint.url, event)
      }
    }
  }
}

const stripe = new StripeEventDispatcher();

stripe.registerEndpoint('wh_001', {
  url: 'https://myapp.com/webhooks/stripe',
  events: ['payment_intent.succeeded', 'payment_intent.failed'],
  active: true
});

stripe.registerEndpoint('wh_002', {
  url: 'https://analytics.myapp.com/stripe',
  events: ['charge.succeeded', 'charge.refunded'],
  active: true
});

stripe.dispatch({ type: 'payment_intent.succeeded', data: { amount: 5000 } });
stripe.dispatch({ type: 'charge.refunded', data: { amount: 2000 } });

/**
 * PREGUNTAS:
 * 1. ¿Observer vs Pub/Sub difference?
 * 2. ¿Cómo Stripe maneja webhook retry logic?
 * 3. ¿Observer pattern thread-safe en Node.js?
 * 4. ¿Memory leaks con observers no removidos?
 * 5. ¿Push vs Pull model en Observer?
 * 6. ¿Cómo AWS SNS implementa Observer pattern?
 * 7. ¿Order of notification matters?
 * 8. ¿Error handling cuando un observer falla?
 */

export { PaymentProcessor, PaymentObserver, PaymentEvent };
