/**
 * SERVICE LAYER PATTERN
 * Encapsula lógica de negocio y coordina operaciones entre repositorios.
 *
 * Big Tech: Spring Service Layer, .NET Services, Microservices
 */

// Domain entities
interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid';
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'card' | 'bank';
}

// Repositories (data access)
class InvoiceRepository {
  private invoices: Invoice[] = [];

  async save(invoice: Invoice): Promise<void> {
    this.invoices.push(invoice);
  }

  async findById(id: string): Promise<Invoice | null> {
    return this.invoices.find(i => i.id === id) || null;
  }

  async updateStatus(id: string, status: Invoice['status']): Promise<void> {
    const invoice = await this.findById(id);
    if (invoice) invoice.status = status;
  }
}

class PaymentRepository {
  private payments: Payment[] = [];

  async save(payment: Payment): Promise<void> {
    this.payments.push(payment);
  }
}

// External services
class EmailService {
  async sendInvoiceEmail(customerId: string, invoiceId: string): Promise<void> {
    console.log(`  [Email] Sending invoice ${invoiceId} to customer ${customerId}`);
  }

  async sendPaymentConfirmation(customerId: string, amount: number): Promise<void> {
    console.log(`  [Email] Sending payment confirmation ($${amount}) to ${customerId}`);
  }
}

class PaymentGateway {
  async processPayment(amount: number, method: string): Promise<boolean> {
    console.log(`  [Gateway] Processing $${amount} via ${method}...`);
    return Math.random() > 0.1; // 90% success
  }
}

// SERVICE LAYER: Orchestrates business operations
class InvoiceService {
  constructor(
    private invoiceRepo: InvoiceRepository,
    private paymentRepo: PaymentRepository,
    private emailService: EmailService,
    private paymentGateway: PaymentGateway
  ) {}

  // Business operation: Create and send invoice
  async createAndSendInvoice(customerId: string, amount: number): Promise<string> {
    console.log(`\n[Service] Creating invoice for ${customerId}...`);

    // 1. Create invoice (domain logic)
    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      customerId,
      amount,
      status: 'draft'
    };

    // 2. Save to database
    await this.invoiceRepo.save(invoice);
    console.log(`  ✓ Invoice ${invoice.id} created`);

    // 3. Update status
    await this.invoiceRepo.updateStatus(invoice.id, 'sent');
    console.log(`  ✓ Invoice marked as sent`);

    // 4. Send email
    await this.emailService.sendInvoiceEmail(customerId, invoice.id);

    console.log(`✅ Invoice ${invoice.id} created and sent\n`);
    return invoice.id;
  }

  // Business operation: Process invoice payment
  async processInvoicePayment(invoiceId: string, method: 'card' | 'bank'): Promise<boolean> {
    console.log(`\n[Service] Processing payment for ${invoiceId}...`);

    // 1. Get invoice
    const invoice = await this.invoiceRepo.findById(invoiceId);
    if (!invoice) {
      console.log(`  ❌ Invoice not found`);
      return false;
    }

    if (invoice.status === 'paid') {
      console.log(`  ❌ Invoice already paid`);
      return false;
    }

    // 2. Process payment
    const success = await this.paymentGateway.processPayment(invoice.amount, method);
    if (!success) {
      console.log(`  ❌ Payment failed`);
      return false;
    }

    // 3. Record payment
    const payment: Payment = {
      id: `pay_${Date.now()}`,
      invoiceId,
      amount: invoice.amount,
      method
    };
    await this.paymentRepo.save(payment);
    console.log(`  ✓ Payment ${payment.id} recorded`);

    // 4. Update invoice status
    await this.invoiceRepo.updateStatus(invoiceId, 'paid');
    console.log(`  ✓ Invoice marked as paid`);

    // 5. Send confirmation
    await this.emailService.sendPaymentConfirmation(invoice.customerId, invoice.amount);

    console.log(`✅ Payment processed successfully\n`);
    return true;
  }
}

// Demo
console.log('='.repeat(60));
console.log('SERVICE LAYER - Invoice & Payment Service');
console.log('='.repeat(60));

(async () => {
  const invoiceRepo = new InvoiceRepository();
  const paymentRepo = new PaymentRepository();
  const emailService = new EmailService();
  const gateway = new PaymentGateway();

  const service = new InvoiceService(invoiceRepo, paymentRepo, emailService, gateway);

  // Business operations
  const invoiceId = await service.createAndSendInvoice('cus_001', 999.99);
  await service.processInvoicePayment(invoiceId, 'card');

  // Try to pay again (should fail)
  await service.processInvoicePayment(invoiceId, 'card');
})();

/**
 * PREGUNTAS:
 * 1. ¿Service Layer vs Domain Model?
 * 2. ¿Transaction management en Service Layer?
 * 3. ¿Anemic domain model problem?
 * 4. ¿Service Layer in microservices?
 * 5. ¿Testing service layer?
 * 6. ¿Service Layer + DI?
 * 7. ¿Fat services antipattern?
 * 8. ¿Service Layer vs Application Layer en DDD?
 */

export { InvoiceService };
