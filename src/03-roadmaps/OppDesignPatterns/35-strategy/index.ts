/**
 * STRATEGY PATTERN
 * Define una familia de algoritmos, encapsula cada uno, y los hace intercambiables.
 * Permite que el algoritmo varíe independientemente de los clientes que lo usan.
 *
 * Big Tech: Payment methods (Stripe), Sorting algorithms, Compression algorithms
 */

// Strategy interface
interface PricingStrategy {
  calculatePrice(basePrice: number, quantity: number, customer?: Customer): number;
  getDescription(): string;
}

// Customer data
interface Customer {
  id: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
}

// Concrete Strategies

// 1. Fixed Pricing
class FixedPricingStrategy implements PricingStrategy {
  calculatePrice(basePrice: number, quantity: number): number {
    return basePrice * quantity;
  }

  getDescription(): string {
    return 'Fixed pricing (no discounts)';
  }
}

// 2. Volume Discount
class VolumeDiscountStrategy implements PricingStrategy {
  calculatePrice(basePrice: number, quantity: number): number {
    let discount = 0;

    if (quantity >= 100) {
      discount = 0.20; // 20% off
    } else if (quantity >= 50) {
      discount = 0.15; // 15% off
    } else if (quantity >= 10) {
      discount = 0.10; // 10% off
    }

    const total = basePrice * quantity;
    return total * (1 - discount);
  }

  getDescription(): string {
    return 'Volume discount (10% at 10+, 15% at 50+, 20% at 100+)';
  }
}

// 3. Customer Loyalty
class LoyaltyPricingStrategy implements PricingStrategy {
  calculatePrice(basePrice: number, quantity: number, customer?: Customer): number {
    if (!customer) {
      return basePrice * quantity;
    }

    let discount = 0;
    switch (customer.tier) {
      case 'bronze':
        discount = 0.05; // 5%
        break;
      case 'silver':
        discount = 0.10; // 10%
        break;
      case 'gold':
        discount = 0.15; // 15%
        break;
      case 'platinum':
        discount = 0.25; // 25%
        break;
    }

    const total = basePrice * quantity;
    return total * (1 - discount);
  }

  getDescription(): string {
    return 'Loyalty pricing (Bronze: 5%, Silver: 10%, Gold: 15%, Platinum: 25%)';
  }
}

// 4. Seasonal Pricing
class SeasonalPricingStrategy implements PricingStrategy {
  constructor(private seasonalDiscount: number = 0.30) {} // 30% off

  calculatePrice(basePrice: number, quantity: number): number {
    const total = basePrice * quantity;
    return total * (1 - this.seasonalDiscount);
  }

  getDescription(): string {
    return `Seasonal sale (${this.seasonalDiscount * 100}% off)`;
  }
}

// 5. Dynamic Pricing (demand-based)
class DynamicPricingStrategy implements PricingStrategy {
  constructor(private demandMultiplier: number = 1.0) {}

  calculatePrice(basePrice: number, quantity: number): number {
    // Higher demand = higher price
    return basePrice * quantity * this.demandMultiplier;
  }

  getDescription(): string {
    const change = ((this.demandMultiplier - 1) * 100).toFixed(0);
    return `Dynamic pricing (${change > 0 ? '+' : ''}${change}% due to demand)`;
  }

  setDemand(multiplier: number): void {
    this.demandMultiplier = multiplier;
  }
}

// Context: Uses a strategy
class PriceCalculator {
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  // Change strategy at runtime
  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }

  calculatePrice(basePrice: number, quantity: number, customer?: Customer): number {
    return this.strategy.calculatePrice(basePrice, quantity, customer);
  }

  getStrategyDescription(): string {
    return this.strategy.getDescription();
  }
}

// Demo
console.log('='.repeat(60));
console.log('STRATEGY PATTERN - Pricing Strategies');
console.log('='.repeat(60));

const basePrice = 10.00;
const quantity = 25;

const customer: Customer = {
  id: 'cus_001',
  tier: 'gold',
  totalSpent: 5000
};

// Create calculator with fixed pricing
const calculator = new PriceCalculator(new FixedPricingStrategy());

console.log('\n--- Testing Different Strategies ---');
console.log(`Base price: $${basePrice} | Quantity: ${quantity}`);
console.log(`Customer: ${customer.tier} tier ($${customer.totalSpent} total spent)\n`);

// 1. Fixed pricing
console.log(`[Fixed] ${calculator.getStrategyDescription()}`);
console.log(`  Total: $${calculator.calculatePrice(basePrice, quantity).toFixed(2)}`);

// 2. Volume discount
calculator.setStrategy(new VolumeDiscountStrategy());
console.log(`\n[Volume] ${calculator.getStrategyDescription()}`);
console.log(`  Total: $${calculator.calculatePrice(basePrice, quantity).toFixed(2)}`);

// 3. Loyalty pricing
calculator.setStrategy(new LoyaltyPricingStrategy());
console.log(`\n[Loyalty] ${calculator.getStrategyDescription()}`);
console.log(`  Total: $${calculator.calculatePrice(basePrice, quantity, customer).toFixed(2)}`);

