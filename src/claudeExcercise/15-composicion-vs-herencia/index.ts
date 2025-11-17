/**
 * ==========================================
 * COMPOSICIÓN VS HERENCIA
 * ==========================================
 *
 * "Favor composition over inheritance"
 * - Gang of Four (Design Patterns book)
 *
 * 📚 CONCEPTO CLAVE:
 * - Herencia: "IS-A" relationship (Bird IS-A Animal)
 * - Composición: "HAS-A" relationship (Car HAS-A Engine)
 *
 * 🏢 USO EN BIG TECH:
 * React usa composición (components que contienen otros components)
 * Stripe API usa composición (PaymentIntent HAS-A PaymentMethod)
 * Go language NO tiene herencia, solo composición
 *
 * 💡 POR QUÉ COMPOSICIÓN ES MEJOR:
 * - Más flexible
 * - Evita jerarquías frágiles
 * - Facilita testing
 * - Favorece SOLID principles
 * - Menos acoplamiento
 *
 * ⚠️ CUÁNDO USAR CADA UNO:
 * Herencia: Cuando hay una clara relación IS-A
 * Composición: En la mayoría de los demás casos
 */

// ============================================
// HERENCIA: Ventajas y Desventajas
// ============================================

/**
 * EJEMPLO: Jerarquía de empleados con HERENCIA
 *
 * ✅ VENTAJAS:
 * - Código compartido (DRY)
 * - Polimorfismo
 * - Clara jerarquía IS-A
 *
 * ❌ DESVENTAJAS:
 * - Acoplamiento fuerte padre-hijo
 * - Jerarquías frágiles (cambios en padre afectan a todos)
 * - Difícil de extender (solo puedes heredar de una clase en TS)
 * - Puede violarse LSP fácilmente
 */

/**
 * Clase base: Employee
 */
abstract class Employee {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly baseSalary: number
  ) {}

  // Método compartido
  getInfo(): string {
    return `${this.name} (ID: ${this.id})`;
  }

  // Método abstracto: cada tipo calcula diferente
  abstract calculatePay(): number;
  abstract getRole(): string;
}

/**
 * Clase derivada: Full-time employee
 */
class FullTimeEmployee extends Employee {
  constructor(
    id: string,
    name: string,
    baseSalary: number,
    private benefits: number
  ) {
    super(id, name, baseSalary);
  }

  calculatePay(): number {
    return this.baseSalary + this.benefits;
  }

  getRole(): string {
    return "Full-Time Employee";
  }
}

/**
 * Clase derivada: Contractor
 */
class Contractor extends Employee {
  constructor(
    id: string,
    name: string,
    private hourlyRate: number,
    private hoursWorked: number
  ) {
    super(id, name, 0); // No tiene baseSalary
  }

  calculatePay(): number {
    return this.hourlyRate * this.hoursWorked;
  }

  getRole(): string {
    return "Contractor";
  }
}

/**
 * 💥 PROBLEMA: ¿Qué pasa si necesitamos un Manager que también es Developer?
 *
 * class Manager extends Employee { ... }
 * class Developer extends Employee { ... }
 *
 * ❌ NO PODEMOS: class ManagerDeveloper extends Manager, Developer
 * TypeScript (y Java, C#) no permiten herencia múltiple
 *
 * 💥 PROBLEMA: Jerarquía frágil
 * Si cambiamos Employee base, afecta a TODAS las subclases
 */

// ============================================
// COMPOSICIÓN: Alternativa flexible
// ============================================

/**
 * SOLUCIÓN: Usar COMPOSICIÓN en vez de herencia
 *
 * ✅ VENTAJAS:
 * - Flexible: Puedes combinar múltiples comportamientos
 * - Menos acoplamiento
 * - Más fácil de testear (mock components)
 * - Más fácil de extender
 * - Favorece SOLID
 */

/**
 * Componente: Salary calculator
 */
interface SalaryCalculator {
  calculatePay(): number;
  getDescription(): string;
}

class FullTimeSalary implements SalaryCalculator {
  constructor(
    private baseSalary: number,
    private benefits: number
  ) {}

  calculatePay(): number {
    return this.baseSalary + this.benefits;
  }

  getDescription(): string {
    return `Full-time: $${this.baseSalary/100} base + $${this.benefits/100} benefits`;
  }
}

class HourlySalary implements SalaryCalculator {
  constructor(
    private hourlyRate: number,
    private hoursWorked: number
  ) {}

  calculatePay(): number {
    return this.hourlyRate * this.hoursWorked;
  }

  getDescription(): string {
    return `Hourly: ${this.hoursWorked}h @ $${this.hourlyRate/100}/h`;
  }
}

/**
 * Componente: Role
 */
interface Role {
  getTitle(): string;
  getResponsibilities(): string[];
}

class ManagerRole implements Role {
  getTitle(): string {
    return "Manager";
  }

  getResponsibilities(): string[] {
    return ["Team management", "Budget planning", "Performance reviews"];
  }
}

class DeveloperRole implements Role {
  getTitle(): string {
    return "Developer";
  }

