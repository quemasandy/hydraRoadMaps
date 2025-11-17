/**
 * ==========================================
 * SOLID: OPEN/CLOSED PRINCIPLE (OCP)
 * ==========================================
 *
 * "Las entidades de software deben estar abiertas para extensión
 * pero cerradas para modificación"
 * - Bertrand Meyer
 *
 * 📚 CONCEPTO CLAVE:
 * Debes poder agregar nueva funcionalidad SIN modificar código existente.
 * Extensible por herencia, composición o plugins.
 *
 * 🏢 USO EN BIG TECH:
 * Stripe usa OCP extensivamente:
 * - Plugin architecture para payment methods
 * - Webhook handlers extensibles
 * - Custom metadata sin modificar core
 * - Apps marketplace (Stripe Apps)
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Reduce riesgo: No tocas código que funciona
 * - Escalabilidad: Fácil agregar features
 * - Mantenibilidad: Cambios localizados
 * - Testabilidad: Nuevo código, nuevos tests
 *
 * 🔑 CÓMO LOGRARLO:
 * - Abstracción (interfaces, abstract classes)
 * - Polimorfismo
 * - Dependency Injection
 * - Strategy Pattern
 * - Plugin Architecture
 */

// ============================================
// ❌ VIOLACIÓN DE OCP
// ============================================

/**
 * EJEMPLO MALO: Modificar código existente para cada nueva feature
 *
 * 💥 PROBLEMA: Cada nuevo payment method requiere modificar PaymentProcessorBad
 */
class PaymentProcessorBad {
  processPayment(type: string, amount: number): void {
    // ❌ Switch statement que crece con cada payment method
    switch (type) {
      case "credit_card":
        console.log(`Processing credit card payment: $${amount}`);
        // Lógica de tarjeta
        this.validateCard();
        this.chargeCreditCard(amount);
        break;

      case "paypal":
        console.log(`Processing PayPal payment: $${amount}`);
        // Lógica de PayPal
        this.authenticatePayPal();
        this.chargePayPal(amount);
        break;

      case "bank_transfer":
        console.log(`Processing bank transfer: $${amount}`);
        // Lógica de transferencia
        this.validateBankAccount();
        this.initiateBankTransfer(amount);
        break;

      // 💥 PROBLEMA: Para agregar Bitcoin, tenemos que MODIFICAR esta clase
      // case "bitcoin":
      //   ...
      //   break;

      default:
        throw new Error(`Unknown payment type: ${type}`);
    }
  }

  // Métodos específicos de cada tipo (mezclados en una clase)
  private validateCard(): void {
    console.log("Validating card...");
  }

  private chargeCreditCard(amount: number): void {
    console.log(`Charging card: $${amount}`);
  }

  private authenticatePayPal(): void {
    console.log("Authenticating PayPal...");
  }

  private chargePayPal(amount: number): void {
    console.log(`Charging PayPal: $${amount}`);
  }

  private validateBankAccount(): void {
    console.log("Validating bank account...");
  }

  private initiateBankTransfer(amount: number): void {
    console.log(`Initiating transfer: $${amount}`);
  }
}

/**
 * 💥 PROBLEMAS:
 * - Para agregar Bitcoin: Modificar clase existente
 * - Para agregar Apple Pay: Modificar clase existente
 * - Riesgo de romper código que funciona
 * - Tests existentes pueden fallar
 * - Viola Single Responsibility
 * - Clase crece infinitamente
 */

// ============================================
// ✅ CUMPLIMIENTO DE OCP
// ============================================

/**
 * SOLUCIÓN 1: Strategy Pattern con interfaces
 *
 * Abierto para extensión: Agrega nuevos PaymentMethod
 * Cerrado para modificación: No modificas PaymentProcessor
 *
 * 🏢 BIG TECH: Stripe PaymentMethod abstraction
 */

/**
 * Interface: Define contrato para payment methods
 */
interface PaymentMethod {
  readonly name: string;
  process(amount: number): Promise<void>;
  validate(): Promise<boolean>;
}

/**
 * Implementación: Credit Card
 */
class CreditCardPayment implements PaymentMethod {
  readonly name = "Credit Card";

  constructor(
    private cardNumber: string,
    private cvv: string,
    private expiryDate: string
  ) {}

