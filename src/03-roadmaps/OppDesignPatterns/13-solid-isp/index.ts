/**
 * ==========================================
 * SOLID: INTERFACE SEGREGATION PRINCIPLE (ISP)
 * ==========================================
 *
 * "Los clientes no deberían estar forzados a depender de
 * interfaces que no usan"
 * - Robert C. Martin
 *
 * 📚 CONCEPTO CLAVE:
 * Es mejor tener muchas interfaces específicas que una
 * interface "gorda" con muchos métodos que no todos necesitan.
 *
 * 🏢 USO EN BIG TECH:
 * Stripe segrega interfaces claramente:
 * - Chargeable (can be charged)
 * - Refundable (can be refunded)
 * - Updateable (can be updated)
 * - Deletable (can be deleted)
 * No todo es todo a la vez.
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Reduce acoplamiento
 * - Interfaces más cohesivas
 * - Más fácil de implementar
 * - Más fácil de testear
 * - Cambios menos invasivos
 */

// ============================================
// ❌ VIOLACIÓN DE ISP
// ============================================

/**
 * EJEMPLO MALO: Interface "gorda" que hace TODO
 *
 * 💥 PROBLEMA: No todos los payment methods soportan todas las operaciones
 */
interface PaymentProcessorBad {
  // Operaciones básicas
  process(amount: number): Promise<void>;
  validate(): Promise<boolean>;

  // Operaciones de refund
  refund(amount: number): Promise<void>;
  getRefundHistory(): Refund[];

  // Operaciones de recurring
  setupRecurring(interval: string): Promise<void>;
  cancelRecurring(): Promise<void>;
  getRecurringSchedule(): Schedule[];

  // Operaciones de partial payment
  capturePartial(amount: number): Promise<void>;
  getRemainingAmount(): number;

  // Operaciones de 3D Secure
  authenticate3DS(): Promise<void>;
  verify3DSResponse(response: string): boolean;
}

interface Refund {
  id: string;
  amount: number;
}

interface Schedule {
  nextDate: number;
  amount: number;
}

/**
 * ❌ PROBLEMA: Cash Payment no puede hacer refunds, recurring, etc.
 */
class CashPaymentBad implements PaymentProcessorBad {
  async process(amount: number): Promise<void> {
    console.log(`Processing cash payment: $${amount}`);
  }

  async validate(): Promise<boolean> {
    return true;
  }

  // ❌ Métodos que no tienen sentido para cash
  async refund(amount: number): Promise<void> {
    throw new Error("Cash payments cannot be refunded");
  }

  getRefundHistory(): Refund[] {
    throw new Error("Cash payments have no refund history");
  }

  async setupRecurring(interval: string): Promise<void> {
    throw new Error("Cash payments cannot be recurring");
  }

  async cancelRecurring(): Promise<void> {
    throw new Error("Cash payments cannot be recurring");
  }

  getRecurringSchedule(): Schedule[] {
    throw new Error("Cash payments have no recurring schedule");
  }

  async capturePartial(amount: number): Promise<void> {
    throw new Error("Cash payments cannot be captured partially");
  }

  getRemainingAmount(): number {
    throw new Error("Cash payments have no remaining amount");
  }

  async authenticate3DS(): Promise<void> {
    throw new Error("Cash payments don't use 3D Secure");
  }

  verify3DSResponse(response: string): boolean {
    throw new Error("Cash payments don't use 3D Secure");
  }
}

/**
 * 💥 PROBLEMAS:
 * - CashPayment debe implementar 10 métodos que no usa
 * - Lanza excepciones en runtime (debería ser compile-time error)
 * - Cliente puede llamar métodos que no funcionan
 * - Tests tienen que mockear cosas que no importan
 * - Difícil de mantener
 */

/**
 * Cliente que usa PaymentProcessorBad
 */
function processPaymentBad(processor: PaymentProcessorBad): void {
  // ¿Es seguro llamar refund? No lo sabemos
  try {
    processor.refund(100);
  } catch {
    // Runtime error!
  }
}

