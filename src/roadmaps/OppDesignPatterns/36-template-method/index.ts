/**
 * TEMPLATE METHOD PATTERN
 * Define el esqueleto de un algoritmo en una operación, dejando que las subclases
 * redefinan ciertos pasos sin cambiar la estructura del algoritmo.
 *
 * Big Tech: Build pipelines (CI/CD), Request processing, Data import flows
 */

// Abstract class with template method
abstract class PaymentProcessor {
  // Template method - defines the algorithm structure
  async processPayment(amount: number, paymentDetails: any): Promise<boolean> {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Processing payment via ${this.getProcessorName()}`);
    console.log('='.repeat(50));

    // Step 1: Validate
    if (!this.validatePayment(amount, paymentDetails)) {
      console.log('❌ Payment validation failed\n');
      return false;
    }

    // Step 2: Calculate fees
    const fee = this.calculateFees(amount);
    const totalAmount = amount + fee;
    console.log(`[Template] Total: $${amount} + $${fee} (fee) = $${totalAmount}`);

    // Step 3: Execute payment (varies by processor)
    const transactionId = await this.executePayment(totalAmount, paymentDetails);
    if (!transactionId) {
      console.log('❌ Payment execution failed\n');
      return false;
    }

    // Step 4: Record transaction
    this.recordTransaction(transactionId, totalAmount);

    // Step 5: Send notification (optional hook)
    this.sendNotification(transactionId, totalAmount);

    console.log(`✅ Payment completed: ${transactionId}\n`);
    return true;
  }

  // Abstract methods (must be implemented by subclasses)
  protected abstract getProcessorName(): string;
  protected abstract executePayment(amount: number, details: any): Promise<string | null>;
  protected abstract calculateFees(amount: number): number;

  // Concrete methods (same for all processors)
  protected validatePayment(amount: number, details: any): boolean {
    console.log(`[Template] Validating payment...`);
    if (amount <= 0) {
      console.log(`  ❌ Invalid amount: $${amount}`);
      return false;
    }
    console.log(`  ✓ Payment valid`);
    return true;
  }

  protected recordTransaction(transactionId: string, amount: number): void {
    console.log(`[Template] Recording transaction ${transactionId} for $${amount}`);
    // In production: save to database
  }

  // Hook method (optional - can be overridden)
  protected sendNotification(transactionId: string, amount: number): void {
    console.log(`[Template] Sending notification email for ${transactionId}`);
  }
}

// Concrete Processor 1: Stripe
class StripeProcessor extends PaymentProcessor {
  protected getProcessorName(): string {
    return 'Stripe';
  }

  protected async executePayment(amount: number, details: any): Promise<string | null> {
    console.log(`[Stripe] Charging $${amount} to card ${details.cardToken}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return `stripe_${Date.now()}`;
  }

  protected calculateFees(amount: number): number {
    // Stripe: 2.9% + $0.30
    return amount * 0.029 + 0.30;
  }
}

// Concrete Processor 2: PayPal
class PayPalProcessor extends PaymentProcessor {
  protected getProcessorName(): string {
    return 'PayPal';
  }

  protected async executePayment(amount: number, details: any): Promise<string | null> {
    console.log(`[PayPal] Processing $${amount} for ${details.email}`);
    await new Promise(resolve => setTimeout(resolve, 120));
    return `PAYPAL_${Date.now()}`;
  }

  protected calculateFees(amount: number): number {
    // PayPal: 2.9% + $0.30
    return amount * 0.029 + 0.30;
  }

  // Override hook to add PayPal-specific notification
  protected sendNotification(transactionId: string, amount: number): void {
    super.sendNotification(transactionId, amount);
    console.log(`[PayPal] Sending PayPal receipt`);
  }
}

// Concrete Processor 3: Square
class SquareProcessor extends PaymentProcessor {
  protected getProcessorName(): string {
    return 'Square';
  }

  protected async executePayment(amount: number, details: any): Promise<string | null> {
    console.log(`[Square] Charging $${amount}`);
    await new Promise(resolve => setTimeout(resolve, 90));
    return `sq_${Date.now()}`;
  }

  protected calculateFees(amount: number): number {
    // Square: 2.6% + $0.10
    return amount * 0.026 + 0.10;
  }
}

