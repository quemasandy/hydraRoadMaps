/**
 * ==========================================
 * CLASES EN TYPESCRIPT
 * ==========================================
 *
 * Las clases son la base de la programación orientada a objetos.
 * TypeScript extiende las clases de JavaScript con tipos y modificadores.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Propiedades y métodos de clase
 * - Constructores
 * - Modificadores de acceso (public, private, protected)
 * - Getters y Setters
 * - Clases abstractas
 * - Herencia y polimorfismo
 *
 * 🏢 USO EN BIG TECH:
 * Stripe SDK usa clases extensivamente:
 * - Stripe class (singleton entry point)
 * - Resource classes (Customer, Payment, Invoice)
 * - Service classes (CustomerService, PaymentService)
 * - Error classes (StripeError hierarchy)
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Encapsulación: Agrupar datos y comportamiento
 * - Reutilización: Herencia y composición
 * - Type safety: Propiedades y métodos tipados
 * - Polimorfismo: Diferentes implementaciones de la misma interfaz
 */

// ============================================
// PARTE 1: PROPIEDADES Y MÉTODOS
// ============================================

/**
 * 🔑 CONCEPTO: Clase básica con propiedades y métodos
 *
 * SINTAXIS:
 * class ClassName {
 *   property: Type;
 *   method(): ReturnType { }
 * }
 *
 * 🏢 BIG TECH: Stripe Payment class
 */

/**
 * Clase: Representa un pago
 */
class Payment {
  // Propiedades: Datos del pago
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  createdAt: number;

  // Constructor: Inicializa el objeto
  // Se ejecuta cuando haces: new Payment(...)
  constructor(amount: number, currency: string) {
    this.id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.amount = amount;
    this.currency = currency;
    this.status = "pending";
    this.createdAt = Date.now();
  }

  // Método: Procesar el pago
  // 'this' se refiere a la instancia actual
  process(): void {
    console.log(`Processing payment ${this.id} for ${this.amount} ${this.currency}`);

    // Simular procesamiento
    const success = Math.random() > 0.2;

    if (success) {
      this.status = "succeeded";
      console.log(`✅ Payment ${this.id} succeeded`);
    } else {
      this.status = "failed";
      console.log(`❌ Payment ${this.id} failed`);
    }
  }

  // Método: Obtener resumen
  getSummary(): string {
    return `Payment ${this.id}: ${this.amount / 100} ${this.currency} - ${this.status}`;
  }

  // Método: Verificar si está completo
  isCompleted(): boolean {
    return this.status === "succeeded" || this.status === "failed";
  }
}

// Uso de la clase
const payment1 = new Payment(2999, "USD");
console.log(payment1.getSummary());
payment1.process();
console.log(payment1.getSummary());

// ============================================
// PARTE 2: CONSTRUCTORES
// ============================================

/**
 * 🔑 CONCEPTO: Constructores avanzados
 *
 * - Constructor parameters
 * - Parameter properties (shorthand)
 * - Optional parameters
 * - Default values
 * - Constructor overloading
 *
 * 🏢 BIG TECH: PayPal SDK usa parameter properties extensivamente
 */

/**
 * Clase: Customer con constructor avanzado
 */
class Customer {
  // Parameter properties: Declara y asigna en una línea
  // 'public' hace que el parámetro se convierta en propiedad automáticamente
  constructor(
    public readonly id: string, // readonly: inmutable después de construcción
    public email: string,
    public name?: string, // Optional parameter
    public metadata: Record<string, string> = {} // Default value
  ) {
    // El constructor está vacío porque parameter properties
    // automáticamente asignan this.id, this.email, etc.

    // Validación en constructor
    if (!this.isValidEmail(email)) {
      throw new Error(`Invalid email: ${email}`);
    }
  }

  // Método privado de validación
  private isValidEmail(email: string): boolean {
    return email.includes("@");
  }

  // Método: Actualizar metadata
  setMetadata(key: string, value: string): void {
    this.metadata[key] = value;
  }

  // Método: Obtener display name
  getDisplayName(): string {
    return this.name ?? this.email;
  }
}