// ============================================
// ✅ CUMPLIMIENTO DE ISP
// ============================================

/**
 * SOLUCIÓN: Segregar en interfaces pequeñas y cohesivas
 *
 * Cada interface tiene un propósito específico
 */

/**
 * Interface mínima: Todo payment method debe poder hacer esto
 */
interface PaymentProcessor {
  process(amount: number): Promise<void>;
  validate(): Promise<boolean>;
  getDisplayName(): string;
}

/**
 * Interface segregada: Solo para payments que soportan refunds
 */
interface Refundable {
  refund(amount: number): Promise<void>;
  getRefundHistory(): Refund[];
  canRefund(amount: number): boolean;
}

/**
 * Interface segregada: Solo para payments recurrentes
 */
interface Recurring {
  setupRecurring(interval: "daily" | "weekly" | "monthly"): Promise<void>;
  cancelRecurring(): Promise<void>;
  getRecurringSchedule(): Schedule[];
}

/**
 * Interface segregada: Solo para payments con captura parcial
 */
interface PartialCapture {
  capturePartial(amount: number): Promise<void>;
  getRemainingAmount(): number;
  getTotalAuthorized(): number;
}

/**
 * Interface segregada: Solo para payments con 3D Secure
 */
interface ThreeDSecure {
  authenticate3DS(): Promise<string>;
  verify3DSResponse(response: string): boolean;
  requires3DS(): boolean;
}

/**
 * ✅ Cash Payment: Solo implementa lo que necesita
 */
class CashPayment implements PaymentProcessor {
  constructor(private amount: number) {}

  async process(amount: number): Promise<void> {
    console.log(`[Cash] Processing $${amount / 100}`);
  }

  async validate(): Promise<boolean> {
    return this.amount > 0;
  }

  getDisplayName(): string {
    return "Cash Payment";
  }

  // ✅ No necesita implementar refund, recurring, etc.
}

/**
 * ✅ Credit Card: Implementa múltiples interfaces
 */
class CreditCardPayment
  implements PaymentProcessor, Refundable, Recurring, ThreeDSecure
{
  private refunds: Refund[] = [];
  private recurringInterval?: string;

  constructor(
    private cardNumber: string,
    private totalAmount: number
  ) {}

  // PaymentProcessor
  async process(amount: number): Promise<void> {
    console.log(`[Credit Card] Processing $${amount / 100}`);
  }

  async validate(): Promise<boolean> {
    return this.cardNumber.length === 16;
  }

  getDisplayName(): string {
    return `Card ending in ${this.cardNumber.slice(-4)}`;
  }

  // Refundable
  async refund(amount: number): Promise<void> {
    console.log(`[Credit Card] Refunding $${amount / 100}`);
    this.refunds.push({ id: `ref_${Date.now()}`, amount });
  }

  getRefundHistory(): Refund[] {
    return this.refunds;
  }

  canRefund(amount: number): boolean {
    const totalRefunded = this.refunds.reduce((sum, r) => sum + r.amount, 0);
    return totalRefunded + amount <= this.totalAmount;
  }

  // Recurring
  async setupRecurring(interval: "daily" | "weekly" | "monthly"): Promise<void> {
    console.log(`[Credit Card] Setting up ${interval} recurring payment`);
    this.recurringInterval = interval;
  }

  async cancelRecurring(): Promise<void> {
    console.log(`[Credit Card] Cancelling recurring payment`);
    this.recurringInterval = undefined;
  }

  getRecurringSchedule(): Schedule[] {
    if (!this.recurringInterval) return [];
    // Retornar schedule simulado
    return [{ nextDate: Date.now() + 86400000, amount: this.totalAmount }];
  }

  // ThreeDSecure
  async authenticate3DS(): Promise<string> {
    console.log(`[Credit Card] Authenticating via 3D Secure`);
    return "3ds_token_123";
  }

  verify3DSResponse(response: string): boolean {
    console.log(`[Credit Card] Verifying 3DS response`);
    return response.startsWith("3ds_");
  }

  requires3DS(): boolean {
    return this.totalAmount > 10000; // Require 3DS for amounts > $100
  }
}

