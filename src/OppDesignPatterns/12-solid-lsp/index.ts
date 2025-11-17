/**
 * ==========================================
 * SOLID: LISKOV SUBSTITUTION PRINCIPLE (LSP)
 * ==========================================
 *
 * "Los objetos de una clase derivada deben poder reemplazar
 * objetos de la clase base sin alterar la corrección del programa"
 * - Barbara Liskov
 *
 * 📚 CONCEPTO CLAVE:
 * Si clase B hereda de clase A, debes poder usar B en cualquier lugar
 * donde se espera A, sin romper el comportamiento esperado.
 *
 * 🏢 USO EN BIG TECH:
 * Stripe garantiza LSP en su jerarquía:
 * - PaymentMethod base
 * - Card, BankAccount, Wallet (todas substituibles)
 * - Cualquier código que acepte PaymentMethod funciona con cualquier subtipo
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Polimorfismo seguro
 * - Reutilización de código
 * - Comportamiento predecible
 * - Menos bugs sutiles
 *
 * 🔑 REGLAS DE LSP:
 * 1. Precondiciones no pueden fortalecerse en subtipos
 * 2. Postcondiciones no pueden debilitarse en subtipos
 * 3. Invariantes deben preservarse
 * 4. Historia constraint (no modificar propiedades inmutables)
 */

// ============================================
// ❌ VIOLACIÓN DE LSP
// ============================================

/**
 * EJEMPLO CLÁSICO: Rectangle y Square
 *
 * 💥 PROBLEMA: Square viola LSP porque rompe invariante de Rectangle
 */

class RectangleBad {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class SquareBad extends RectangleBad {
  constructor(size: number) {
    super(size, size);
  }

  // ❌ VIOLACIÓN: Fortalece contrato del padre
  // Rectangle permite width != height
  // Square fuerza width === height
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Cambia comportamiento!
  }

  setHeight(height: number): void {
    this.width = height; // Cambia comportamiento!
    this.height = height;
  }
}

/**
 * Función que espera Rectangle
 */
function testRectangle(rect: RectangleBad): void {
  // Expectativa razonable: setWidth solo cambia width
  rect.setWidth(5);
  rect.setHeight(10);

  // Expectativa: área = 5 * 10 = 50
  const area = rect.getArea();
  console.log(`Expected area: 50, Got: ${area}`);

  if (area !== 50) {
    console.error("❌ LSP violated! Behavior changed with subtype");
  }
}

// Con Rectangle: funciona
testRectangle(new RectangleBad(0, 0)); // ✅ área = 50

// Con Square: FALLA
testRectangle(new SquareBad(0)); // ❌ área = 100 (no 50!)

/**
 * EJEMPLO: Payment con violación de LSP
 *
 * 💥 PROBLEMA: RefundablePayment viola contrato de Payment
 */

class PaymentBad {
  constructor(
    public id: string,
    public amount: number,
    public status: "pending" | "succeeded" | "failed"
  ) {}

  process(): void {
    console.log(`Processing payment ${this.id}`);
    this.status = "succeeded";
  }

  // Precondición: Payment puede procesarse en cualquier momento
  // Postcondición: Payment procesado tiene status "succeeded"
}

class RefundablePaymentBad extends PaymentBad {
  private refunded: boolean = false;

  // ❌ VIOLACIÓN: Fortalece precondición
  // Ahora NO se puede procesar si ya está refunded
  process(): void {
    if (this.refunded) {
      throw new Error("Cannot process refunded payment");
    }
    super.process();
  }

  refund(): void {
    this.refunded = true;
    console.log(`Payment ${this.id} refunded`);
  }
}

/**
 * Código que espera Payment
 */
function processPayments(payments: PaymentBad[]): void {
  payments.forEach((payment) => {
    payment.process(); // Expectativa: siempre funciona
  });
}

