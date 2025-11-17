/**
 * FLYWEIGHT PATTERN
 * Comparte objetos para soportar gran cantidad de objetos fine-grained eficientemente.
 * Separa estado intrínseco (compartido) de extrínseco (único).
 *
 * Big Tech: String interning, Font rendering, Object pooling
 */

// Flyweight: Intrinsic state (shared)
class ProductPlan {
  constructor(
    private readonly name: string,
    private readonly features: string[],
    private readonly basePrice: number
  ) {
    console.log(`[Flyweight] Creating new ProductPlan: ${name}`);
  }

  // Operation uses both intrinsic and extrinsic state
  calculatePrice(quantity: number, discount: number): number {
    const total = this.basePrice * quantity;
    return total * (1 - discount);
  }

  getDetails(): string {
    return `${this.name} - $${this.basePrice} - Features: ${this.features.join(', ')}`;
  }
}

// Flyweight Factory
class ProductPlanFactory {
  private static plans = new Map<string, ProductPlan>();

  static getPlan(name: string, features: string[], basePrice: number): ProductPlan {
    const key = name;

    if (!this.plans.has(key)) {
      this.plans.set(key, new ProductPlan(name, features, basePrice));
    } else {
      console.log(`[Factory] Reusing existing ProductPlan: ${name}`);
    }

    return this.plans.get(key)!;
  }

  static getPlanCount(): number {
    return this.plans.size;
  }
}

// Context: Uses flyweight with extrinsic state
class Subscription {
  constructor(
    private customerId: string,
    private plan: ProductPlan, // Flyweight (shared)
    private quantity: number, // Extrinsic state (unique per subscription)
    private discount: number // Extrinsic state
  ) {}

  getMonthlyCharge(): number {
    return this.plan.calculatePrice(this.quantity, this.discount);
  }

  getDetails(): string {
    return `Customer ${this.customerId}: ${this.plan.getDetails()} x${this.quantity} (${this.discount * 100}% off)`;
  }
}

// Demo
console.log('='.repeat(50));
console.log('FLYWEIGHT PATTERN - Product Plans');
console.log('='.repeat(50));

// Define plans (flyweights - created only once)
const basicPlan = ProductPlanFactory.getPlan('Basic', ['Feature A', 'Feature B'], 9.99);
const proPlan = ProductPlanFactory.getPlan('Pro', ['Feature A', 'Feature B', 'Feature C'], 29.99);
const enterprisePlan = ProductPlanFactory.getPlan('Enterprise', ['All Features', 'Priority Support'], 99.99);

console.log('\n--- Creating 10,000 subscriptions ---');

const subscriptions: Subscription[] = [];

// Create many subscriptions sharing the same plans
for (let i = 0; i < 10000; i++) {
  let plan: ProductPlan;
  const rand = Math.random();

  // 70% basic, 25% pro, 5% enterprise
  if (rand < 0.70) {
    plan = ProductPlanFactory.getPlan('Basic', ['Feature A', 'Feature B'], 9.99);
  } else if (rand < 0.95) {
    plan = ProductPlanFactory.getPlan('Pro', ['Feature A', 'Feature B', 'Feature C'], 29.99);
  } else {
    plan = ProductPlanFactory.getPlan('Enterprise', ['All Features', 'Priority Support'], 99.99);
  }

  subscriptions.push(new Subscription(
    `cus_${i}`,
    plan, // Shared flyweight
    Math.floor(Math.random() * 10) + 1, // Unique quantity
    Math.random() * 0.2 // Unique discount (0-20%)
  ));
}

console.log(`\n✅ Created ${subscriptions.length} subscriptions`);
console.log(`✅ Using only ${ProductPlanFactory.getPlanCount()} ProductPlan objects (flyweights)`);

// Show some examples
console.log('\n--- Sample Subscriptions ---');
for (let i = 0; i < 5; i++) {
  const sub = subscriptions[Math.floor(Math.random() * subscriptions.length)];
  console.log(`${sub.getDetails()} = $${sub.getMonthlyCharge().toFixed(2)}/month`);
}

// Memory savings
console.log('\n--- Memory Savings ---');
console.log('Without Flyweight: 10,000 ProductPlan objects');
console.log(`With Flyweight: ${ProductPlanFactory.getPlanCount()} ProductPlan objects`);
console.log(`Savings: ${100 - (ProductPlanFactory.getPlanCount() / 10000 * 100).toFixed(2)}%`);

/**
 * Real-world example: E-commerce product catalog
 */
class ProductCatalogItem {
  constructor(
    private readonly sku: string,
    private readonly name: string,
    private readonly image: string, // Large data (intrinsic)
    private readonly price: number
  ) {}

  display(warehouseLocation: string, stock: number): string {
    return `${this.name} - $${this.price} (Stock: ${stock} at ${warehouseLocation})`;
  }
}

class ProductCatalogFactory {
  private static items = new Map<string, ProductCatalogItem>();

  static getItem(sku: string, name: string, image: string, price: number): ProductCatalogItem {
    if (!this.items.has(sku)) {
      this.items.set(sku, new ProductCatalogItem(sku, name, image, price));
      console.log(`[Catalog] Loading product: ${sku}`);
    }
    return this.items.get(sku)!;
  }
}

// Warehouse inventory uses flyweight
class InventoryItem {
  constructor(
    private product: ProductCatalogItem, // Flyweight
    private warehouseLocation: string, // Extrinsic
    private stock: number // Extrinsic
  ) {}

  display(): string {
    return this.product.display(this.warehouseLocation, this.stock);
  }
}

console.log('\n' + '='.repeat(50));
console.log('FLYWEIGHT - E-commerce Inventory');
console.log('='.repeat(50));

const laptop = ProductCatalogFactory.getItem('SKU001', 'Laptop Pro', 'laptop.jpg', 1299);
const mouse = ProductCatalogFactory.getItem('SKU002', 'Wireless Mouse', 'mouse.jpg', 29);

// Same products in multiple warehouses (flyweight shared)
const inventory = [
  new InventoryItem(laptop, 'Warehouse A', 50),
  new InventoryItem(laptop, 'Warehouse B', 30),
  new InventoryItem(laptop, 'Warehouse C', 20),
  new InventoryItem(mouse, 'Warehouse A', 200),
  new InventoryItem(mouse, 'Warehouse B', 150)
];

inventory.forEach(item => console.log(item.display()));

/**
 * PREGUNTAS:
 * 1. ¿Cuándo usar Flyweight?
 * 2. ¿Intrinsic vs Extrinsic state?
 * 3. ¿Flyweight thread-safe?
 * 4. ¿Cuántos objetos justifican Flyweight?
 * 5. ¿Flyweight con immutable objects?
 * 6. ¿Cómo medir memory savings?
 * 7. ¿Flyweight vs Object Pool?
 * 8. ¿Flyweight en modern JavaScript (WeakMap)?
 */

export { ProductPlan, ProductPlanFactory, Subscription };