// Uso
const customer1 = new Customer("cus_123", "john@example.com", "John Doe");
const customer2 = new Customer("cus_456", "jane@example.com"); // Sin name
const customer3 = new Customer("cus_789", "bob@example.com", "Bob", { tier: "premium" });

console.log(customer1.getDisplayName()); // "John Doe"
console.log(customer2.getDisplayName()); // "jane@example.com"

// ============================================
// PARTE 3: MODIFICADORES DE ACCESO
// ============================================

/**
 * 🔑 CONCEPTO: Modificadores de acceso
 *
 * - public: Accesible desde cualquier lugar (default)
 * - private: Solo accesible dentro de la clase
 * - protected: Accesible en la clase y subclases
 *
 * 🏢 BIG TECH: Stripe usa private para secretos, protected para extensibilidad
 *
 * 💡 ENCAPSULACIÓN: Ocultar detalles de implementación
 */

/**
 * Clase: Stripe API Client con encapsulación
 */
class StripeClient {
  // public: Accesible desde fuera (default)
  public readonly publishableKey: string;

  // private: Solo accesible dentro de esta clase
  // Se marca con '#' en JavaScript o 'private' en TypeScript
  private secretKey: string;
  private apiVersion: string;

  // protected: Accesible en esta clase y subclases
  protected baseUrl: string;

  constructor(secretKey: string, publishableKey: string) {
    this.secretKey = secretKey;
    this.publishableKey = publishableKey;
    this.apiVersion = "2023-10-16";
    this.baseUrl = "https://api.stripe.com/v1";
  }

  // Método public: API pública
  public async createCharge(amount: number, currency: string): Promise<Payment> {
    // Validar internamente
    this.validateAmount(amount);

    // Usar método privado
    const headers = this.buildHeaders();

    console.log(`Creating charge with ${headers.authorization.substring(0, 20)}...`);

    // Simular creación
    return new Payment(amount, currency);
  }

  // Método private: Solo para uso interno
  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }
    if (amount > 999999999) {
      throw new Error("Amount too large");
    }
  }

  // Método private: Construir headers
  private buildHeaders(): Record<string, string> {
    return {
      "authorization": `Bearer ${this.secretKey}`,
      "stripe-version": this.apiVersion,
    };
  }

  // Método protected: Disponible para subclases
  protected log(message: string): void {
    console.log(`[StripeClient] ${message}`);
  }

  // ❌ ERROR: No puedes acceder a private desde fuera
  // const client = new StripeClient("sk_test_123", "pk_test_456");
  // client.secretKey; // Error de compilación
  // client.validateAmount(100); // Error de compilación
}

/**
 * Clase: Extended Stripe Client
 * Demuestra 'protected' access
 */
class ExtendedStripeClient extends StripeClient {
  // Constructor que llama al constructor padre
  constructor(secretKey: string, publishableKey: string) {
    super(secretKey, publishableKey); // Llamar constructor padre
  }

  // Método que usa 'protected' del padre
  public createTestCharge(): void {
    // ✅ OK: baseUrl es protected
    console.log(`Using base URL: ${this.baseUrl}`);

    // ✅ OK: log() es protected
    this.log("Creating test charge");

    // ❌ ERROR: secretKey es private
    // console.log(this.secretKey); // Error de compilación
  }
}

// ============================================
// PARTE 4: GETTERS Y SETTERS
// ============================================

/**
 * 🔑 CONCEPTO: Getters y Setters (Accessors)
 *
 * - get: Propiedad computada (se accede como propiedad)
 * - set: Validación y lógica al asignar
 *
 * SINTAXIS:
 * get propertyName(): Type { return value; }
 * set propertyName(value: Type) { this.field = value; }
 *
 * 🏢 BIG TECH: Amazon usa getters para formateo, setters para validación
 *
 * 💡 VENTAJA: Parece propiedad, pero ejecuta lógica
 */

/**
 * Clase: Invoice con getters y setters
 */
class Invoice {
  private _amount: number; // Convención: _ para backing field
  private _dueDate: number;

  public readonly id: string;
  public customerId: string;
  public status: "draft" | "open" | "paid" | "void";

  constructor(customerId: string, amount: number, dueInDays: number) {
    this.id = `inv_${Date.now()}`;
    this.customerId = customerId;
    this._amount = amount;
    this._dueDate = Date.now() + (dueInDays * 86400000);
    this.status = "draft";
  }