// Con PaymentBad: funciona
const payments1 = [
  new PaymentBad("pay_1", 1000, "pending"),
  new PaymentBad("pay_2", 2000, "pending"),
];
processPayments(payments1); // ✅

// Con RefundablePaymentBad: PUEDE FALLAR
const refundablePayment = new RefundablePaymentBad("pay_3", 3000, "pending");
refundablePayment.refund(); // Marcar como refunded

try {
  processPayments([refundablePayment]); // ❌ Lanza excepción!
} catch (error) {
  console.error("❌ LSP violated!", error);
}

// ============================================
// ✅ CUMPLIMIENTO DE LSP
// ============================================

/**
 * SOLUCIÓN: Usar composición en vez de herencia
 *
 * En lugar de Square extends Rectangle,
 * usar interfaces o composition
 */

interface Shape {
  getArea(): number;
  getPerimeter(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Square implements Shape {
  constructor(private size: number) {}

  getSize(): number {
    return this.size;
  }

  setSize(size: number): void {
    this.size = size;
  }

  getArea(): number {
    return this.size * this.size;
  }

  getPerimeter(): number {
    return 4 * this.size;
  }
}

/**
 * Función que trabaja con Shape
 * ✅ Funciona con Rectangle y Square sin problemas
 */
function calculateArea(shape: Shape): number {
  return shape.getArea();
}

console.log(calculateArea(new Rectangle(5, 10))); // 50
console.log(calculateArea(new Square(5))); // 25

/**
 * SOLUCIÓN: Payment con LSP
 *
 * ✅ Subtipos no fortalecen precondiciones
 */

interface Payment {
  readonly id: string;
  readonly amount: number;
  status: "pending" | "succeeded" | "failed";
}

/**
 * Procesador base que define contrato
 */
abstract class PaymentProcessor {
  protected payment: Payment;

  constructor(payment: Payment) {
    this.payment = payment;
  }

  // Contrato: Puede llamarse en cualquier momento
  // No lanza excepciones
  process(): void {
    // Precondición: ninguna (siempre se puede llamar)
    console.log(`Processing payment ${this.payment.id}`);

    // Validación interna (no fortalece precondición)
    if (!this.canProcess()) {
      console.warn(`Payment ${this.payment.id} cannot be processed, skipping`);
      return; // No lanza, solo retorna
    }

    // Procesamiento específico
    this.executeProcessing();

    // Postcondición: status actualizado
    this.payment.status = "succeeded";
  }

  // Hook para subclases
  protected abstract canProcess(): boolean;
  protected abstract executeProcessing(): void;
}

/**
 * ✅ CUMPLE LSP: No fortalece contrato del padre
 */
class StandardPaymentProcessor extends PaymentProcessor {
  protected canProcess(): boolean {
    // Puede procesar si está pending
    return this.payment.status === "pending";
  }

  protected executeProcessing(): void {
    console.log(`[Standard] Processing ${this.payment.amount}`);
  }
}

/**
 * ✅ CUMPLE LSP: Agrega funcionalidad sin violar contrato
 */
class RefundablePaymentProcessor extends PaymentProcessor {
  private refunded: boolean = false;

  protected canProcess(): boolean {
    // No lanza excepción, solo retorna false si refunded
    return this.payment.status === "pending" && !this.refunded;
  }

  protected executeProcessing(): void {
    console.log(`[Refundable] Processing ${this.payment.amount}`);
  }

  refund(): void {
    this.refunded = true;
    console.log(`Payment ${this.payment.id} refunded`);
  }
}

/**
 * Cliente que trabaja con PaymentProcessor
 * ✅ Funciona con cualquier subtipo
 */
function processAllPayments(processors: PaymentProcessor[]): void {
  processors.forEach((processor) => {
    processor.process(); // Siempre seguro, nunca lanza
  });
}

// ✅ Ambos funcionan sin problemas
const payment1: Payment = { id: "pay_1", amount: 1000, status: "pending" };
const payment2: Payment = { id: "pay_2", amount: 2000, status: "pending" };

const processor1 = new StandardPaymentProcessor(payment1);
const refundableProcessor = new RefundablePaymentProcessor(payment2);

refundableProcessor.refund(); // Refund antes de procesar

processAllPayments([processor1, refundableProcessor]); // ✅ No lanza

// ============================================
// EJEMPLO: Payment Methods con LSP
// ============================================

/**
 * Interface base: Define contrato estricto
 */
interface PaymentMethod {
  process(amount: number): Promise<PaymentResult>;
  validate(): Promise<boolean>;
  getDisplayName(): string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

/**
 * ✅ CUMPLE LSP: Todas las implementaciones respetan el contrato
 */

class CreditCardPayment implements PaymentMethod {
  constructor(private cardNumber: string) {}

  async validate(): Promise<boolean> {
    // Valida formato de tarjeta
    return this.cardNumber.length === 16;
  }

  async process(amount: number): Promise<PaymentResult> {
    // Precondición del contrato: amount > 0 (común a todos)
    if (amount <= 0) {
      return { success: false, errorMessage: "Invalid amount" };
    }

    // Validación específica (no fortalece precondición general)
    if (!(await this.validate())) {
      return { success: false, errorMessage: "Invalid card" };
    }

    // Simular procesamiento
    return {
      success: true,
      transactionId: `cc_${Date.now()}`,
    };
  }

  getDisplayName(): string {
    return `Card ending in ${this.cardNumber.slice(-4)}`;
  }
}

class BankTransferPayment implements PaymentMethod {
  constructor(private accountNumber: string) {}

  async validate(): Promise<boolean> {
    return this.accountNumber.length > 0;
  }

  async process(amount: number): Promise<PaymentResult> {
    // ✅ Misma precondición que CreditCard (no fortalecida)
    if (amount <= 0) {
      return { success: false, errorMessage: "Invalid amount" };
    }

    if (!(await this.validate())) {
      return { success: false, errorMessage: "Invalid account" };
    }

    // Simular procesamiento
    return {
      success: true,
      transactionId: `bt_${Date.now()}`,
    };
  }

  getDisplayName(): string {
    return `Bank account ${this.accountNumber}`;
  }
}

/**
 * Cliente que trabaja con PaymentMethod
 *
 * ✅ Puede usar cualquier implementación intercambiablemente
 */
async function chargeCustomer(
  paymentMethod: PaymentMethod,
  amount: number
): Promise<void> {
  console.log(`\nCharging ${paymentMethod.getDisplayName()}...`);

  // Esta lógica funciona con CUALQUIER PaymentMethod
  const result = await paymentMethod.process(amount);

  if (result.success) {
    console.log(`✅ Success: ${result.transactionId}`);
  } else {
    console.log(`❌ Failed: ${result.errorMessage}`);
  }
}

// ✅ LSP: Ambas implementaciones funcionan igual
const creditCard = new CreditCardPayment("4242424242424242");
const bankTransfer = new BankTransferPayment("123456789");

await chargeCustomer(creditCard, 5000);
await chargeCustomer(bankTransfer, 7500);

// ============================================
// EJEMPLO: Discount Strategies con LSP
// ============================================

/**
 * Contrato de estrategia de descuento
 */
interface DiscountStrategy {
  // Contrato: Siempre retorna número >= 0 y <= amount
  calculate(amount: number): number;
  getDescription(): string;
}

/**
 * ✅ CUMPLE LSP: Respeta postcondición
 */
class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {
    // Validar en construcción
    if (percentage < 0 || percentage > 1) {
      throw new Error("Percentage must be between 0 and 1");
    }
  }

  calculate(amount: number): number {
    // ✅ Postcondición: 0 <= result <= amount
    return Math.round(amount * this.percentage);
  }

  getDescription(): string {
    return `${this.percentage * 100}% off`;
  }
}

/**
 * ✅ CUMPLE LSP: Respeta postcondición
 */
class FixedAmountDiscount implements DiscountStrategy {
  constructor(private discountAmount: number) {
    if (discountAmount < 0) {
      throw new Error("Discount amount must be positive");
    }
  }

  calculate(amount: number): number {
    // ✅ Postcondición: 0 <= result <= amount
    return Math.min(this.discountAmount, amount);
  }

  getDescription(): string {
    return `$${this.discountAmount / 100} off`;
  }
}

/**
 * Cliente que trabaja con DiscountStrategy
 */
function applyDiscount(amount: number, strategy: DiscountStrategy): number {
  const discount = strategy.calculate(amount);

  // Invariante que DEBE cumplirse (gracias a LSP)
  console.assert(discount >= 0, "Discount must be non-negative");
  console.assert(discount <= amount, "Discount cannot exceed amount");

  console.log(`${strategy.getDescription()}: -$${discount / 100}`);
  return amount - discount;
}

// ✅ LSP: Ambas estrategias funcionan correctamente
const finalAmount1 = applyDiscount(10000, new PercentageDiscount(0.2));
const finalAmount2 = applyDiscount(10000, new FixedAmountDiscount(1500));

console.log(`Final amounts: $${finalAmount1 / 100}, $${finalAmount2 / 100}`);

// ============================================
// DEMOSTRACIÓN COMPLETA
// ============================================

console.log("\n" + "=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Liskov Substitution Principle");
console.log("=".repeat(60));

console.log("\n❌ VIOLACIÓN DE LSP:");
console.log("Square extends Rectangle rompe comportamiento esperado");
// Ya demostrado arriba

console.log("\n✅ CUMPLIMIENTO DE LSP:");
console.log("Shapes implementan interface, son intercambiables");
// Ya demostrado arriba

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. PAYMENT METHODS:
 *    - PaymentMethod interface
 *    - Card, BankAccount, Wallet deben ser sustituibles
 *    - Stripe garantiza esto
 *
 * 2. PRICING STRATEGIES:
 *    - PricingStrategy interface
 *    - Flat, tiered, usage-based intercambiables
 *    - Chargebee pricing engine
 *
 * 3. TAX CALCULATORS:
 *    - TaxCalculator interface
 *    - US, EU, VAT calculators sustituibles
 *    - Avalara tax system
 *
 * 4. DISCOUNT STRATEGIES:
 *    - DiscountStrategy interface
 *    - Percentage, fixed, tiered intercambiables
 *    - WooCommerce discounts
 *
 * 5. NOTIFICATION CHANNELS:
 *    - NotificationChannel interface
 *    - Email, SMS, Push sustituibles
 *    - Twilio, SendGrid
 *
 * 6. REPORT GENERATORS:
 *    - ReportGenerator interface
 *    - PDF, Excel, CSV intercambiables
 *    - QuickBooks reports
 *
 * 7. PAYMENT PROCESSORS:
 *    - PaymentProcessor base
 *    - Sync, async, batch processors sustituibles
 *    - Adyen payment processing
 */

console.log("\n" + "=".repeat(60));
console.log("💡 REGLAS DE LSP");
console.log("=".repeat(60));

/**
 * 🔑 REGLAS FORMALES DE LSP:
 *
 * 1. PRECONDICIONES NO PUEDEN FORTALECERSE:
 *    ✅ Padre: accepts amount > 0
 *    ✅ Hijo: accepts amount > 0 (igual)
 *    ❌ Hijo: accepts amount > 100 (más restrictivo)
 *
 * 2. POSTCONDICIONES NO PUEDEN DEBILITARSE:
 *    ✅ Padre: returns number >= 0
 *    ✅ Hijo: returns number >= 0 (igual)
 *    ❌ Hijo: returns any number (menos restrictivo)
 *
 * 3. INVARIANTES DEBEN PRESERVARSE:
 *    ✅ Padre: amount nunca negativo
 *    ✅ Hijo: amount nunca negativo (preservado)
 *    ❌ Hijo: amount puede ser negativo (violado)
 *
 * 4. HISTORIA (propiedades inmutables):
 *    ✅ Padre: id es readonly
 *    ✅ Hijo: id es readonly (preservado)
 *    ❌ Hijo: id es mutable (violado)
 *
 * 5. NO LANZAR EXCEPCIONES NUEVAS:
 *    ✅ Padre: no lanza excepciones
 *    ✅ Hijo: no lanza excepciones
 *    ❌ Hijo: lanza IllegalStateException
 *
 * ⚠️ SEÑALES DE VIOLACIÓN:
 *
 * 1. INSTANCEOF CHECKS:
 *    ❌ if (payment instanceof RefundablePayment)
 *    Indica que subtipos no son sustituibles
 *
 * 2. TYPE CHECKING:
 *    ❌ if (payment.type === "refundable")
 *    Indica que necesitas saber el tipo concreto
 *
 * 3. EXCEPCIONES EN SUBTIPOS:
 *    ❌ Subtipo lanza cuando padre no
 *    Rompe contrato
 *
 * 4. TESTS QUE FALLAN:
 *    ❌ Tests del padre fallan con hijo
 *    Clara violación de LSP
 *
 * 5. EMPTY METHODS:
 *    ❌ class ReadOnlyPayment { save() {} }
 *    Indica abstracción incorrecta
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿LSP solo aplica a herencia de clases?
 *    Pista: No, también a interfaces y tipos
 *
 * 2. ¿Cómo validar que cumples LSP?
 *    Pista: Tests del padre deben pasar con hijos
 *
 * 3. ¿LSP vs Design by Contract?
 *    Pista: LSP formaliza DbC para subtipos
 *
 * 4. ¿Cuándo usar composition sobre herencia?
 *    Pista: Cuando LSP es difícil de mantener
 *
 * 5. ¿Covariance y contravariance violan LSP?
 *    Pista: Pueden, depende del lenguaje
 *
 * 6. ¿Cómo LSP se relaciona con Open/Closed?
 *    Pista: OCP permite extensión, LSP garantiza seguridad
 *
 * 7. ¿TypeScript garantiza LSP?
 *    Pista: Ayuda pero no garantiza (types != runtime)
 *
 * 8. ¿Qué es "refused bequest" code smell?
 *    Pista: Subclase no usa métodos del padre
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Identifica y corrige violación de LSP:
 *    class Bird { fly(): void }
 *    class Penguin extends Bird {
 *      fly(): void { throw new Error("Can't fly") }
 *    }
 *
 * 2. INTERMEDIO:
 *    Diseña jerarquía de payment methods que respete LSP:
 *    - PaymentMethod base
 *    - Card, BankAccount, Crypto
 *    - Garantiza sustituibilidad
 *    - Tests que validen LSP
 *
 * 3. AVANZADO:
 *    Implementa pricing strategies con LSP:
 *    - Interface PricingStrategy
 *    - Flat, Tiered, Volume, Usage
 *    - Precondiciones y postcondiciones claras
 *    - Contract tests
 *
 * 4. EXPERTO:
 *    Refactoriza código legacy que viola LSP:
 *    - Identificar violaciones
 *    - Usar composition donde sea apropiado
 *    - Preservar backward compatibility
 *    - Suite de tests completa
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Subtipos sustituibles!");
console.log("=".repeat(60));

export {
  Shape,
  Rectangle,
  Square,
  Payment,
  PaymentProcessor,
  StandardPaymentProcessor,
  RefundablePaymentProcessor,
  PaymentMethod,
  PaymentResult,
  CreditCardPayment,
  BankTransferPayment,
  DiscountStrategy,
  PercentageDiscount,
  FixedAmountDiscount,
};