  async validate(): Promise<boolean> {
    console.log("[Credit Card] Validating card...");
    // Validación de tarjeta (Luhn algorithm, etc.)
    return true;
  }

  async process(amount: number): Promise<void> {
    console.log(`[Credit Card] Processing $${amount / 100}`);
    // Lógica específica de tarjeta
    await this.chargeCard(amount);
  }

  private async chargeCard(amount: number): Promise<void> {
    // Llamar a gateway de pagos
    console.log(`[Credit Card] Charged $${amount / 100}`);
  }
}

/**
 * Implementación: PayPal
 */
class PayPalPayment implements PaymentMethod {
  readonly name = "PayPal";

  constructor(private email: string, private password: string) {}

  async validate(): Promise<boolean> {
    console.log("[PayPal] Authenticating...");
    // Autenticación con PayPal
    return true;
  }

  async process(amount: number): Promise<void> {
    console.log(`[PayPal] Processing $${amount / 100}`);
    await this.chargePayPal(amount);
  }

  private async chargePayPal(amount: number): Promise<void> {
    console.log(`[PayPal] Charged $${amount / 100}`);
  }
}

/**
 * Implementación: Bank Transfer
 */
class BankTransferPayment implements PaymentMethod {
  readonly name = "Bank Transfer";

  constructor(
    private accountNumber: string,
    private routingNumber: string
  ) {}

  async validate(): Promise<boolean> {
    console.log("[Bank Transfer] Validating account...");
    return true;
  }

  async process(amount: number): Promise<void> {
    console.log(`[Bank Transfer] Processing $${amount / 100}`);
    await this.initiateTransfer(amount);
  }

  private async initiateTransfer(amount: number): Promise<void> {
    console.log(`[Bank Transfer] Initiated $${amount / 100}`);
  }
}

/**
 * ✅ EXTENSIÓN: Agregar Bitcoin SIN modificar código existente
 */
class BitcoinPayment implements PaymentMethod {
  readonly name = "Bitcoin";

  constructor(private walletAddress: string) {}

  async validate(): Promise<boolean> {
    console.log("[Bitcoin] Validating wallet...");
    return this.isValidAddress(this.walletAddress);
  }

  async process(amount: number): Promise<void> {
    console.log(`[Bitcoin] Processing $${amount / 100}`);
    await this.sendBitcoin(amount);
  }

  private isValidAddress(address: string): boolean {
    // Validar dirección Bitcoin
    return address.length > 26;
  }

  private async sendBitcoin(amount: number): Promise<void> {
    console.log(`[Bitcoin] Sent BTC equivalent to $${amount / 100}`);
  }
}

/**
 * Processor: NO necesita modificarse para nuevos payment methods
 *
 * ✅ CERRADO para modificación
 * ✅ ABIERTO para extensión
 */
class PaymentProcessor {
  async processPayment(paymentMethod: PaymentMethod, amount: number): Promise<void> {
    console.log(`\nProcessing via ${paymentMethod.name}...`);

    // Validar
    const isValid = await paymentMethod.validate();
    if (!isValid) {
      throw new Error("Payment method validation failed");
    }

    // Procesar (polimorfismo)
    await paymentMethod.process(amount);

    console.log(`✅ Payment via ${paymentMethod.name} completed\n`);
  }
}

// ============================================
// SOLUCIÓN 2: Abstract Class para comportamiento compartido
// ============================================

/**
 * Abstract class con template method
 */
abstract class PaymentGateway {
  abstract readonly name: string;

  // Template method (define flujo)
  async executePayment(amount: number): Promise<void> {
    console.log(`\n[${this.name}] Starting payment flow...`);

    // 1. Pre-procesamiento (común)
    this.logTransaction(amount);

    // 2. Validación (específico de subclase)
    const isValid = await this.validate(amount);
    if (!isValid) {
      throw new Error("Validation failed");
    }

    // 3. Procesamiento (específico de subclase)
    await this.processPayment(amount);

    // 4. Post-procesamiento (común)
    this.recordTransaction(amount);

    console.log(`[${this.name}] ✅ Payment completed\n`);
  }

  // Métodos abstractos (subclases DEBEN implementar)
  protected abstract validate(amount: number): Promise<boolean>;
  protected abstract processPayment(amount: number): Promise<void>;