// Demo
async function demo() {
  console.log('='.repeat(60));
  console.log('TEMPLATE METHOD - Payment Processing Flow');
  console.log('='.repeat(60));

  const amount = 100.00;

  // Process with Stripe
  const stripe = new StripeProcessor();
  await stripe.processPayment(amount, { cardToken: 'tok_visa' });

  // Process with PayPal
  const paypal = new PayPalProcessor();
  await paypal.processPayment(amount, { email: 'customer@example.com' });

  // Process with Square
  const square = new SquareProcessor();
  await square.processPayment(amount, { cardToken: 'tok_square' });

  // Invalid payment
  await stripe.processPayment(-50, { cardToken: 'tok_visa' });
}

demo();

/**
 * Real-world: Data Import Template
 */
console.log('\n' + '='.repeat(60));
console.log('REAL-WORLD: Invoice Data Import Template');
console.log('='.repeat(60));

abstract class InvoiceImporter {
  // Template method
  async import(filePath: string): Promise<number> {
    console.log(`\n[Importer] Starting import from ${filePath}...`);

    // 1. Read file
    const rawData = await this.readFile(filePath);
    console.log(`  ✓ Read ${rawData.length} bytes`);

    // 2. Parse (format-specific)
    const records = this.parseData(rawData);
    console.log(`  ✓ Parsed ${records.length} records`);

    // 3. Validate
    const valid = this.validateRecords(records);
    console.log(`  ✓ ${valid.length}/${records.length} records valid`);

    // 4. Transform
    const invoices = this.transformToInvoices(valid);
    console.log(`  ✓ Transformed to invoices`);

    // 5. Save
    await this.saveToDatabase(invoices);
    console.log(`  ✓ Saved ${invoices.length} invoices`);

    return invoices.length;
  }

  protected async readFile(path: string): Promise<string> {
    // Common implementation
    return `mock_data_from_${path}`;
  }

  protected validateRecords(records: any[]): any[] {
    // Common validation
    return records.filter(r => r.amount > 0);
  }

  protected async saveToDatabase(invoices: any[]): Promise<void> {
    // Common save logic
    console.log(`  [DB] Inserting ${invoices.length} invoices...`);
  }

  // Abstract methods (format-specific)
  protected abstract parseData(rawData: string): any[];
  protected abstract transformToInvoices(records: any[]): any[];
}

class CSVInvoiceImporter extends InvoiceImporter {
  protected parseData(rawData: string): any[] {
    console.log(`  [CSV] Parsing CSV format...`);
    return [
      { id: '1', amount: 100, customer: 'A' },
      { id: '2', amount: 200, customer: 'B' }
    ];
  }

  protected transformToInvoices(records: any[]): any[] {
    return records.map(r => ({
      invoiceId: `INV-${r.id}`,
      amount: r.amount,
      customerName: r.customer
    }));
  }
}

class JSONInvoiceImporter extends InvoiceImporter {
  protected parseData(rawData: string): any[] {
    console.log(`  [JSON] Parsing JSON format...`);
    return [
      { invoice_id: '001', total: 150, client: 'X' },
      { invoice_id: '002', total: 250, client: 'Y' }
    ];
  }

  protected transformToInvoices(records: any[]): any[] {
    return records.map(r => ({
      invoiceId: `INV-${r.invoice_id}`,
      amount: r.total,
      customerName: r.client
    }));
  }
}

(async () => {
  const csvImporter = new CSVInvoiceImporter();
  await csvImporter.import('invoices.csv');

  const jsonImporter = new JSONInvoiceImporter();
  await jsonImporter.import('invoices.json');
})();

/**
 * PREGUNTAS:
 * 1. ¿Template Method vs Strategy difference?
 * 2. ¿Cuándo usar abstract methods vs hooks?
 * 3. ¿Hollywood Principle ("Don't call us, we'll call you")?
 * 4. ¿Template Method en functional programming?
 * 5. ¿Testing template methods?
 * 6. ¿Inflexibility problem con Template Method?
 * 7. ¿Template Method + Dependency Injection?
 * 8. ¿Cómo frameworks (React, Angular) usan lifecycle hooks como Template Method?
 */

export { PaymentProcessor, StripeProcessor, PayPalProcessor };