  getResponsibilities(): string[] {
    return ["Code implementation", "Code reviews", "Technical documentation"];
  }
}

/**
 * ✅ Composición: Employee TIENE SalaryCalculator y Roles
 *
 * No hereda de nada, compone con components
 */
class EmployeeComposition {
  private roles: Role[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    private salaryCalculator: SalaryCalculator
  ) {}

  // Agregar roles dinámicamente
  addRole(role: Role): void {
    this.roles.push(role);
  }

  calculatePay(): number {
    return this.salaryCalculator.calculatePay();
  }

  getInfo(): string {
    const rolesTitles = this.roles.map(r => r.getTitle()).join(" & ");
    return `${this.name} - ${rolesTitles || "No roles"}`;
  }

  getAllResponsibilities(): string[] {
    return this.roles.flatMap(r => r.getResponsibilities());
  }
}

/**
 * ✅ VENTAJA: Puedes combinar roles fácilmente
 */
const managerDeveloper = new EmployeeComposition(
  "emp_001",
  "Alice",
  new FullTimeSalary(10000000, 50000)
);

// ✅ Alice puede ser Manager Y Developer
managerDeveloper.addRole(new ManagerRole());
managerDeveloper.addRole(new DeveloperRole());

console.log(managerDeveloper.getInfo()); // "Alice - Manager & Developer"
console.log(managerDeveloper.getAllResponsibilities());
// ["Team management", "Budget planning", ..., "Code implementation", ...]

/**
 * EJEMPLO: Payment con Composición
 *
 * 💰 BILLING: Stripe usa composición extensivamente
 */

/**
 * Componente: Payment method
 */
interface PaymentMethod {
  charge(amount: number): Promise<{ success: boolean; transactionId?: string }>;
  getName(): string;
}

class CreditCardMethod implements PaymentMethod {
  constructor(private cardNumber: string) {}

  async charge(amount: number): Promise<{ success: boolean; transactionId?: string }> {
    console.log(`Charging $${amount/100} to card ${this.cardNumber.slice(-4)}`);
    return { success: true, transactionId: `cc_${Date.now()}` };
  }

  getName(): string {
    return `Card ending in ${this.cardNumber.slice(-4)}`;
  }
}

class BankTransferMethod implements PaymentMethod {
  constructor(private accountNumber: string) {}

  async charge(amount: number): Promise<{ success: boolean; transactionId?: string }> {
    console.log(`Transferring $${amount/100} from account ${this.accountNumber}`);
    return { success: true, transactionId: `bt_${Date.now()}` };
  }

  getName(): string {
    return `Bank account ${this.accountNumber}`;
  }
}

/**
 * Componente: Discount strategy
 */
interface DiscountStrategy {
  calculate(amount: number): number;
  getDescription(): string;
}

class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {}

  calculate(amount: number): number {
    return Math.round(amount * this.percentage);
  }

  getDescription(): string {
    return `${this.percentage * 100}% off`;
  }
}

class FixedDiscount implements DiscountStrategy {
  constructor(private amount: number) {}

  calculate(amount: number): number {
    return Math.min(this.amount, amount);
  }

  getDescription(): string {
    return `$${this.amount/100} off`;
  }
}

/**
 * ✅ Composición: Payment compone PaymentMethod y Discounts
 */
class Payment {
  private discounts: DiscountStrategy[] = [];

  constructor(
    public readonly id: string,
    private amount: number,
    private paymentMethod: PaymentMethod
  ) {}

  addDiscount(discount: DiscountStrategy): void {
    this.discounts.push(discount);
  }

  // Cambiar payment method dinámicamente
  changePaymentMethod(newMethod: PaymentMethod): void {
    this.paymentMethod = newMethod;
  }

  calculateFinalAmount(): number {
    let finalAmount = this.amount;

    for (const discount of this.discounts) {
      const discountAmount = discount.calculate(finalAmount);
      finalAmount -= discountAmount;
      console.log(`Applied ${discount.getDescription()}: -$${discountAmount/100}`);
    }

    return finalAmount;
  }

  async process(): Promise<void> {
    const finalAmount = this.calculateFinalAmount();
    console.log(`\nProcessing payment via ${this.paymentMethod.getName()}`);
    console.log(`Final amount: $${finalAmount/100}`);

    const result = await this.paymentMethod.charge(finalAmount);

    if (result.success) {
      console.log(`✅ Payment successful: ${result.transactionId}`);
    }
  }
}

// Uso
const payment = new Payment(
  "pay_123",
  10000, // $100
  new CreditCardMethod("4242424242424242")
);

payment.addDiscount(new PercentageDiscount(0.1)); // 10% off
payment.addDiscount(new FixedDiscount(500)); // $5 off

await payment.process();

// ✅ Puedes cambiar payment method dinámicamente
payment.changePaymentMethod(new BankTransferMethod("123456789"));
await payment.process();

// ============================================
// MIXINS: Composición en TypeScript
// ============================================

/**
 * Pattern: Mixins para compartir funcionalidad
 *
 * ✅ Combina ventajas de herencia y composición
 */