  // Getter: Se accede como propiedad
  // invoice.amount (sin paréntesis)
  get amount(): number {
    return this._amount;
  }

  // Setter: Se asigna como propiedad
  // invoice.amount = 5000
  set amount(value: number) {
    // Validación en setter
    if (value <= 0) {
      throw new Error("Amount must be positive");
    }

    // Solo permitir cambios en draft
    if (this.status !== "draft") {
      throw new Error("Cannot modify amount of non-draft invoice");
    }

    this._amount = value;
    console.log(`Invoice ${this.id} amount updated to ${value}`);
  }

  // Getter: Propiedad computada
  get amountDue(): number {
    // Retornar 0 si ya está pagada
    return this.status === "paid" ? 0 : this._amount;
  }

  // Getter: Formato legible
  get amountFormatted(): string {
    return `$${(this._amount / 100).toFixed(2)}`;
  }

  // Getter: Verificar si está vencida
  get isOverdue(): boolean {
    return Date.now() > this._dueDate && this.status !== "paid";
  }

  // Getter: Días hasta vencimiento
  get daysUntilDue(): number {
    const diff = this._dueDate - Date.now();
    return Math.ceil(diff / 86400000);
  }

  // Setter con validación compleja
  set dueDate(timestamp: number) {
    // Validar que sea futuro
    if (timestamp <= Date.now()) {
      throw new Error("Due date must be in the future");
    }

    // Solo permitir cambios en draft
    if (this.status !== "draft") {
      throw new Error("Cannot modify due date of non-draft invoice");
    }

    this._dueDate = timestamp;
  }

  get dueDate(): number {
    return this._dueDate;
  }

  // Método: Marcar como pagada
  markAsPaid(): void {
    if (this.status === "paid") {
      throw new Error("Invoice already paid");
    }
    this.status = "paid";
    console.log(`Invoice ${this.id} marked as paid`);
  }
}

// Uso de getters y setters
const invoice = new Invoice("cus_123", 10000, 30);

// Getter: Se accede como propiedad
console.log(`Amount: ${invoice.amount}`); // 10000
console.log(`Formatted: ${invoice.amountFormatted}`); // $100.00
console.log(`Amount due: ${invoice.amountDue}`); // 10000
console.log(`Days until due: ${invoice.daysUntilDue}`); // ~30

// Setter: Se asigna como propiedad
invoice.amount = 15000; // Ejecuta validación
console.log(`New amount: ${invoice.amountFormatted}`); // $150.00

// Getter computado
invoice.markAsPaid();
console.log(`Amount due after payment: ${invoice.amountDue}`); // 0

// ============================================
// PARTE 5: CLASES ABSTRACTAS
// ============================================

/**
 * 🔑 CONCEPTO: Clases abstractas
 *
 * - No se pueden instanciar directamente
 * - Sirven como base para otras clases
 * - Pueden tener métodos abstractos (sin implementación)
 * - Pueden tener métodos concretos (con implementación)
 *
 * SINTAXIS:
 * abstract class Base { abstract method(): void; }
 * class Concrete extends Base { method(): void { } }
 *
 * 🏢 BIG TECH: Stripe tiene PaymentMethod abstract, luego Card, BankAccount
 *
 * 💡 PATRÓN: Template Method, Strategy
 */

/**
 * Clase abstracta: Payment Gateway
 * Define contrato para diferentes procesadores
 */
abstract class PaymentGateway {
  // Propiedad concreta: Disponible en todas las subclases
  protected readonly name: string;
  protected apiKey: string;

  constructor(name: string, apiKey: string) {
    this.name = name;
    this.apiKey = apiKey;
  }

  // Método abstracto: DEBE ser implementado por subclases
  // No tiene cuerpo (sin { })
  abstract processPayment(amount: number, currency: string): Promise<string>;
  abstract refundPayment(transactionId: string, amount: number): Promise<void>;
  abstract validateApiKey(): Promise<boolean>;