  // Métodos concretos (compartidos)
  protected logTransaction(amount: number): void {
    console.log(`[${this.name}] Logging transaction: $${amount / 100}`);
  }

  protected recordTransaction(amount: number): void {
    console.log(`[${this.name}] Recording transaction: $${amount / 100}`);
  }
}

/**
 * ✅ EXTENSIÓN: Stripe Gateway
 */
class StripeGateway extends PaymentGateway {
  readonly name = "Stripe";

  constructor(private apiKey: string) {
    super();
  }

  protected async validate(amount: number): Promise<boolean> {
    console.log(`[Stripe] Validating with API key: ${this.apiKey.substring(0, 10)}...`);
    return amount > 50; // Mínimo $0.50
  }

  protected async processPayment(amount: number): Promise<void> {
    console.log(`[Stripe] Charging $${amount / 100} via Stripe API`);
    // Llamar a Stripe API
  }
}

/**
 * ✅ EXTENSIÓN: Square Gateway
 */
class SquareGateway extends PaymentGateway {
  readonly name = "Square";

  constructor(private accessToken: string) {
    super();
  }

  protected async validate(amount: number): Promise<boolean> {
    console.log(`[Square] Validating with token: ${this.accessToken.substring(0, 10)}...`);
    return true;
  }

  protected async processPayment(amount: number): Promise<void> {
    console.log(`[Square] Charging $${amount / 100} via Square API`);
    // Llamar a Square API
  }
}

// ============================================
// SOLUCIÓN 3: Plugin Architecture
// ============================================

/**
 * Sistema extensible de descuentos
 *
 * 🏢 BIG TECH: WooCommerce plugins, Shopify apps
 */

/**
 * Interface: Plugin de descuento
 */
interface DiscountPlugin {
  readonly name: string;
  readonly priority: number; // Orden de aplicación
  calculate(amount: number, context: DiscountContext): number;
  isApplicable(context: DiscountContext): boolean;
}

interface DiscountContext {
  customerId: string;
  orderAmount: number;
  itemCount: number;
  isFirstPurchase: boolean;
}

/**
 * Plugin: Descuento por porcentaje
 */
class PercentageDiscountPlugin implements DiscountPlugin {
  readonly name = "Percentage Discount";
  readonly priority = 1;

  constructor(private percentage: number) {}

  isApplicable(context: DiscountContext): boolean {
    return context.orderAmount >= 10000; // Mínimo $100
  }

  calculate(amount: number, context: DiscountContext): number {
    if (!this.isApplicable(context)) return 0;
    return Math.round(amount * this.percentage);
  }
}

/**
 * Plugin: Descuento de bienvenida
 */
class WelcomeDiscountPlugin implements DiscountPlugin {
  readonly name = "Welcome Discount";
  readonly priority = 2;

  constructor(private fixedAmount: number) {}

  isApplicable(context: DiscountContext): boolean {
    return context.isFirstPurchase;
  }

  calculate(amount: number, context: DiscountContext): number {
    if (!this.isApplicable(context)) return 0;
    return Math.min(this.fixedAmount, amount);
  }
}

/**
 * ✅ EXTENSIÓN: Loyalty discount (nuevo plugin, sin modificar existentes)
 */
class LoyaltyDiscountPlugin implements DiscountPlugin {
  readonly name = "Loyalty Discount";
  readonly priority = 3;

  constructor(
    private tiers: Map<string, number> // customerId -> discount %
  ) {}

  isApplicable(context: DiscountContext): boolean {
    return this.tiers.has(context.customerId);
  }

  calculate(amount: number, context: DiscountContext): number {
    if (!this.isApplicable(context)) return 0;
    const discountRate = this.tiers.get(context.customerId) || 0;
    return Math.round(amount * discountRate);
  }
}

/**
 * Engine: Aplica descuentos SIN conocer implementaciones específicas
 *
 * ✅ ABIERTO para extensión (nuevos plugins)
 * ✅ CERRADO para modificación
 */
class DiscountEngine {
  private plugins: DiscountPlugin[] = [];

  // Registrar plugins dinámicamente
  registerPlugin(plugin: DiscountPlugin): void {
    this.plugins.push(plugin);
    // Ordenar por prioridad
    this.plugins.sort((a, b) => a.priority - b.priority);
  }

