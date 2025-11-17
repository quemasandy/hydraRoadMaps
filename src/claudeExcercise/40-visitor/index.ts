/**
 * VISITOR PATTERN
 * Representa una operación a realizar sobre elementos de una estructura de objetos.
 * Permite definir nuevas operaciones sin cambiar las clases de los elementos.
 *
 * Big Tech: AST traversal (compilers), Report generation, Data export
 */

// Visitor interface
interface InvoiceVisitor {
  visitInvoice(invoice: StandardInvoice): void;
  visitRecurringInvoice(invoice: RecurringInvoice): void;
  visitCreditNote(note: CreditNote): void;
}

// Element interface
interface InvoiceElement {
  accept(visitor: InvoiceVisitor): void;
}

// Concrete Elements

class StandardInvoice implements InvoiceElement {
  constructor(
    public id: string,
    public amount: number,
    public taxRate: number,
    public customerId: string
  ) {}

  accept(visitor: InvoiceVisitor): void {
    visitor.visitInvoice(this);
  }

  getTotalWithTax(): number {
    return this.amount * (1 + this.taxRate);
  }
}

class RecurringInvoice implements InvoiceElement {
  constructor(
    public id: string,
    public monthlyAmount: number,
    public taxRate: number,
    public customerId: string,
    public billingPeriods: number // months
  ) {}

  accept(visitor: InvoiceVisitor): void {
    visitor.visitRecurringInvoice(this);
  }

  getTotalRevenue(): number {
    return this.monthlyAmount * this.billingPeriods * (1 + this.taxRate);
  }
}

class CreditNote implements InvoiceElement {
  constructor(
    public id: string,
    public amount: number,
    public originalInvoiceId: string,
    public reason: string
  ) {}

  accept(visitor: InvoiceVisitor): void {
    visitor.visitCreditNote(this);
  }
}

// Concrete Visitors

// 1. Tax Calculator Visitor
class TaxCalculatorVisitor implements InvoiceVisitor {
  private totalTax = 0;

  visitInvoice(invoice: StandardInvoice): void {
    const tax = invoice.amount * invoice.taxRate;
    this.totalTax += tax;
    console.log(`  [Tax] Invoice ${invoice.id}: $${tax.toFixed(2)} tax`);
  }

  visitRecurringInvoice(invoice: RecurringInvoice): void {
    const totalAmount = invoice.monthlyAmount * invoice.billingPeriods;
    const tax = totalAmount * invoice.taxRate;
    this.totalTax += tax;
    console.log(`  [Tax] Recurring ${invoice.id}: $${tax.toFixed(2)} tax (${invoice.billingPeriods} months)`);
  }

  visitCreditNote(note: CreditNote): void {
    // Credit notes reduce tax liability (simplified - assume same tax rate)
    this.totalTax -= note.amount * 0.10; // Assume 10% tax
    console.log(`  [Tax] Credit ${note.id}: -$${(note.amount * 0.10).toFixed(2)} tax`);
  }

  getTotalTax(): number {
    return this.totalTax;
  }
}

// 2. Revenue Report Visitor
class RevenueReportVisitor implements InvoiceVisitor {
  private totalRevenue = 0;
  private invoiceCount = 0;

  visitInvoice(invoice: StandardInvoice): void {
    this.totalRevenue += invoice.getTotalWithTax();
    this.invoiceCount++;
    console.log(`  [Revenue] Invoice ${invoice.id}: $${invoice.getTotalWithTax().toFixed(2)}`);
  }

  visitRecurringInvoice(invoice: RecurringInvoice): void {
    this.totalRevenue += invoice.getTotalRevenue();
    this.invoiceCount++;
    console.log(`  [Revenue] Recurring ${invoice.id}: $${invoice.getTotalRevenue().toFixed(2)}`);
  }

  visitCreditNote(note: CreditNote): void {
    this.totalRevenue -= note.amount;
    console.log(`  [Revenue] Credit ${note.id}: -$${note.amount.toFixed(2)}`);
  }

  getReport(): { total: number; count: number } {
    return { total: this.totalRevenue, count: this.invoiceCount };
  }
}

// 3. Email Notification Visitor
class EmailNotificationVisitor implements InvoiceVisitor {
  visitInvoice(invoice: StandardInvoice): void {
    console.log(`  [Email] Sending invoice ${invoice.id} to customer ${invoice.customerId}`);
    console.log(`    Subject: Invoice ${invoice.id} - Amount Due: $${invoice.getTotalWithTax().toFixed(2)}`);
  }

  visitRecurringInvoice(invoice: RecurringInvoice): void {
    console.log(`  [Email] Sending recurring invoice ${invoice.id} to customer ${invoice.customerId}`);
    console.log(`    Subject: Subscription Invoice - $${invoice.monthlyAmount}/month`);
  }

  visitCreditNote(note: CreditNote): void {
    console.log(`  [Email] Sending credit note ${note.id}`);
    console.log(`    Subject: Credit Note Issued - $${note.amount} (Reason: ${note.reason})`);
  }
}

// 4. PDF Export Visitor
class PDFExportVisitor implements InvoiceVisitor {
  private exports: string[] = [];