  // Método concreto: Implementación compartida
  // Disponible en todas las subclases
  public async createCharge(amount: number, currency: string): Promise<string> {
    // Template Method pattern: Define el flujo
    console.log(`[${this.name}] Creating charge for ${amount} ${currency}`);

    // 1. Validar API key
    const isValid = await this.validateApiKey();
    if (!isValid) {
      throw new Error("Invalid API key");
    }

    // 2. Validar amount
    this.validateAmount(amount);

    // 3. Procesar (implementación específica de subclase)
    const transactionId = await this.processPayment(amount, currency);

    // 4. Log
    this.log(`Charge created: ${transactionId}`);

    return transactionId;
  }

  // Método concreto protegido: Helper para subclases
  protected validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }
  }

  // Método concreto protegido: Logging
  protected log(message: string): void {
    console.log(`[${this.name}] ${message}`);
  }
}

/**
 * Clase concreta: Stripe Gateway
 * Implementa métodos abstractos
 */
class StripeGateway extends PaymentGateway {
  constructor(apiKey: string) {
    super("Stripe", apiKey);
  }

  // Implementación de método abstracto
  async processPayment(amount: number, currency: string): Promise<string> {
    this.log(`Processing ${amount} ${currency} via Stripe`);

    // Simular llamada a Stripe API
    await this.simulateApiCall();

    return `stripe_txn_${Date.now()}`;
  }

  // Implementación de método abstracto
  async refundPayment(transactionId: string, amount: number): Promise<void> {
    this.log(`Refunding ${amount} for ${transactionId}`);
    await this.simulateApiCall();
  }

  // Implementación de método abstracto
  async validateApiKey(): Promise<boolean> {
    // En real: Validar con Stripe API
    return this.apiKey.startsWith("sk_");
  }

  // Método específico de Stripe (no en la clase base)
  async createCustomer(email: string): Promise<string> {
    this.log(`Creating Stripe customer: ${email}`);
    await this.simulateApiCall();
    return `cus_${Date.now()}`;
  }

  private async simulateApiCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Clase concreta: PayPal Gateway
 * Diferente implementación de los mismos métodos
 */
class PayPalGateway extends PaymentGateway {
  private sandboxMode: boolean;

  constructor(apiKey: string, sandboxMode: boolean = false) {
    super("PayPal", apiKey);
    this.sandboxMode = sandboxMode;
  }

  async processPayment(amount: number, currency: string): Promise<string> {
    const mode = this.sandboxMode ? "sandbox" : "production";
    this.log(`Processing ${amount} ${currency} via PayPal (${mode})`);

    await this.simulateApiCall();

    return `paypal_txn_${Date.now()}`;
  }

  async refundPayment(transactionId: string, amount: number): Promise<void> {
    this.log(`Refunding ${amount} for ${transactionId}`);
    await this.simulateApiCall();
  }

  async validateApiKey(): Promise<boolean> {
    // PayPal tiene formato diferente
    return this.apiKey.length > 20;
  }

  private async simulateApiCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 150));
  }
}

// ❌ ERROR: No puedes instanciar clase abstracta
// const gateway = new PaymentGateway("test", "key"); // Error de compilación

// ✅ OK: Instanciar clases concretas
const stripeGateway = new StripeGateway("sk_test_123");
const paypalGateway = new PayPalGateway("paypal_key_456", true);

// Polimorfismo: Tratar diferentes gateways igual
async function processWithGateway(gateway: PaymentGateway, amount: number): Promise<void> {
  const txnId = await gateway.createCharge(amount, "USD");
  console.log(`Transaction created: ${txnId}`);
}

// ============================================
// PARTE 6: HERENCIA Y POLIMORFISMO
// ============================================

/**
 * 🔑 CONCEPTO: Herencia
 *
 * - extends: Clase hija hereda de clase padre
 * - super: Llamar constructor/métodos del padre
 * - override: Sobreescribir métodos del padre
 * - Polimorfismo: Diferentes comportamientos con misma interfaz
 *
 * 🏢 BIG TECH: Error hierarchy (StripeError -> CardError, APIError, etc.)
 *
 * 💡 LISKOV SUBSTITUTION PRINCIPLE: Subclase debe poder reemplazar padre
 */

/**
 * Clase base: Base Error
 */