  calculateTotal(amount: number, context: DiscountContext): {
    originalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    appliedDiscounts: Array<{ name: string; amount: number }>;
  } {
    const appliedDiscounts: Array<{ name: string; amount: number }> = [];
    let totalDiscount = 0;

    // Aplicar todos los plugins aplicables
    for (const plugin of this.plugins) {
      if (plugin.isApplicable(context)) {
        const discount = plugin.calculate(amount, context);
        if (discount > 0) {
          appliedDiscounts.push({ name: plugin.name, amount: discount });
          totalDiscount += discount;
        }
      }
    }

    return {
      originalAmount: amount,
      totalDiscount,
      finalAmount: amount - totalDiscount,
      appliedDiscounts,
    };
  }
}

// ============================================
// DEMOSTRACIÓN
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Open/Closed Principle");
console.log("=".repeat(60));

console.log("\n❌ VIOLACIÓN DE OCP:");
const badProcessor = new PaymentProcessorBad();
badProcessor.processPayment("credit_card", 5000);
// Para agregar Bitcoin: Modificar PaymentProcessorBad ❌

console.log("\n✅ CUMPLIMIENTO DE OCP - Strategy Pattern:");
const processor = new PaymentProcessor();

const creditCard = new CreditCardPayment("4242424242424242", "123", "12/25");
await processor.processPayment(creditCard, 5000);

const paypal = new PayPalPayment("user@example.com", "password");
await processor.processPayment(paypal, 7500);

