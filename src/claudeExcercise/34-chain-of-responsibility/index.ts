/**
 * CHAIN OF RESPONSIBILITY PATTERN
 * Pasa requests a lo largo de una cadena de handlers.
 * Cada handler decide si procesa el request o lo pasa al siguiente.
 *
 * Big Tech: Middleware (Express.js), Request interceptors (Axios), Approval workflows
 */

// Request object
interface PaymentRequest {
  amount: number;
  cardNumber: string;
  cvv: string;
  userId: string;
  metadata?: Record<string, any>;
}

// Handler interface
interface PaymentHandler {
  setNext(handler: PaymentHandler): PaymentHandler;
  handle(request: PaymentRequest): Promise<PaymentResult>;
}

interface PaymentResult {
  approved: boolean;
  message: string;
  handler?: string;
}

// Base Handler
abstract class BasePaymentHandler implements PaymentHandler {
  private nextHandler: PaymentHandler | null = null;

  setNext(handler: PaymentHandler): PaymentHandler {
    this.nextHandler = handler;
    return handler; // Return handler for chaining
  }

  async handle(request: PaymentRequest): Promise<PaymentResult> {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    // End of chain - approve by default
    return { approved: true, message: 'All checks passed' };
  }
}

// Concrete Handlers

// 1. Amount Validation Handler
class AmountValidationHandler extends BasePaymentHandler {
  constructor(private minAmount: number = 0.01, private maxAmount: number = 100000) {
    super();
  }

  async handle(request: PaymentRequest): Promise<PaymentResult> {
    console.log(`[AmountValidation] Checking amount: $${request.amount}`);

    if (request.amount < this.minAmount) {
      console.log(`  ❌ Amount too small (min: $${this.minAmount})`);
      return {
        approved: false,
        message: `Amount must be at least $${this.minAmount}`,
        handler: 'AmountValidation'
      };
    }

    if (request.amount > this.maxAmount) {
      console.log(`  ❌ Amount too large (max: $${this.maxAmount})`);
      return {
        approved: false,
        message: `Amount exceeds limit of $${this.maxAmount}`,
        handler: 'AmountValidation'
      };
    }

    console.log(`  ✓ Amount valid`);
    return super.handle(request); // Pass to next handler
  }
}

// 2. Card Validation Handler
class CardValidationHandler extends BasePaymentHandler {
  async handle(request: PaymentRequest): Promise<PaymentResult> {
    console.log(`[CardValidation] Validating card ending in ${request.cardNumber.slice(-4)}`);

    // Luhn algorithm check (simplified)
    if (request.cardNumber.length !== 16) {
      console.log(`  ❌ Invalid card number length`);
      return {
        approved: false,
        message: 'Invalid card number',
        handler: 'CardValidation'
      };
    }

    if (request.cvv.length !== 3) {
      console.log(`  ❌ Invalid CVV`);
      return {
        approved: false,
        message: 'Invalid CVV',
        handler: 'CardValidation'
      };
    }

    console.log(`  ✓ Card valid`);
    return super.handle(request);
  }
}

// 3. Fraud Detection Handler
class FraudDetectionHandler extends BasePaymentHandler {
  private suspiciousUsers = new Set(['user_blocked_001', 'user_blocked_002']);

  async handle(request: PaymentRequest): Promise<PaymentResult> {
    console.log(`[FraudDetection] Analyzing user: ${request.userId}`);

    // Check if user is blocked
    if (this.suspiciousUsers.has(request.userId)) {
      console.log(`  ❌ User blocked due to previous fraud`);
      return {
        approved: false,
        message: 'Payment blocked - please contact support',
        handler: 'FraudDetection'
      };
    }

    // Check for high-risk patterns
    if (request.amount > 5000) {
      console.log(`  ⚠️  High-value transaction - additional verification required`);
      // In production: trigger 3DS, SMS verification, etc.
    }

    console.log(`  ✓ Fraud check passed`);
    return super.handle(request);
  }
}

// 4. Daily Limit Handler
class DailyLimitHandler extends BasePaymentHandler {
  private userLimits = new Map<string, { spent: number; limit: number }>();

  constructor(private defaultDailyLimit: number = 1000) {
    super();
  }

  async handle(request: PaymentRequest): Promise<PaymentResult> {
    console.log(`[DailyLimit] Checking daily spending for user: ${request.userId}`);

    // Get or initialize user limit
    if (!this.userLimits.has(request.userId)) {
      this.userLimits.set(request.userId, { spent: 0, limit: this.defaultDailyLimit });
    }

    const userLimit = this.userLimits.get(request.userId)!;
    const newTotal = userLimit.spent + request.amount;

    if (newTotal > userLimit.limit) {
      console.log(`  ❌ Daily limit exceeded ($${userLimit.spent}/$${userLimit.limit})`);
      return {
        approved: false,
        message: `Daily limit of $${userLimit.limit} exceeded`,
        handler: 'DailyLimit'
      };
    }

    // Update spent amount
    userLimit.spent = newTotal;
    console.log(`  ✓ Within limit ($${newTotal}/$${userLimit.limit})`);

    return super.handle(request);
  }
}

