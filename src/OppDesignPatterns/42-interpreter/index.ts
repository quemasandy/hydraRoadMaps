/**
 * INTERPRETER PATTERN
 * Define una representación de la gramática de un lenguaje y un intérprete
 * que usa la representación para interpretar sentencias en el lenguaje.
 *
 * Big Tech: Query languages (GraphQL), Business rules engines, Configuration DSLs
 */

// Context: Holds data for interpretation
interface PricingContext {
  basePrice: number;
  quantity: number;
  customerTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  orderTotal?: number;
}

// Abstract Expression
interface PricingExpression {
  interpret(context: PricingContext): number;
  toString(): string;
}

// Terminal Expressions (leaf nodes)

// Base price
class BasePriceExpression implements PricingExpression {
  interpret(context: PricingContext): number {
    return context.basePrice;
  }

  toString(): string {
    return 'BASE_PRICE';
  }
}

// Quantity
class QuantityExpression implements PricingExpression {
  interpret(context: PricingContext): number {
    return context.quantity;
  }

  toString(): string {
    return 'QUANTITY';
  }
}

// Constant
class ConstantExpression implements PricingExpression {
  constructor(private value: number) {}

  interpret(context: PricingContext): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}

// Non-Terminal Expressions (composite nodes)

// Multiplication
class MultiplyExpression implements PricingExpression {
  constructor(private left: PricingExpression, private right: PricingExpression) {}

  interpret(context: PricingContext): number {
    return this.left.interpret(context) * this.right.interpret(context);
  }

  toString(): string {
    return `(${this.left.toString()} * ${this.right.toString()})`;
  }
}

// Subtraction
class SubtractExpression implements PricingExpression {
  constructor(private left: PricingExpression, private right: PricingExpression) {}

  interpret(context: PricingContext): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }

  toString(): string {
    return `(${this.left.toString()} - ${this.right.toString()})`;
  }
}

// Division
class DivideExpression implements PricingExpression {
  constructor(private left: PricingExpression, private right: PricingExpression) {}

  interpret(context: PricingContext): number {
    const divisor = this.right.interpret(context);
    if (divisor === 0) return 0;
    return this.left.interpret(context) / divisor;
  }

  toString(): string {
    return `(${this.left.toString()} / ${this.right.toString()})`;
  }
}

// Conditional: IF quantity > threshold THEN discount
class ConditionalDiscountExpression implements PricingExpression {
  constructor(
    private threshold: number,
    private discountPercent: number,
    private expression: PricingExpression
  ) {}

  interpret(context: PricingContext): number {
    if (context.quantity >= this.threshold) {
      const baseValue = this.expression.interpret(context);
      return baseValue * (1 - this.discountPercent);
    }
    return this.expression.interpret(context);
  }

  toString(): string {
    return `IF(qty >= ${this.threshold}, ${this.expression.toString()} * ${1 - this.discountPercent})`;
  }
}

// Tier-based discount
class TierDiscountExpression implements PricingExpression {
  private discounts = {
    bronze: 0,
    silver: 0.05,
    gold: 0.10,
    platinum: 0.20
  };

  constructor(private expression: PricingExpression) {}

  interpret(context: PricingContext): number {
    const baseValue = this.expression.interpret(context);
    const discount = this.discounts[context.customerTier];
    return baseValue * (1 - discount);
  }

  toString(): string {
    return `TIER_DISCOUNT(${this.expression.toString()})`;
  }
}

// Demo
console.log('='.repeat(60));
console.log('INTERPRETER PATTERN - Pricing Rules DSL');
console.log('='.repeat(60));

// Context
const context: PricingContext = {
  basePrice: 100,
  quantity: 25,
  customerTier: 'gold'
};

console.log('\nContext:', context);

// Rule 1: BASE_PRICE * QUANTITY
console.log('\n--- Rule 1: Simple Total ---');
const rule1 = new MultiplyExpression(
  new BasePriceExpression(),
  new QuantityExpression()
);
console.log(`Expression: ${rule1.toString()}`);
console.log(`Result: $${rule1.interpret(context)}`);

// Rule 2: BASE_PRICE * QUANTITY with 10% volume discount if quantity >= 20
console.log('\n--- Rule 2: Volume Discount ---');
const baseTotal = new MultiplyExpression(
  new BasePriceExpression(),
  new QuantityExpression()
);
const rule2 = new ConditionalDiscountExpression(20, 0.10, baseTotal);
console.log(`Expression: ${rule2.toString()}`);
console.log(`Result: $${rule2.interpret(context)}`);

// Rule 3: Volume discount + Tier discount
console.log('\n--- Rule 3: Volume + Tier Discount ---');
const rule3 = new TierDiscountExpression(
  new ConditionalDiscountExpression(20, 0.10, baseTotal)
);
console.log(`Expression: ${rule3.toString()}`);
console.log(`Result: $${rule3.interpret(context)}`);

// Test different contexts
console.log('\n--- Testing Different Contexts ---');

const contexts = [
  { basePrice: 100, quantity: 5, customerTier: 'bronze' as const },
  { basePrice: 100, quantity: 50, customerTier: 'silver' as const },
  { basePrice: 100, quantity: 100, customerTier: 'platinum' as const }
];