class PaymentError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly timestamp: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    // super() llama al constructor de Error
    super(message);

    // Set the prototype explicitly (TypeScript quirk con Error)
    Object.setPrototypeOf(this, PaymentError.prototype);

    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = Date.now();
    this.name = "PaymentError"; // Sobreescribir name de Error
  }

  // Método que puede ser sobreescrito
  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Clase derivada: Card Error
 * Hereda de PaymentError
 */
class CardError extends PaymentError {
  public readonly declineCode?: string;
  public readonly cardBrand?: string;

  constructor(
    message: string,
    code: string,
    declineCode?: string,
    cardBrand?: string
  ) {
    // super() llama al constructor del padre (PaymentError)
    super(message, code, 402);

    Object.setPrototypeOf(this, CardError.prototype);

    this.declineCode = declineCode;
    this.cardBrand = cardBrand;
    this.name = "CardError";
  }

  // Override: Sobreescribir método del padre
  toJSON(): object {
    return {
      ...super.toJSON(), // Llamar método del padre con super
      declineCode: this.declineCode,
      cardBrand: this.cardBrand,
    };
  }

  // Método específico de CardError
  getUserMessage(): string {
    switch (this.declineCode) {
      case "insufficient_funds":
        return "Your card has insufficient funds.";
      case "expired_card":
        return "Your card has expired.";
      case "invalid_cvc":
        return "The card's security code is incorrect.";
      default:
        return "Your card was declined.";
    }
  }
}

/**
 * Clase derivada: API Error
 */
class APIError extends PaymentError {
  public readonly requestId?: string;

  constructor(message: string, code: string, statusCode: number, requestId?: string) {
    super(message, code, statusCode);
    Object.setPrototypeOf(this, APIError.prototype);

    this.requestId = requestId;
    this.name = "APIError";
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      requestId: this.requestId,
    };
  }
}

/**
 * POLIMORFISMO: Manejar diferentes errores de forma uniforme
 */
function handlePaymentError(error: PaymentError): void {
  // error puede ser PaymentError, CardError, o APIError
  // Todos tienen las propiedades básicas
  console.error(`[${error.code}] ${error.message}`);
  console.error(`Status: ${error.statusCode}`);

  // Type narrowing: Verificar tipo específico
  if (error instanceof CardError) {
    // Aquí TypeScript sabe que error es CardError
    console.error(`Decline code: ${error.declineCode}`);
    console.error(`User message: ${error.getUserMessage()}`);
  } else if (error instanceof APIError) {
    // Aquí TypeScript sabe que error es APIError
    console.error(`Request ID: ${error.requestId}`);
  }

  // toJSON() está disponible en todos (polimorfismo)
  console.error("Full error:", error.toJSON());
}

// Crear diferentes tipos de errores
const cardError = new CardError(
  "Card declined",
  "card_declined",
  "insufficient_funds",
  "visa"
);

const apiError = new APIError(
  "Rate limit exceeded",
  "rate_limit",
  429,
  "req_123"
);

// Polimorfismo: Tratar diferentes tipos de forma uniforme
handlePaymentError(cardError);
handlePaymentError(apiError);

/**
 * EJEMPLO: Jerarquía de descuentos
 */
abstract class Discount {
  constructor(public readonly name: string) {}

  // Método abstracto: Cada subclase calcula diferente
  abstract calculateDiscount(amount: number): number;

  // Método concreto: Común a todos
  apply(amount: number): number {
    const discount = this.calculateDiscount(amount);
    const final = amount - discount;
    console.log(`${this.name}: $${amount/100} - $${discount/100} = $${final/100}`);
    return final;
  }
}

class PercentageDiscount extends Discount {
  constructor(name: string, private percentage: number) {
    super(name);
  }

  calculateDiscount(amount: number): number {
    return Math.round(amount * this.percentage);
  }
}

class FixedDiscount extends Discount {
  constructor(name: string, private fixedAmount: number) {
    super(name);
  }

  calculateDiscount(amount: number): number {
    return Math.min(this.fixedAmount, amount);
  }
}

class TieredDiscount extends Discount {
  constructor(
    name: string,
    private tiers: Array<{ threshold: number; percentage: number }>
  ) {
    super(name);
  }