/**
 * ✅ Bank Transfer: Solo refundable, no recurring
 */
class BankTransferPayment implements PaymentProcessor, Refundable {
  private refunds: Refund[] = [];

  constructor(
    private accountNumber: string,
    private totalAmount: number
  ) {}

  // PaymentProcessor
  async process(amount: number): Promise<void> {
    console.log(`[Bank Transfer] Processing $${amount / 100}`);
  }

  async validate(): Promise<boolean> {
    return this.accountNumber.length > 0;
  }

  getDisplayName(): string {
    return `Bank Transfer ${this.accountNumber}`;
  }

  // Refundable
  async refund(amount: number): Promise<void> {
    console.log(`[Bank Transfer] Refunding $${amount / 100}`);
    this.refunds.push({ id: `ref_${Date.now()}`, amount });
  }

  getRefundHistory(): Refund[] {
    return this.refunds;
  }

  canRefund(amount: number): boolean {
    const totalRefunded = this.refunds.reduce((sum, r) => sum + r.amount, 0);
    return totalRefunded + amount <= this.totalAmount;
  }

  // ✅ No implementa Recurring, ThreeDSecure
}

/**
 * Cliente que trabaja con PaymentProcessor
 * ✅ Solo requiere interface mínima
 */
function processPayment(processor: PaymentProcessor): void {
  console.log(`Processing via ${processor.getDisplayName()}`);
  processor.process(5000);
}

// Funciona con todos
processPayment(new CashPayment(5000));
processPayment(new CreditCardPayment("4242424242424242", 5000));
processPayment(new BankTransferPayment("123456", 5000));

/**
 * Cliente que requiere refund específicamente
 * ✅ Type-safe: Solo acepta Refundable
 */
function refundPayment(processor: PaymentProcessor & Refundable, amount: number): void {
  // TypeScript garantiza que processor tiene refund()
  if (processor.canRefund(amount)) {
    processor.refund(amount);
    console.log(`Refund history: ${processor.getRefundHistory().length} refunds`);
  }
}

// ✅ Acepta: CreditCard, BankTransfer
refundPayment(new CreditCardPayment("4242424242424242", 10000), 1000);
refundPayment(new BankTransferPayment("123456", 10000), 1000);

// ❌ No acepta: Cash (no implementa Refundable)
// refundPayment(new CashPayment(5000), 1000); // Error de compilación!

/**
 * Cliente que requiere recurring
 */
function setupSubscription(processor: PaymentProcessor & Recurring): void {
  processor.setupRecurring("monthly");
  console.log(`Schedule: ${processor.getRecurringSchedule().length} payments`);
}

// ✅ Solo acepta: CreditCard
setupSubscription(new CreditCardPayment("4242424242424242", 10000));

// ❌ No acepta: Cash, BankTransfer
// setupSubscription(new CashPayment(5000)); // Error!
// setupSubscription(new BankTransferPayment("123456", 10000)); // Error!

// ============================================
// MÁS EJEMPLOS DE ISP
// ============================================

/**
 * EJEMPLO: CRUD operations segregadas
 *
 * ❌ MAL: interface Repository con todos los métodos
 * interface Repository {
 *   create(), read(), update(), delete()
 * }
 *
 * 💥 PROBLEMA: ReadOnlyRepository debe implementar create/update/delete
 */

/**
 * ✅ BIEN: Segregar en interfaces pequeñas
 */
interface Readable<T> {
  read(id: string): Promise<T | undefined>;
  list(): Promise<T[]>;
}

interface Creatable<T> {
  create(item: Omit<T, "id">): Promise<T>;
}

interface Updatable<T> {
  update(id: string, updates: Partial<T>): Promise<T | undefined>;
}

interface Deletable {
  delete(id: string): Promise<boolean>;
}

/**
 * Full CRUD: Combina todas las interfaces
 */
type FullRepository<T> = Readable<T> & Creatable<T> & Updatable<T> & Deletable;