// ✅ Agregar Bitcoin SIN modificar PaymentProcessor
const bitcoin = new BitcoinPayment("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
await processor.processPayment(bitcoin, 10000);

console.log("\n✅ CUMPLIMIENTO DE OCP - Abstract Class:");
const stripeGateway = new StripeGateway("sk_test_123");
await stripeGateway.executePayment(3000);

const squareGateway = new SquareGateway("sq_access_token_456");
await squareGateway.executePayment(4000);

console.log("\n✅ CUMPLIMIENTO DE OCP - Plugin Architecture:");
const discountEngine = new DiscountEngine();

// Registrar plugins
discountEngine.registerPlugin(new PercentageDiscountPlugin(0.1)); // 10%
discountEngine.registerPlugin(new WelcomeDiscountPlugin(1000)); // $10
discountEngine.registerPlugin(
  new LoyaltyDiscountPlugin(
    new Map([
      ["cus_vip", 0.15], // 15% VIP
      ["cus_gold", 0.1], // 10% Gold
    ])
  )
);

const context: DiscountContext = {
  customerId: "cus_vip",
  orderAmount: 50000, // $500
  itemCount: 5,
  isFirstPurchase: true,
};

const result = discountEngine.calculateTotal(50000, context);
console.log(`Original: $${result.originalAmount / 100}`);
result.appliedDiscounts.forEach((d) => {
  console.log(`  - ${d.name}: -$${d.amount / 100}`);
});
console.log(`Total Discount: -$${result.totalDiscount / 100}`);
console.log(`Final Amount: $${result.finalAmount / 100}`);

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. PAYMENT METHODS:
 *    - Interface PaymentMethod
 *    - Agregar Apple Pay, Google Pay sin modificar core
 *    - Stripe hace esto
 *
 * 2. DISCOUNT STRATEGIES:
 *    - Plugin de descuentos
 *    - Black Friday, loyalty, referral
 *    - Shopify discount engine
 *
 * 3. TAX CALCULATORS:
 *    - Interface TaxCalculator
 *    - Por país, estado, producto
 *    - Avalara tax engine
 *
 * 4. NOTIFICATION CHANNELS:
 *    - Interface NotificationChannel
 *    - Email, SMS, Push, Webhook
 *    - Twilio, SendGrid
 *
 * 5. PRICING STRATEGIES:
 *    - Flat, tiered, volume, usage-based
 *    - Stripe Billing pricing models
 *
 * 6. FRAUD DETECTION:
 *    - Plugin de reglas de fraude
 *    - Machine learning models
 *    - Stripe Radar
 *
 * 7. PAYMENT GATEWAYS:
 *    - Abstract PaymentGateway
 *    - Stripe, PayPal, Square, Adyen
 *    - Sin modificar core processor
 */

console.log("\n" + "=".repeat(60));
console.log("💡 CÓMO LOGRAR OCP");
console.log("=".repeat(60));

/**
 * ✅ TÉCNICAS PARA OCP:
 *
 * 1. ABSTRACCIÓN:
 *    - Interfaces y abstract classes
 *    - Definen contratos
 *
 * 2. POLIMORFISMO:
 *    - Diferentes implementaciones de misma interfaz
 *    - Runtime dispatch
 *
 * 3. DEPENDENCY INJECTION:
 *    - Inyectar dependencias
 *    - No crear instancias internamente
 *
 * 4. STRATEGY PATTERN:
 *    - Familia de algoritmos intercambiables
 *    - Ejemplo: PaymentMethod
 *
 * 5. TEMPLATE METHOD:
 *    - Esqueleto en clase base
 *    - Detalles en subclases
 *
 * 6. DECORATOR PATTERN:
 *    - Agregar funcionalidad sin modificar
 *    - Ejemplo: LoggingPaymentMethod
 *
 * 7. OBSERVER PATTERN:
 *    - Extensión via eventos
 *    - Webhooks
 *
 * ⚠️ SEÑALES DE VIOLACIÓN:
 *
 * 1. SWITCH/IF CASCADES:
 *    ❌ switch(type) { ... } que crece
 *    ✅ Polimorfismo
 *
 * 2. MODIFICAR CLASE EXISTENTE:
 *    ❌ Agregar método para nueva feature
 *    ✅ Crear nueva clase que implemente interfaz
 *
 * 3. INSTANCEOF CHECKS:
 *    ❌ if (payment instanceof CreditCard)
 *    ✅ Polimorfismo
 *
 * 4. TYPE FLAGS:
 *    ❌ type: "credit_card" | "paypal" | ...
 *    ✅ Diferentes clases
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿OCP significa NUNCA modificar código?
 *    Pista: No, significa minimizar modificaciones
 *
 * 2. ¿Cómo balancear OCP con YAGNI (You Ain't Gonna Need It)?
 *    Pista: No sobre-diseñar, abstraer cuando hay patrón
 *
 * 3. ¿OCP aplica a datos (schemas, APIs)?
 *    Pista: Sí, versioning, optional fields, extensible
 *
 * 4. ¿Cómo OCP se relaciona con plugin architecture?
 *    Pista: Plugins son extensión sin modificación
 *
 * 5. ¿Interfaces vs Abstract Classes para OCP?
 *    Pista: Interfaces para contratos, abstract para compartir código
 *
 * 6. ¿OCP aumenta complejidad?
 *    Pista: Sí, es un trade-off
 *
 * 7. ¿Cuándo violar OCP está bien?
 *    Pista: Prototipado rápido, código que no cambiará
 *
 * 8. ¿Cómo refactorizar para OCP?
 *    Pista: Extract interface, strategy pattern
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Refactoriza este código para OCP:
 *    class ShippingCalculator {
 *      calculate(type: string, weight: number): number {
 *        if (type === "standard") return weight * 5;
 *        if (type === "express") return weight * 10;
 *        if (type === "overnight") return weight * 20;
 *      }
 *    }
 *
 * 2. INTERMEDIO:
 *    Diseña sistema de pricing extensible:
 *    - Interface PricingStrategy
 *    - Flat, tiered, volume, usage-based
 *    - Agregar nueva estrategia sin modificar engine
 *
 * 3. AVANZADO:
 *    Implementa tax calculation engine:
 *    - Por país, estado, tipo de producto
 *    - Reglas complejas (exenciones, thresholds)
 *    - Plugin architecture
 *
 * 4. EXPERTO:
 *    Crea fraud detection system:
 *    - Plugin de reglas
 *    - Scoring composite
 *    - Machine learning model integration
 *    - Weighted scoring
 *    - Todo extensible sin modificar core
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Abierto para extensión, cerrado para modificación!");
console.log("=".repeat(60));

export {
  PaymentMethod,
  CreditCardPayment,
  PayPalPayment,
  BankTransferPayment,
  BitcoinPayment,
  PaymentProcessor,
  PaymentGateway,
  StripeGateway,
  SquareGateway,
  DiscountPlugin,
  DiscountContext,
  PercentageDiscountPlugin,
  WelcomeDiscountPlugin,
  LoyaltyDiscountPlugin,
  DiscountEngine,
};