  calculateDiscount(amount: number): number {
    // Encontrar tier aplicable
    const tier = this.tiers
      .filter(t => amount >= t.threshold)
      .sort((a, b) => b.threshold - a.threshold)[0];

    if (!tier) return 0;

    return Math.round(amount * tier.percentage);
  }
}

// Polimorfismo: Array de diferentes tipos de descuentos
const discounts: Discount[] = [
  new PercentageDiscount("10% off", 0.10),
  new FixedDiscount("$20 off", 2000),
  new TieredDiscount("Volume discount", [
    { threshold: 10000, percentage: 0.05 },
    { threshold: 50000, percentage: 0.10 },
    { threshold: 100000, percentage: 0.15 },
  ]),
];

// Aplicar todos los descuentos (polimorfismo)
const originalAmount = 75000; // $750
discounts.forEach(discount => discount.apply(originalAmount));

// ============================================
// DEMOSTRACIÓN COMPLETA
// ============================================

console.log("\n" + "=".repeat(60));
console.log("🎯 DEMOSTRACIÓN COMPLETA: Clases en TypeScript");
console.log("=".repeat(60));

// 1. Propiedades y métodos
console.log("\n1️⃣ PROPIEDADES Y MÉTODOS:");
const payment = new Payment(5000, "USD");
payment.process();

// 2. Constructores
console.log("\n2️⃣ CONSTRUCTORES:");
const customer = new Customer("cus_999", "test@example.com", "Test User");
customer.setMetadata("plan", "premium");
console.log(`Customer: ${customer.getDisplayName()}`);

// 3. Modificadores de acceso
console.log("\n3️⃣ MODIFICADORES DE ACCESO:");
const stripe = new StripeClient("sk_test_secret", "pk_test_public");
stripe.createCharge(10000, "USD");

// 4. Getters y Setters
console.log("\n4️⃣ GETTERS Y SETTERS:");
const inv = new Invoice("cus_123", 25000, 30);
console.log(`Invoice: ${inv.amountFormatted}, due in ${inv.daysUntilDue} days`);
inv.amount = 30000;

// 5. Clases abstractas
console.log("\n5️⃣ CLASES ABSTRACTAS:");
processWithGateway(stripeGateway, 15000);
processWithGateway(paypalGateway, 15000);