// 4. Seasonal
calculator.setStrategy(new SeasonalPricingStrategy(0.40)); // 40% off
console.log(`\n[Seasonal] ${calculator.getStrategyDescription()}`);
console.log(`  Total: $${calculator.calculatePrice(basePrice, quantity).toFixed(2)}`);

// 5. Dynamic pricing (high demand)
const dynamicStrategy = new DynamicPricingStrategy(1.5); // 50% increase
calculator.setStrategy(dynamicStrategy);
console.log(`\n[Dynamic] ${calculator.getStrategyDescription()}`);
console.log(`  Total: $${calculator.calculatePrice(basePrice, quantity).toFixed(2)}`);

/**
 * Real-world example: Payment Method Strategies (Stripe-like)
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: Payment Method Strategies');
console.log('='.repeat(60));

interface PaymentStrategy {
  pay(amount: number): PaymentResult;
  getName(): string;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  fee: number;
}

// Credit Card Strategy
class CreditCardPayment implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string,
    private expiry: string
  ) {}

  pay(amount: number): PaymentResult {
    // Stripe charges 2.9% + $0.30
    const fee = amount * 0.029 + 0.30;

    console.log(`[CreditCard] Processing $${amount} with card ending in ${this.cardNumber.slice(-4)}`);
    console.log(`  Fee: $${fee.toFixed(2)}`);

    return {
      success: true,
      transactionId: `cc_${Date.now()}`,
      fee
    };
  }

  getName(): string {
    return 'Credit Card';
  }
}

// PayPal Strategy
class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): PaymentResult {
    // PayPal charges 2.9% + $0.30 (domestic)
    const fee = amount * 0.029 + 0.30;

    console.log(`[PayPal] Processing $${amount} for ${this.email}`);
    console.log(`  Fee: $${fee.toFixed(2)}`);

    return {
      success: true,
      transactionId: `pp_${Date.now()}`,
      fee
    };
  }

  getName(): string {
    return 'PayPal';
  }
}

// ACH Bank Transfer Strategy
class ACHPayment implements PaymentStrategy {
  constructor(private accountNumber: string, private routingNumber: string) {}

  pay(amount: number): PaymentResult {
    // ACH is cheaper: $0.80 flat fee (Stripe)
    const fee = 0.80;

    console.log(`[ACH] Processing $${amount} from account ${this.accountNumber.slice(-4)}`);
    console.log(`  Fee: $${fee.toFixed(2)}`);
    console.log(`  Note: 3-5 business days processing time`);

    return {
      success: true,
      transactionId: `ach_${Date.now()}`,
      fee
    };
  }

  getName(): string {
    return 'ACH Bank Transfer';
  }
}

// Crypto Strategy
class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string, private currency: 'BTC' | 'ETH') {}

  pay(amount: number): PaymentResult {
    // Flat 1% fee for crypto
    const fee = amount * 0.01;

    console.log(`[Crypto] Processing $${amount} in ${this.currency} to ${this.walletAddress.slice(0, 10)}...`);
    console.log(`  Fee: $${fee.toFixed(2)}`);

    return {
      success: true,
      transactionId: `crypto_${Date.now()}`,
      fee
    };
  }

  getName(): string {
    return `Cryptocurrency (${this.currency})`;
  }
}

// Checkout Context
class Checkout {
  private paymentStrategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.paymentStrategy = strategy;
  }

  setPaymentMethod(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  processOrder(amount: number): void {
    console.log(`\n--- Processing Order: $${amount} ---`);
    console.log(`Payment method: ${this.paymentStrategy.getName()}`);

    const result = this.paymentStrategy.pay(amount);

    if (result.success) {
      console.log(`✅ Payment successful!`);
      console.log(`   Transaction ID: ${result.transactionId}`);
      console.log(`   Net amount: $${(amount - result.fee).toFixed(2)}`);
    }
  }
}

// Process same order with different payment methods
const orderAmount = 1000.00;

const checkout = new Checkout(
  new CreditCardPayment('4111111111111111', '123', '12/25')
);
checkout.processOrder(orderAmount);

checkout.setPaymentMethod(new PayPalPayment('customer@example.com'));
checkout.processOrder(orderAmount);

checkout.setPaymentMethod(new ACHPayment('000123456789', '110000000'));
checkout.processOrder(orderAmount);

checkout.setPaymentMethod(new CryptoPayment('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'ETH'));
checkout.processOrder(orderAmount);

/**
 * PREGUNTAS:
 * 1. ¿Strategy vs State pattern difference?
 * 2. ¿Cuándo usar Strategy vs simple if-else?
 * 3. ¿Cómo elegir strategy at runtime?
 * 4. ¿Strategy pattern con functional programming?
 * 5. ¿Performance overhead de Strategy?
 * 6. ¿Strategy + Factory pattern?
 * 7. ¿Testing individual strategies?
 * 8. ¿Cómo Stripe implementa payment methods como strategies?
 */

export { PricingStrategy, PriceCalculator, PaymentStrategy, Checkout };
