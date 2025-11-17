/**
 * COMPOSITE PATTERN
 * Estructura de árbol para representar jerarquías parte-todo.
 * Permite tratar objetos individuales y composiciones uniformemente.
 *
 * Big Tech: AWS S3 folders, Stripe invoice line items, org charts
 */

// Component interface
interface InvoiceComponent {
  getTotal(): number;
  getDescription(): string;
  print(indent: string): void;
}

// Leaf: Individual line item
class LineItem implements InvoiceComponent {
  constructor(
    private description: string,
    private quantity: number,
    private unitPrice: number
  ) {}

  getTotal(): number {
    return this.quantity * this.unitPrice;
  }

  getDescription(): string {
    return `${this.description} (${this.quantity} × $${this.unitPrice})`;
  }

  print(indent: string = ''): void {
    console.log(`${indent}${this.getDescription()}: $${this.getTotal()}`);
  }
}

// Composite: Group of line items
class CompositeLineItem implements InvoiceComponent {
  private children: InvoiceComponent[] = [];

  constructor(private description: string) {}

  add(component: InvoiceComponent): void {
    this.children.push(component);
  }

  remove(component: InvoiceComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  getTotal(): number {
    return this.children.reduce((sum, child) => sum + child.getTotal(), 0);
  }

  getDescription(): string {
    return this.description;
  }

  print(indent: string = ''): void {
    console.log(`${indent}${this.description}: $${this.getTotal()}`);
    this.children.forEach(child => child.print(indent + '  '));
  }
}

// Demo
const invoice = new CompositeLineItem('Monthly Invoice');

// Add simple items
invoice.add(new LineItem('Pro Plan Subscription', 1, 99.99));
invoice.add(new LineItem('Storage (100GB)', 1, 10.00));

// Add composite (group of items)
const addons = new CompositeLineItem('Premium Add-ons');
addons.add(new LineItem('Extra Users', 5, 10.00));
addons.add(new LineItem('Priority Support', 1, 50.00));
addons.add(new LineItem('Advanced Analytics', 1, 30.00));

invoice.add(addons);

// Add another group
const services = new CompositeLineItem('Professional Services');
services.add(new LineItem('Consulting Hours', 10, 150.00));
services.add(new LineItem('Implementation', 1, 500.00));

invoice.add(services);

console.log('='.repeat(50));
console.log('COMPOSITE PATTERN - Invoice Structure');
console.log('='.repeat(50));
invoice.print();
console.log('='.repeat(50));
console.log(`TOTAL: $${invoice.getTotal()}`);

/**
 * PREGUNTAS:
 * 1. ¿Cuándo usar Composite vs simple array?
 * 2. ¿Cómo Stripe usa Composite para invoices?
 * 3. ¿Composite viola Single Responsibility?
 * 4. ¿Cómo implementar visitor pattern con Composite?
 * 5. ¿Safety vs transparency trade-off?
 * 6. ¿Cómo manejar operaciones que solo aplican a composites?
 * 7. ¿Composite es apropiado para todo tipo de jerarquías?
 * 8. ¿Cómo optimizar performance en árboles profundos?
 */

export { InvoiceComponent, LineItem, CompositeLineItem };