/**
 * ✅ Read-only repository: Solo implementa Readable
 */
class ReadOnlyPaymentRepository implements Readable<Payment> {
  private payments = new Map<string, Payment>();

  async read(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async list(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  // ✅ No tiene create, update, delete
}

/**
 * ✅ Full repository: Implementa todas las interfaces
 */
class PaymentRepository implements FullRepository<Payment> {
  private payments = new Map<string, Payment>();

  // Readable
  async read(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async list(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  // Creatable
  async create(item: Omit<Payment, "id">): Promise<Payment> {
    const payment: Payment = { id: `pay_${Date.now()}`, ...item };
    this.payments.set(payment.id, payment);
    return payment;
  }

  // Updatable
  async update(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const updated = { ...payment, ...updates };
    this.payments.set(id, updated);
    return updated;
  }

  // Deletable
  async delete(id: string): Promise<boolean> {
    return this.payments.delete(id);
  }
}

interface Payment {
  id: string;
  amount: number;
  status: string;
}

/**
 * Cliente que solo necesita lectura
 */
function displayPayments(repo: Readable<Payment>): void {
  // Solo puede llamar read() y list()
  // No puede modificar datos
}

// Funciona con ambos
displayPayments(new ReadOnlyPaymentRepository());
displayPayments(new PaymentRepository());

/**
 * Cliente que necesita modificación
 */
function updatePayment(repo: Updatable<Payment>, id: string): void {
  repo.update(id, { status: "succeeded" });
}

// Solo funciona con PaymentRepository
updatePayment(new PaymentRepository(), "pay_123");
// updatePayment(new ReadOnlyPaymentRepository(), "pay_123"); // Error!

// ============================================
// DEMOSTRACIÓN COMPLETA
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Interface Segregation Principle");
console.log("=".repeat(60));

console.log("\n❌ VIOLACIÓN DE ISP:");
console.log("Interface gorda fuerza a implementar métodos innecesarios");
const cashBad = new CashPaymentBad();
try {
  await cashBad.refund(100); // Lanza excepción en runtime!
} catch (error) {
  console.error("❌ Runtime error:", error.message);
}

console.log("\n✅ CUMPLIMIENTO DE ISP:");
console.log("Interfaces pequeñas y cohesivas");

const cash = new CashPayment(5000);
await cash.process(5000);
// cash.refund(100); // Error de compilación! ✅

const creditCard = new CreditCardPayment("4242424242424242", 10000);
await creditCard.process(10000);
await creditCard.refund(1000); // ✅ Tiene refund
await creditCard.setupRecurring("monthly"); // ✅ Tiene recurring

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. PAYMENT METHODS:
 *    - Processable (todos)
 *    - Refundable (card, bank, not cash)
 *    - Recurring (card, not cash/bank)
 *    - ThreeDSecure (card, not others)
 *
 * 2. REPOSITORIES:
 *    - Readable (reports, analytics)
 *    - Creatable (payment intake)
 *    - Updatable (status updates)
 *    - Deletable (admin operations)
 *
 * 3. ENTITIES:
 *    - Timestamped (created/updated)
 *    - Softdeletable (can be soft deleted)
 *    - Auditable (audit trail)
 *    - Versionable (version history)
 *
 * 4. NOTIFICATIONS:
 *    - Sendable (all notifications)
 *    - Retryable (email, SMS)
 *    - Batchable (bulk SMS)
 *    - Schedulable (delayed send)
 *
 * 5. PRICING:
 *    - Calculable (all prices)
 *    - Discountable (supports discounts)
 *    - Taxable (supports tax)
 *    - Prorated (usage-based)
 *
 * 6. INVOICES:
 *    - Generatable (create invoice)
 *    - Sendable (email invoice)
 *    - Payable (can be paid)
 *    - Voidable (can be voided)
 */

console.log("\n" + "=".repeat(60));
console.log("💡 BENEFICIOS DE ISP");
console.log("=".repeat(60));

/**
 * ✅ BENEFICIOS:
 *
 * 1. MENOS ACOPLAMIENTO:
 *    - Clientes dependen solo de lo que necesitan
 *    - Cambios en una interface no afectan a otras
 *
 * 2. MÁS COHESIÓN:
 *    - Interfaces enfocadas en un propósito
 *    - Métodos relacionados juntos
 *
 * 3. FÁCIL DE IMPLEMENTAR:
 *    - No tienes que implementar métodos que no necesitas
 *    - No lanzar NotImplementedError
 *
 * 4. FÁCIL DE TESTEAR:
 *    - Mocks más simples
 *    - Tests más enfocados
 *
 * 5. MEJOR COMPOSICIÓN:
 *    - Combinar interfaces pequeñas
 *    - type FullRepo = Readable & Creatable & Updatable
 *
 * ⚠️ SEÑALES DE VIOLACIÓN:
 *
 * 1. THROWING NotImplementedError:
 *    ❌ method() { throw new Error("Not supported") }
 *    Señal clara de que la interface es muy gorda
 *
 * 2. EMPTY IMPLEMENTATIONS:
 *    ❌ method() { /* do nothing */ }
 *    La clase no necesita este método
 *
 * 3. IMPLEMENTS CON DOLOR:
 *    ❌ class X implements Y tiene 10 métodos innecesarios
 *
 * 4. MUCHOS MÉTODOS EN INTERFACE:
 *    ⚠️ Interface con 15+ métodos
 *    Probablemente pueda segregarse
 *
 * 5. CLIENTS IGNORAN MÉTODOS:
 *    Si los clientes nunca llaman ciertos métodos,
 *    esos métodos no deberían estar en la interface
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuándo una interface es "demasiado pequeña"?
 *    Pista: Balance entre cohesión y practicidad
 *
 * 2. ¿ISP se contradice con DRY?
 *    Pista: No, diferentes concerns
 *
 * 3. ¿Cómo ISP se relaciona con SRP?
 *    Pista: SRP para clases, ISP para interfaces
 *
 * 4. ¿TypeScript ayuda con ISP?
 *    Pista: Sí, intersection types (&)
 *
 * 5. ¿ISP aplica a APIs REST?
 *    Pista: Sí, endpoints específicos vs monolíticos
 *
 * 6. ¿Cuándo combinar vs segregar interfaces?
 *    Pista: Combinar si siempre se usan juntas
 *
 * 7. ¿ISP causa proliferación de interfaces?
 *    Pista: Sí, pero beneficios > costos
 *
 * 8. ¿Cómo migrar de interface gorda a segregada?
 *    Pista: Crear nuevas interfaces, deprecar vieja
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Refactoriza esta interface gorda:
 *    interface Animal {
 *      walk(), fly(), swim(), climb()
 *    }
 *    Segrega en: Walkable, Flyable, Swimmable, Climbable
 *
 * 2. INTERMEDIO:
 *    Diseña sistema de usuarios con ISP:
 *    - Authenticatable
 *    - Authorizable
 *    - Notifiable
 *    - Billingable
 *    No todos los usuarios necesitan todas
 *
 * 3. AVANZADO:
 *    Implementa sistema de reportes:
 *    - Generatable (create report)
 *    - Exportable (export to PDF/Excel)
 *    - Schedulable (scheduled generation)
 *    - Shareable (share with others)
 *    Diferentes tipos de reportes soportan diferentes ops
 *
 * 4. EXPERTO:
 *    Crea sistema de plugins con ISP:
 *    - Plugin base (minimal interface)
 *    - Configurable, Lifecycle, Hookable, etc.
 *    - Plugins pueden implementar subset
 *    - Type-safe plugin system
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Interfaces pequeñas y cohesivas!");
console.log("=".repeat(60));

export {
  PaymentProcessor,
  Refundable,
  Recurring,
  PartialCapture,
  ThreeDSecure,
  CashPayment,
  CreditCardPayment,
  BankTransferPayment,
  Readable,
  Creatable,
  Updatable,
  Deletable,
  ReadOnlyPaymentRepository,
  PaymentRepository,
};