  visitInvoice(invoice: StandardInvoice): void {
    const pdf = `invoice_${invoice.id}.pdf`;
    this.exports.push(pdf);
    console.log(`  [PDF] Generated ${pdf}`);
  }

  visitRecurringInvoice(invoice: RecurringInvoice): void {
    const pdf = `recurring_${invoice.id}.pdf`;
    this.exports.push(pdf);
    console.log(`  [PDF] Generated ${pdf}`);
  }

  visitCreditNote(note: CreditNote): void {
    const pdf = `credit_${note.id}.pdf`;
    this.exports.push(pdf);
    console.log(`  [PDF] Generated ${pdf}`);
  }

  getExportedFiles(): string[] {
    return this.exports;
  }
}

// Demo
console.log('='.repeat(60));
console.log('VISITOR PATTERN - Invoice Operations');
console.log('='.repeat(60));

// Create invoice collection
const invoices: InvoiceElement[] = [
  new StandardInvoice('INV-001', 1000, 0.10, 'CUS-A'), // $1000 + 10% tax
  new StandardInvoice('INV-002', 1500, 0.08, 'CUS-B'), // $1500 + 8% tax
  new RecurringInvoice('SUB-001', 99.99, 0.10, 'CUS-C', 12), // $99.99/mo * 12 months
  new CreditNote('CN-001', 500, 'INV-001', 'Product return'),
  new StandardInvoice('INV-003', 2000, 0.10, 'CUS-A')
];

// Apply Tax Calculator Visitor
console.log('\n--- Tax Calculation ---');
const taxVisitor = new TaxCalculatorVisitor();
invoices.forEach(inv => inv.accept(taxVisitor));
console.log(`\nTotal Tax Collected: $${taxVisitor.getTotalTax().toFixed(2)}`);

// Apply Revenue Report Visitor
console.log('\n--- Revenue Report ---');
const revenueVisitor = new RevenueReportVisitor();
invoices.forEach(inv => inv.accept(revenueVisitor));
const report = revenueVisitor.getReport();
console.log(`\nTotal Revenue: $${report.total.toFixed(2)} from ${report.count} invoices`);

// Apply Email Notification Visitor
console.log('\n--- Email Notifications ---');
const emailVisitor = new EmailNotificationVisitor();
invoices.forEach(inv => inv.accept(emailVisitor));

// Apply PDF Export Visitor
console.log('\n--- PDF Export ---');
const pdfVisitor = new PDFExportVisitor();
invoices.forEach(inv => inv.accept(pdfVisitor));
console.log(`\nExported files: ${pdfVisitor.getExportedFiles().join(', ')}`);

/**
 * Real-world: Transaction Analyzer
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: Transaction Analysis (Stripe-like)');
console.log('='.repeat(60));

interface Transaction {
  accept(visitor: TransactionVisitor): void;
}

interface TransactionVisitor {
  visitCharge(charge: Charge): void;
  visitRefund(refund: Refund): void;
  visitDispute(dispute: Dispute): void;
}

class Charge implements Transaction {
  constructor(public amount: number, public fee: number, public currency: string) {}
  accept(visitor: TransactionVisitor): void {
    visitor.visitCharge(this);
  }
}

class Refund implements Transaction {
  constructor(public amount: number, public chargeId: string) {}
  accept(visitor: TransactionVisitor): void {
    visitor.visitRefund(this);
  }
}

class Dispute implements Transaction {
  constructor(public amount: number, public reason: string, public status: 'pending' | 'won' | 'lost') {}
  accept(visitor: TransactionVisitor): void {
    visitor.visitDispute(this);
  }
}

// Net Revenue Calculator
class NetRevenueVisitor implements TransactionVisitor {
  private net = 0;

  visitCharge(charge: Charge): void {
    this.net += charge.amount - charge.fee;
  }

  visitRefund(refund: Refund): void {
    this.net -= refund.amount;
  }

  visitDispute(dispute: Dispute): void {
    if (dispute.status === 'lost') {
      this.net -= dispute.amount;
    }
  }

  getNetRevenue(): number {
    return this.net;
  }
}

const transactions: Transaction[] = [
  new Charge(1000, 30, 'USD'),
  new Charge(1500, 45, 'USD'),
  new Refund(500, 'ch_001'),
  new Dispute(1000, 'Fraud claim', 'lost')
];

const netVisitor = new NetRevenueVisitor();
transactions.forEach(txn => txn.accept(netVisitor));

console.log(`\nNet Revenue: $${netVisitor.getNetRevenue()}`);

/**
 * PREGUNTAS:
 * 1. ¿Visitor vs instanceof checks?
 * 2. ¿Double dispatch en Visitor pattern?
 * 3. ¿Cuándo usar Visitor pattern?
 * 4. ¿Visitor con TypeScript type guards?
 * 5. ¿Adding new elements vs adding new operations?
 * 6. ¿Visitor pattern en AST traversal (Babel, TypeScript compiler)?
 * 7. ¿Acyclic Visitor pattern?
 * 8. ¿Performance considerations con Visitor?
 */

export { InvoiceVisitor, InvoiceElement, StandardInvoice, TaxCalculatorVisitor };
