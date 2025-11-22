/**
 * DECORATOR PATTERN
 * Agrega responsabilidades a objetos dinámicamente sin modificar su código.
 * Alternativa flexible a subclassing.
 *
 * Big Tech: Stripe fee decorators, middleware chains, logging wrappers
 */

// Component interface
interface Payment {
  process(): number;
  getDescription(): string;
}

// Concrete component
class BasicPayment implements Payment {
  constructor(private amount: number) {}

  process(): number {
    console.log(`Processing basic payment: $${this.amount}`);
    return this.amount;
  }

  getDescription(): string {
    return `Basic payment: $${this.amount}`;
  }
}

// Base Decorator
abstract class PaymentDecorator implements Payment {
  constructor(protected payment: Payment) {}

  process(): number {
    return this.payment.process();
  }

  getDescription(): string {
    return this.payment.getDescription();
  }
}

// Concrete Decorators
class TransactionFeeDecorator extends PaymentDecorator {
  private feePercent = 0.029; // 2.9%
  private fixedFee = 0.30;

  process(): number {
    const baseAmount = this.payment.process();
    const fee = baseAmount * this.feePercent + this.fixedFee;
    console.log(`Adding transaction fee: $${fee.toFixed(2)}`);
    return baseAmount + fee;
  }

  getDescription(): string {
    return this.payment.getDescription() + ' + Transaction Fee';
  }
}

class TaxDecorator extends PaymentDecorator {
  constructor(payment: Payment, private taxRate: number) {
    super(payment);
  }

  process(): number {
    const baseAmount = this.payment.process();
    const tax = baseAmount * this.taxRate;
    console.log(`Adding tax (${this.taxRate * 100}%): $${tax.toFixed(2)}`);
    return baseAmount + tax;
  }

  getDescription(): string {
    return this.payment.getDescription() + ` + Tax (${this.taxRate * 100}%)`;
  }
}

class CurrencyConversionDecorator extends PaymentDecorator {
  constructor(
    payment: Payment,
    private fromCurrency: string,
    private toCurrency: string,
    private rate: number
  ) {
    super(payment);
  }

  process(): number {
    const baseAmount = this.payment.process();
    const converted = baseAmount * this.rate;
    console.log(`Converting ${this.fromCurrency} → ${this.toCurrency}: $${converted.toFixed(2)}`);
    return converted;
  }

  getDescription(): string {
    return this.payment.getDescription() + ` (${this.fromCurrency}→${this.toCurrency})`;
  }
}

class LoggingDecorator extends PaymentDecorator {
  process(): number {
    console.log('[LOG] Starting payment processing');
    const timestamp = new Date().toISOString();
    const result = this.payment.process();
    console.log(`[LOG] Completed at ${timestamp}. Total: $${result.toFixed(2)}`);
    return result;
  }
}

// Demo: Stacking decorators
console.log('='.repeat(50));
console.log('DECORATOR PATTERN - Payment Processing');
console.log('='.repeat(50));

let payment: Payment = new BasicPayment(100);
console.log('\n1. Basic Payment:');
console.log(payment.getDescription());
console.log('Total:', payment.process());

console.log('\n2. With Transaction Fee:');
payment = new BasicPayment(100);
payment = new TransactionFeeDecorator(payment);
console.log(payment.getDescription());
console.log('Total:', payment.process());

console.log('\n3. With Fee + Tax:');
payment = new BasicPayment(100);
payment = new TransactionFeeDecorator(payment);
payment = new TaxDecorator(payment, 0.08);
console.log(payment.getDescription());
console.log('Total:', payment.process());

console.log('\n4. Full Stack (Logging + Fee + Tax + Currency):');
payment = new BasicPayment(100);
payment = new LoggingDecorator(payment);
payment = new TransactionFeeDecorator(payment);
payment = new TaxDecorator(payment, 0.08);
payment = new CurrencyConversionDecorator(payment, 'USD', 'EUR', 0.85);
console.log(payment.getDescription());
console.log('Final Total:', payment.process().toFixed(2));

/**
 * PREGUNTAS:
 * 1. ¿Decorator vs Inheritance?
 * 2. ¿Cómo Stripe usa decorators para fees?
 * 3. ¿Orden de decorators importa?
 * 4. ¿Decorator viola Open/Closed?
 * 5. ¿Cuándo usar Decorator vs Strategy?
 * 6. ¿Cómo testear decorators?
 * 7. ¿Performance con muchos decorators?
 * 8. ¿Decorator vs Proxy difference?
 */

export { Payment, BasicPayment, PaymentDecorator, TransactionFeeDecorator, TaxDecorator };