contexts.forEach((ctx, i) => {
  const result = rule3.interpret(ctx);
  console.log(`${i + 1}. qty=${ctx.quantity}, tier=${ctx.tier} → $${result.toFixed(2)}`);
});

/**
 * Real-world: Discount Code Interpreter
 */
console.log('\n\n' + '='.repeat(60));
console.log('REAL-WORLD: Discount Code DSL (Shopify-like)');
console.log('='.repeat(60));

// Grammar:
// PERCENT_OFF(10) - 10% off
// FIXED_AMOUNT(50) - $50 off
// BUY_X_GET_Y(2, 1) - Buy 2 get 1 free
// MIN_ORDER(100) - Minimum order $100

interface DiscountContext {
  orderTotal: number;
  itemCount: number;
}

interface DiscountExpression {
  apply(context: DiscountContext): number; // Returns discount amount
  isValid(context: DiscountContext): boolean;
  getDescription(): string;
}

// Percent off
class PercentOffDiscount implements DiscountExpression {
  constructor(private percent: number) {}

  apply(context: DiscountContext): number {
    return context.orderTotal * (this.percent / 100);
  }

  isValid(context: DiscountContext): boolean {
    return context.orderTotal > 0;
  }

  getDescription(): string {
    return `${this.percent}% off`;
  }
}

// Fixed amount off
class FixedAmountDiscount implements DiscountExpression {
  constructor(private amount: number) {}

  apply(context: DiscountContext): number {
    return Math.min(this.amount, context.orderTotal);
  }

  isValid(context: DiscountContext): boolean {
    return context.orderTotal > 0;
  }

  getDescription(): string {
    return `$${this.amount} off`;
  }
}

// Buy X Get Y free
class BuyXGetYDiscount implements DiscountExpression {
  constructor(private buy: number, private get: number, private itemPrice: number) {}

  apply(context: DiscountContext): number {
    const sets = Math.floor(context.itemCount / (this.buy + this.get));
    return sets * this.get * this.itemPrice;
  }

  isValid(context: DiscountContext): boolean {
    return context.itemCount >= this.buy + this.get;
  }

  getDescription(): string {
    return `Buy ${this.buy} get ${this.get} free`;
  }
}

// Minimum order requirement
class MinimumOrderDiscount implements DiscountExpression {
  constructor(private minAmount: number, private discount: DiscountExpression) {}

  apply(context: DiscountContext): number {
    if (this.isValid(context)) {
      return this.discount.apply(context);
    }
    return 0;
  }

  isValid(context: DiscountContext): boolean {
    return context.orderTotal >= this.minAmount && this.discount.isValid(context);
  }

  getDescription(): string {
    return `${this.discount.getDescription()} (min order $${this.minAmount})`;
  }
}

// Discount Code Parser/Interpreter
class DiscountCodeInterpreter {
  parse(code: string): DiscountExpression | null {
    // SUMMER20 = 20% off
    if (code === 'SUMMER20') {
      return new PercentOffDiscount(20);
    }

    // SAVE50 = $50 off orders $200+
    if (code === 'SAVE50') {
      return new MinimumOrderDiscount(200, new FixedAmountDiscount(50));
    }

    // BOGO = Buy 1 get 1 free (assume $25 item)
    if (code === 'BOGO') {
      return new BuyXGetYDiscount(1, 1, 25);
    }

    return null;
  }

  applyCode(code: string, context: DiscountContext): void {
    const discount = this.parse(code);

    if (!discount) {
      console.log(`❌ Invalid code: ${code}`);
      return;
    }

    if (!discount.isValid(context)) {
      console.log(`❌ Code "${code}" not applicable to this order`);
      return;
    }

    const discountAmount = discount.apply(context);
    const finalTotal = context.orderTotal - discountAmount;

    console.log(`\nCode: ${code}`);
    console.log(`Description: ${discount.getDescription()}`);
    console.log(`Order Total: $${context.orderTotal}`);
    console.log(`Discount: -$${discountAmount.toFixed(2)}`);
    console.log(`Final Total: $${finalTotal.toFixed(2)}`);
  }
}

const interpreter = new DiscountCodeInterpreter();

// Test discount codes
interpreter.applyCode('SUMMER20', { orderTotal: 100, itemCount: 3 });
interpreter.applyCode('SAVE50', { orderTotal: 250, itemCount: 5 });
interpreter.applyCode('SAVE50', { orderTotal: 150, itemCount: 3 }); // Below minimum
interpreter.applyCode('BOGO', { orderTotal: 100, itemCount: 4 });
interpreter.applyCode('INVALID', { orderTotal: 100, itemCount: 2 });

/**
 * PREGUNTAS:
 * 1. ¿Cuándo usar Interpreter vs parser libraries?
 * 2. ¿Interpreter pattern vs Visitor for AST?
 * 3. ¿Performance de Interpreter pattern?
 * 4. ¿Interpreter + Composite pattern?
 * 5. ¿Caching interpreted results?
 * 6. ¿GraphQL como interpreter pattern?
 * 7. ¿DSL design best practices?
 * 8. ¿Alternative: Embedded DSL vs External DSL?
 */

export { PricingExpression, PricingContext, BasePriceExpression };
