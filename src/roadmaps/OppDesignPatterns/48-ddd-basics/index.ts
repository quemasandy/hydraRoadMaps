/**
 * DDD BASICS - Domain-Driven Design
 * Entities, Value Objects, Aggregates, Domain Events
 *
 * Big Tech: Microservices, Complex business domains (Uber, Amazon)
 */

// VALUE OBJECT (immutable, equality by value)
class Money {
  constructor(private readonly amount: number, private readonly currency: string) {
    if (amount < 0) throw new Error('Amount cannot be negative');
  }

  getAmount(): number { return this.amount; }
  getCurrency(): string { return this.currency; }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }
}

// ENTITY (has identity, mutable)
class OrderLine {
  constructor(
    public readonly id: string,
    public productId: string,
    public quantity: number,
    public price: Money
  ) {}

  getTotal(): Money {
    return new Money(this.price.getAmount() * this.quantity, this.price.getCurrency());
  }
}

// AGGREGATE ROOT (consistency boundary)
class Order {
  private lines: OrderLine[] = [];
  private _status: 'pending' | 'confirmed' | 'shipped' = 'pending';

  constructor(public readonly id: string, private customerId: string) {}

  // Business logic
  addLine(line: OrderLine): void {
    if (this._status !== 'pending') {
      throw new Error('Cannot modify confirmed order');
    }
    this.lines.push(line);
  }

  confirm(): void {
    if (this.lines.length === 0) {
      throw new Error('Cannot confirm empty order');
    }
    this._status = 'confirmed';
    console.log(`✓ Order ${this.id} confirmed`);
  }

  ship(): void {
    if (this._status !== 'confirmed') {
      throw new Error('Order must be confirmed before shipping');
    }
    this._status = 'shipped';
    console.log(`✓ Order ${this.id} shipped`);
  }

  getTotal(): Money {
    if (this.lines.length === 0) {
      return new Money(0, 'USD');
    }
    return this.lines.reduce((total, line) => total.add(line.getTotal()), new Money(0, 'USD'));
  }

  getStatus(): string {
    return this._status;
  }

  getLines(): readonly OrderLine[] {
    return [...this.lines];
  }
}

// DOMAIN EVENT
interface DomainEvent {
  occurredAt: Date;
}

class OrderConfirmedEvent implements DomainEvent {
  occurredAt = new Date();
  constructor(public orderId: string, public total: Money) {}
}

// Demo
console.log('='.repeat(60));
console.log('DDD BASICS - Order Aggregate');
console.log('='.repeat(60));

const order = new Order('ord_001', 'cus_123');

// Add order lines
order.addLine(new OrderLine('line_1', 'prod_A', 2, new Money(50, 'USD')));
order.addLine(new OrderLine('line_2', 'prod_B', 1, new Money(30, 'USD')));

console.log(`\nOrder Total: ${order.getTotal()}`);
console.log(`Status: ${order.getStatus()}`);

// Confirm order
order.confirm();

// Try to add line after confirmation (should fail)
try {
  order.addLine(new OrderLine('line_3', 'prod_C', 1, new Money(20, 'USD')));
} catch (e: any) {
  console.log(`❌ ${e.message}`);
}

// Ship order
order.ship();

/**
 * PREGUNTAS:
 * 1. ¿Entity vs Value Object?
 * 2. ¿Aggregate design rules?
 * 3. ¿Domain Events vs Integration Events?
 * 4. ¿Anemic domain model?
 * 5. ¿DDD en microservices?
 * 6. ¿Bounded contexts?
 * 7. ¿Repository per aggregate?
 * 8. ¿DDD tactical vs strategic patterns?
 */

export { Order, Money, OrderLine };