// 5. Compliance Handler (3DS, regulations)
class ComplianceHandler extends BasePaymentHandler {
  async handle(request: PaymentRequest): Promise<PaymentResult> {
    console.log(`[Compliance] Checking regulatory requirements`);

    // Check if 3DS required for this amount (EU PSD2 regulation)
    const requires3DS = request.amount > 30; // Simplified rule

    if (requires3DS && !request.metadata?.['3ds_completed']) {
      console.log(`  ❌ 3DS authentication required (PSD2)`);
      return {
        approved: false,
        message: '3D Secure authentication required',
        handler: 'Compliance'
      };
    }

    console.log(`  ✓ Compliance check passed`);
    return super.handle(request);
  }
}

// Client: Build and use chain
class PaymentProcessor {
  private chain: PaymentHandler;

  constructor() {
    // Build the chain
    const amountHandler = new AmountValidationHandler();
    const cardHandler = new CardValidationHandler();
    const fraudHandler = new FraudDetectionHandler();
    const limitHandler = new DailyLimitHandler();
    const complianceHandler = new ComplianceHandler();

    // Chain them together
    amountHandler
      .setNext(cardHandler)
      .setNext(fraudHandler)
      .setNext(limitHandler)
      .setNext(complianceHandler);

    this.chain = amountHandler;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Processing payment: $${request.amount} from user ${request.userId}`);
    console.log('='.repeat(50));

    const result = await this.chain.handle(request);

    if (result.approved) {
      console.log(`\n✅ Payment APPROVED\n`);
    } else {
      console.log(`\n❌ Payment REJECTED: ${result.message} (by ${result.handler})\n`);
    }

    return result;
  }
}

// Demo
async function demo() {
  console.log('='.repeat(60));
  console.log('CHAIN OF RESPONSIBILITY - Payment Validation');
  console.log('='.repeat(60));

  const processor = new PaymentProcessor();

  // Test various scenarios
  await processor.processPayment({
    amount: 99.99,
    cardNumber: '4111111111111111',
    cvv: '123',
    userId: 'user_001',
    metadata: { '3ds_completed': true }
  });

  await processor.processPayment({
    amount: 0.001, // Too small
    cardNumber: '4111111111111111',
    cvv: '123',
    userId: 'user_002'
  });

  await processor.processPayment({
    amount: 199.99,
    cardNumber: '411111', // Invalid card
    cvv: '123',
    userId: 'user_003'
  });

  await processor.processPayment({
    amount: 299.99,
    cardNumber: '4111111111111111',
    cvv: '123',
    userId: 'user_blocked_001' // Blocked user
  });

  await processor.processPayment({
    amount: 500,
    cardNumber: '4111111111111111',
    cvv: '123',
    userId: 'user_001' // Exceeds daily limit (already spent $99.99)
  });

  await processor.processPayment({
    amount: 150,
    cardNumber: '4111111111111111',
    cvv: '123',
    userId: 'user_005',
    metadata: {} // Missing 3DS (required for >$30)
  });
}

demo();

/**
 * Real-world example: Approval Workflow Chain
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: Refund Approval Chain');
console.log('='.repeat(60));

interface RefundRequest {
  amount: number;
  reason: string;
  requestedBy: string;
}

abstract class RefundApprover {
  protected nextApprover: RefundApprover | null = null;

  setNext(approver: RefundApprover): RefundApprover {
    this.nextApprover = approver;
    return approver;
  }

  abstract approve(request: RefundRequest): boolean;
}

// $0-$100: Auto-approved
class AutoApprover extends RefundApprover {
  approve(request: RefundRequest): boolean {
    if (request.amount <= 100) {
      console.log(`[Auto] Approved $${request.amount} refund automatically`);
      return true;
    }

    console.log(`[Auto] Amount too high, escalating...`);
    return this.nextApprover ? this.nextApprover.approve(request) : false;
  }
}

// $100-$1000: Manager approval
class ManagerApprover extends RefundApprover {
  approve(request: RefundRequest): boolean {
    if (request.amount <= 1000) {
      console.log(`[Manager] Approved $${request.amount} refund`);
      return true;
    }

    console.log(`[Manager] Amount too high, escalating to director...`);
    return this.nextApprover ? this.nextApprover.approve(request) : false;
  }
}

// $1000+: Director approval
class DirectorApprover extends RefundApprover {
  approve(request: RefundRequest): boolean {
    console.log(`[Director] Reviewed $${request.amount} refund - Approved`);
    return true;
  }
}

const auto = new AutoApprover();
const manager = new ManagerApprover();
const director = new DirectorApprover();

auto.setNext(manager).setNext(director);

console.log('\nRefund: $50');
auto.approve({ amount: 50, reason: 'Defective product', requestedBy: 'customer_001' });

console.log('\nRefund: $500');
auto.approve({ amount: 500, reason: 'Wrong item shipped', requestedBy: 'customer_002' });

console.log('\nRefund: $5000');
auto.approve({ amount: 5000, reason: 'Major service failure', requestedBy: 'customer_003' });

/**
 * PREGUNTAS:
 * 1. ¿Chain of Responsibility vs if-else cascade?
 * 2. ¿Cómo Express.js middleware usa este pattern?
 * 3. ¿Order of handlers matters?
 * 4. ¿Qué pasa si ningún handler procesa el request?
 * 5. ¿Dynamic chain modification at runtime?
 * 6. ¿Performance overhead de chain larga?
 * 7. ¿Chain of Responsibility vs Strategy?
 * 8. ¿Testing individual handlers vs entire chain?
 */

export { PaymentProcessor, PaymentHandler, PaymentRequest, PaymentResult };