// 6. Herencia y polimorfismo
console.log("\n6️⃣ HERENCIA Y POLIMORFISMO:");
const errors: PaymentError[] = [
  new CardError("Card declined", "card_declined", "insufficient_funds"),
  new APIError("Internal error", "internal_error", 500, "req_789"),
];
errors.forEach(handlePaymentError);

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. ENTITY MODELS:
 *    class Payment, class Customer, class Invoice
 *    - Encapsular datos y comportamiento
 *    - Validación en constructores y setters
 *
 * 2. SERVICE CLASSES:
 *    class PaymentService, class InvoiceService
 *    - Lógica de negocio
 *    - Coordinación entre entidades
 *
 * 3. GATEWAY ABSTRACTION:
 *    abstract class PaymentGateway
 *    class StripeGateway, class PayPalGateway
 *    - Strategy pattern
 *    - Intercambiable
 *
 * 4. ERROR HIERARCHY:
 *    class PaymentError extends Error
 *    - Clasificación de errores
 *    - Manejo específico por tipo
 *
 * 5. DISCOUNT STRATEGIES:
 *    abstract class Discount
 *    - Diferentes algoritmos de descuento
 *    - Polimorfismo
 *
 * 6. VALIDATORS:
 *    class CreditCardValidator
 *    - Encapsular lógica de validación
 *    - Reutilizable
 *
 * 7. REPOSITORIES:
 *    abstract class Repository<T>
 *    class PaymentRepository extends Repository<Payment>
 *    - Data access layer
 *    - Type-safe
 */

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS");
console.log("=".repeat(60));

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. SINGLE RESPONSIBILITY:
 *    ✅ class Payment {} - solo datos de pago
 *    ✅ class PaymentProcessor {} - solo procesar
 *    ❌ class PaymentEverything {} - hace todo
 *
 * 2. USA PARAMETER PROPERTIES:
 *    ✅ constructor(public readonly id: string) {}
 *    - Más conciso
 *    - Menos boilerplate
 *
 * 3. ENCAPSULACIÓN:
 *    ✅ private para detalles de implementación
 *    ✅ protected para extensibilidad
 *    ✅ public solo lo necesario
 *
 * 4. GETTERS/SETTERS PARA VALIDACIÓN:
 *    ✅ set amount(value) { validate(value); }
 *    - Validación centralizada
 *    - API limpia
 *
 * 5. CLASES ABSTRACTAS PARA CONTRATOS:
 *    ✅ abstract class PaymentGateway {}
 *    - Define interfaz común
 *    - Comparte implementación
 *
 * 6. HERENCIA POCO PROFUNDA:
 *    ✅ 2-3 niveles máximo
 *    ❌ 5+ niveles de herencia
 *    - Preferir composición
 *
 * 7. INMUTABILIDAD CUANDO SEA POSIBLE:
 *    ✅ readonly id: string
 *    - Menos bugs
 *    - Thread-safe
 *
 * ⚠️ ERRORES COMUNES:
 *
 * 1. TODO PUBLIC:
 *    ❌ Exponer detalles internos
 *    ✅ Minimal public API
 *
 * 2. NO VALIDAR EN CONSTRUCTORES:
 *    ❌ Permitir objetos inválidos
 *    ✅ Validar en construcción
 *
 * 3. HERENCIA PROFUNDA:
 *    ❌ 5+ niveles
 *    ✅ Preferir composición
 *
 * 4. OLVID super() EN CONSTRUCTORES:
 *    ❌ Error en runtime
 *    ✅ Siempre llamar super()
 *
 * 5. NO USAR Object.setPrototypeOf CON Error:
 *    ❌ instanceof no funciona
 *    ✅ Usar setPrototypeOf
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre clase e interface?
 *    Pista: Clases tienen implementación, interfaces solo forma
 *
 * 2. ¿Cuándo usar class vs function con closures?
 *    Pista: State compartido, herencia, instanceof
 *
 * 3. ¿Por qué usar getters/setters en vez de propiedades directas?
 *    Pista: Validación, computed values, side effects
 *
 * 4. ¿Cuándo usar abstract class vs interface?
 *    Pista: Abstract puede tener implementación
 *
 * 5. ¿Qué es 'this' en métodos de clase?
 *    Pista: Binding, arrow functions vs regular functions
 *
 * 6. ¿Cómo funcionan las clases en JavaScript (bajo el capó)?
 *    Pista: Syntactic sugar sobre prototypes
 *
 * 7. ¿Cuándo preferir composición sobre herencia?
 *    Pista: Casi siempre (favor composition over inheritance)
 *
 * 8. ¿Qué son static methods y cuándo usarlos?
 *    Pista: Factory methods, utilities
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea una clase CreditCard con:
 *    - Propiedades: number, cvv, expMonth, expYear (privadas)
 *    - Getters: last4, isExpired
 *    - Método: validate() usando algoritmo de Luhn
 *
 * 2. INTERMEDIO:
 *    Implementa jerarquía de notificaciones:
 *    - abstract class Notification
 *    - class EmailNotification, SMSNotification, PushNotification
 *    - Método abstracto send()
 *    - Método concreto log()
 *
 * 3. AVANZADO:
 *    Crea un sistema de pricing con Strategy pattern:
 *    - abstract class PricingStrategy
 *    - Diferentes estrategias (Flat, Tiered, Volume, Usage-based)
 *    - class Product que usa PricingStrategy
 *    - Calcular precio según estrategia
 *
 * 4. EXPERTO:
 *    Implementa un ORM simple:
 *    - abstract class Model<T>
 *    - Métodos: save(), update(), delete(), find()
 *    - class Payment extends Model<Payment>
 *    - Type-safe queries
 *    - Validaciones
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Domina las clases!");
console.log("=".repeat(60));

export {
  Payment,
  Customer,
  StripeClient,
  Invoice,
  PaymentGateway,
  StripeGateway,
  PayPalGateway,
  PaymentError,
  CardError,
  APIError,
  Discount,
  PercentageDiscount,
  FixedDiscount,
  TieredDiscount,
};