/**
 * Mixin: Timestamped
 */
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    readonly createdAt = Date.now();
    updatedAt = Date.now();

    updateTimestamp(): void {
      this.updatedAt = Date.now();
    }
  };
}

/**
 * Mixin: Identifiable
 */
function Identifiable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    readonly id = `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    getId(): string {
      return this.id;
    }
  };
}

/**
 * Clase base simple
 */
class Transaction {
  constructor(public amount: number) {}

  getAmount(): number {
    return this.amount;
  }
}

/**
 * ✅ Aplicar múltiples mixins
 */
const TimestampedTransaction = Timestamped(Transaction);
const IdentifiableTimestampedTransaction = Identifiable(TimestampedTransaction);

const txn = new IdentifiableTimestampedTransaction(5000);
console.log(txn.getId()); // Tiene getId() del mixin
console.log(txn.createdAt); // Tiene createdAt del mixin
console.log(txn.getAmount()); // Tiene getAmount() de Transaction

// ============================================
// COMPARACIÓN: Cuándo usar cada uno
// ============================================

/**
 * 🎯 GUÍA DE DECISIÓN:
 *
 * USA HERENCIA cuando:
 * ✅ Hay una clara relación IS-A
 * ✅ La jerarquía es estable (no cambiará mucho)
 * ✅ Necesitas polimorfismo
 * ✅ Ejemplo: Animal -> Dog, Cat (Dog IS-A Animal)
 *
 * USA COMPOSICIÓN cuando:
 * ✅ Relación HAS-A o USES-A
 * ✅ Necesitas flexibilidad
 * ✅ Quieres combinar múltiples comportamientos
 * ✅ La jerarquía puede cambiar
 * ✅ Ejemplo: Car HAS-A Engine, HAS-A Wheels
 *
 * EJEMPLO PRÁCTICO - Payment System:
 *
 * ❌ HERENCIA (malo):
 * class Payment {}
 * class CreditCardPayment extends Payment {}
 * class RefundableCreditCardPayment extends CreditCardPayment {}
 * class RecurringRefundableCreditCardPayment extends RefundableCreditCardPayment {}
 * ^ Jerarquía frágil, combinación explosiva de clases
 *
 * ✅ COMPOSICIÓN (bueno):
 * class Payment {
 *   constructor(
 *     private method: PaymentMethod,
 *     private refundService?: RefundService,
 *     private recurringService?: RecurringService
 *   ) {}
 * }
 * ^ Flexible, puedes combinar servicios según necesites
 */

/**
 * CASO DE USO: Notification System
 *
 * ❌ CON HERENCIA (problemático):
 */
class Notification {
  send() { /* ... */ }
}

class EmailNotification extends Notification {
  sendEmail() { /* ... */ }
}

class SMSNotification extends Notification {
  sendSMS() { /* ... */ }
}

// 💥 PROBLEMA: ¿Cómo hacer EmailAndSMSNotification?
// ❌ No puedes heredar de ambos

/**
 * ✅ CON COMPOSICIÓN (flexible):
 */
interface NotificationChannel {
  send(message: string): void;
}

class EmailChannel implements NotificationChannel {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

class SMSChannel implements NotificationChannel {
  send(message: string): void {
    console.log(`SMS: ${message}`);
  }
}

class ComposableNotification {
  private channels: NotificationChannel[] = [];

  addChannel(channel: NotificationChannel): void {
    this.channels.push(channel);
  }

  send(message: string): void {
    this.channels.forEach(channel => channel.send(message));
  }
}

// ✅ Flexible: Puedes combinar cualquier número de canales
const notification = new ComposableNotification();
notification.addChannel(new EmailChannel());
notification.addChannel(new SMSChannel());
notification.send("Payment received"); // Envía por email Y SMS

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES:
 *
 * 1. PAYMENT METHODS (Composición):
 *    Payment HAS-A PaymentMethod
 *    Payment HAS-A DiscountStrategy
 *    Payment HAS-A TaxCalculator
 *
 * 2. INVOICES (Composición):
 *    Invoice HAS-A LineItems[]
 *    Invoice HAS-A Customer
 *    Invoice HAS-A PaymentTerms
 *
 * 3. SUBSCRIPTIONS (Composición):
 *    Subscription HAS-A PricingPlan
 *    Subscription HAS-A BillingSchedule
 *    Subscription HAS-A PaymentMethod
 *
 * 4. USERS (Mixins):
 *    User with Timestamped mixin
 *    User with Billable mixin
 *    User with Notifiable mixin
 *
 * 5. ENTITIES (Herencia limitada):
 *    BaseEntity -> Payment, Customer, Invoice
 *    (Solo para compartir id, timestamps básicos)
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Composición > Herencia en la mayoría de casos!");
console.log("=".repeat(60));

export {
  Employee,
  FullTimeEmployee,
  Contractor,
  SalaryCalculator,
  Role,
  EmployeeComposition,
  PaymentMethod,
  DiscountStrategy,
  Payment,
  NotificationChannel,
  ComposableNotification,
};
