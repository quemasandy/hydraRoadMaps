/**
 * ==========================================
 * ABSTRACT FACTORY PATTERN
 * (Patrón Creacional)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * Abstract Factory provee una INTERFACE para crear FAMILIAS de objetos relacionados
 * sin especificar sus clases concretas.
 *
 * Diferencia clave con Factory Method:
 * - **Factory Method**: Crea UN producto
 * - **Abstract Factory**: Crea FAMILIA de productos relacionados
 *
 * Características clave:
 * 1. **Familias de objetos**: Productos relacionados que trabajan juntos
 * 2. **Consistencia**: Asegura que productos son compatibles entre sí
 * 3. **Encapsulación**: Oculta clases concretas del cliente
 * 4. **Intercambiabilidad**: Cambiar familia completa fácilmente
 *
 * 📚 CUÁNDO USAR ABSTRACT FACTORY:
 *
 * ✅ CASOS APROPIADOS:
 * - Múltiples variantes de productos relacionados (ej: US vs EU payment systems)
 * - Productos deben ser compatibles entre sí
 * - Ocultar implementaciones de productos
 * - Cambiar familia completa de productos en runtime
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - Payment Gateway Factory: Crea conjunto completo (Gateway + Validator + Formatter)
 * - Regional Factory: US/EU/APAC tienen payment methods, validations, fees diferentes
 * - Test vs Production: Diferentes factories para test/prod environments
 *
 * **AWS SDK:**
 * - Client Factory: Crea S3Client + Credentials + Config como familia
 * - Region-specific factories: US-East, EU-West con configuraciones diferentes
 *
 * **UI Libraries (Material-UI, Ant Design):**
 * - Theme Factory: Crea Button + Input + Card con estilo consistente
 * - Dark/Light mode: Factory crea componentes con tema coherente
 *
 * **PayPal:**
 * - Country Factory: Crea Payment Processor + Tax Calculator + Currency Converter
 * - Cada país tiene implementaciones diferentes pero compatibles
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - **Consistencia**: Asegura productos compatibles
 * - **Aislamiento**: Cliente no conoce clases concretas
 * - **Flexibilidad**: Cambiar familia completa fácilmente
 * - **Single Responsibility**: Creación separada de uso
 */

// ==========================================
// SECCIÓN 1: PROBLEMA SIN ABSTRACT FACTORY
// Inconsistencia entre productos
// ==========================================

/**
 * ⚠️ PROBLEMA: Sin Abstract Factory, fácil crear combinaciones incompatibles
 */

class StripePaymentGateway_Bad {
  process() {
    console.log('Processing via Stripe');
  }
}

class PayPalValidator_Bad {
  // ⚠️ Validator de PayPal con Gateway de Stripe - inconsistente!
  validate() {
    console.log('Validating with PayPal rules');
  }
}

function badUsage() {
  // ⚠️ Cliente puede mezclar productos incompatibles
  const gateway = new StripePaymentGateway_Bad();
  const validator = new PayPalValidator_Bad(); // ❌ Incompatible!

  // Esto puede causar bugs sutiles
}

// ==========================================
// SECCIÓN 2: ABSTRACT FACTORY - IMPLEMENTACIÓN BÁSICA
// Familia de productos de pago
// ==========================================

/**
 * ✅ SOLUCIÓN: Abstract Factory asegura consistencia
 */

// Productos abstractos
interface PaymentGateway {
  authorize(amount: number): Promise<string>;
  capture(authId: string): Promise<boolean>;
}

interface PaymentValidator {
  validateCard(cardNumber: string): boolean;
  validateAmount(amount: number): boolean;
}

interface PaymentFormatter {
  formatAmount(amount: number): string;
  formatResponse(data: any): string;
}

// Abstract Factory
interface PaymentSystemFactory {
  createGateway(): PaymentGateway;
  createValidator(): PaymentValidator;
  createFormatter(): PaymentFormatter;
}

// ===== FAMILIA 1: STRIPE =====

class StripeGateway implements PaymentGateway {
  async authorize(amount: number): Promise<string> {
    console.log(`Stripe: Authorizing ${amount}`);
    return `stripe_auth_${Date.now()}`;
  }

  async capture(authId: string): Promise<boolean> {
    console.log(`Stripe: Capturing ${authId}`);
    return true;
  }
}

class StripeValidator implements PaymentValidator {
  validateCard(cardNumber: string): boolean {
    console.log('Stripe: Validating card with Luhn algorithm');
    return cardNumber.length === 16;
  }

  validateAmount(amount: number): boolean {
    // Stripe usa centavos
    return amount >= 50 && amount <= 99999999;
  }
}

class StripeFormatter implements PaymentFormatter {
  formatAmount(amount: number): string {
    // Stripe usa centavos
    return `$${(amount / 100).toFixed(2)}`;
  }

  formatResponse(data: any): string {
    return JSON.stringify({ stripe_data: data });
  }
}

// Factory concreta: Stripe
class StripeFactory implements PaymentSystemFactory {
  createGateway(): PaymentGateway {
    return new StripeGateway();
  }

  createValidator(): PaymentValidator {
    return new StripeValidator();
  }

  createFormatter(): PaymentFormatter {
    return new StripeFormatter();
  }
}

// ===== FAMILIA 2: PAYPAL =====

class PayPalGateway implements PaymentGateway {
  async authorize(amount: number): Promise<string> {
    console.log(`PayPal: Authorizing ${amount}`);
    return `paypal_auth_${Date.now()}`;
  }

  async capture(authId: string): Promise<boolean> {
    console.log(`PayPal: Capturing ${authId}`);
    return true;
  }
}

class PayPalValidator implements PaymentValidator {
  validateCard(cardNumber: string): boolean {
    console.log('PayPal: Validating card');
    return cardNumber.length >= 15;
  }

  validateAmount(amount: number): boolean {
    // PayPal usa dólares directamente
    return amount >= 0.5 && amount <= 10000;
  }
}

class PayPalFormatter implements PaymentFormatter {
  formatAmount(amount: number): string {
    // PayPal usa dólares
    return `$${amount.toFixed(2)}`;
  }

  formatResponse(data: any): string {
    return JSON.stringify({ paypal_response: data });
  }
}

// Factory concreta: PayPal
class PayPalFactory implements PaymentSystemFactory {
  createGateway(): PaymentGateway {
    return new PayPalGateway();
  }

  createValidator(): PaymentValidator {
    return new PayPalValidator();
  }

  createFormatter(): PaymentFormatter {
    return new PayPalFormatter();
  }
}

// ===== CLIENTE =====

class PaymentService {
  private gateway: PaymentGateway;
  private validator: PaymentValidator;
  private formatter: PaymentFormatter;

  constructor(factory: PaymentSystemFactory) {
    // ✅ Factory crea familia completa - consistencia garantizada
    this.gateway = factory.createGateway();
    this.validator = factory.createValidator();
    this.formatter = factory.createFormatter();
  }

  async processPayment(cardNumber: string, amount: number): Promise<void> {
    // Validar
    if (!this.validator.validateCard(cardNumber)) {
      console.log('Card validation failed');
      return;
    }

    if (!this.validator.validateAmount(amount)) {
      console.log('Amount validation failed');
      return;
    }

    // Procesar
    const authId = await this.gateway.authorize(amount);
    const captured = await this.gateway.capture(authId);

    if (captured) {
      console.log('Payment successful:', this.formatter.formatAmount(amount));
    }
  }
}

// Uso
async function demoAbstractFactory() {
  console.log('=== Using Stripe ===');
  const stripeFactory = new StripeFactory();
  const stripeService = new PaymentService(stripeFactory);
  await stripeService.processPayment('4242424242424242', 5000); // 5000 centavos

  console.log('\n=== Using PayPal ===');
  const paypalFactory = new PayPalFactory();
  const paypalService = new PaymentService(paypalFactory);
  await paypalService.processPayment('371449635398431', 50); // $50

  // ✅ Cada servicio usa familia consistente
  // ✅ Cambiar de Stripe a PayPal es trivial
}

// ==========================================
// SECCIÓN 3: ABSTRACT FACTORY PARA REGIONES
// Caso de uso real: Multi-region payment processing
// ==========================================

/**
 * 💰 CASO REAL: Diferentes regiones tienen diferentes requirements
 */

// Productos abstractos
interface RegionalPaymentProcessor {
  processPayment(amount: number, currency: string): Promise<boolean>;
}

interface RegionalTaxCalculator {
  calculateTax(amount: number): number;
}

interface RegionalComplianceChecker {
  checkCompliance(amount: number): boolean;
}

// Abstract Factory
interface RegionalPaymentFactory {
  createProcessor(): RegionalPaymentProcessor;
  createTaxCalculator(): RegionalTaxCalculator;
  createComplianceChecker(): RegionalComplianceChecker;
}

// ===== REGION: UNITED STATES =====

class USPaymentProcessor implements RegionalPaymentProcessor {
  async processPayment(amount: number, currency: string): Promise<boolean> {
    console.log(`US: Processing ${amount} ${currency}`);
    return true;
  }
}

class USTaxCalculator implements RegionalTaxCalculator {
  calculateTax(amount: number): number {
    // US sales tax (varía por estado, simplificado)
    return amount * 0.08;
  }
}

class USComplianceChecker implements RegionalComplianceChecker {
  checkCompliance(amount: number): boolean {
    // US: Report transactions > $10,000
    return amount <= 10000;
  }
}

class USPaymentFactory implements RegionalPaymentFactory {
  createProcessor(): RegionalPaymentProcessor {
    return new USPaymentProcessor();
  }

  createTaxCalculator(): RegionalTaxCalculator {
    return new USTaxCalculator();
  }

  createComplianceChecker(): RegionalComplianceChecker {
    return new USComplianceChecker();
  }
}

// ===== REGION: EUROPEAN UNION =====

class EUPaymentProcessor implements RegionalPaymentProcessor {
  async processPayment(amount: number, currency: string): Promise<boolean> {
    console.log(`EU: Processing ${amount} ${currency}`);
    return true;
  }
}

class EUTaxCalculator implements RegionalTaxCalculator {
  calculateTax(amount: number): number {
    // EU VAT
    return amount * 0.20;
  }
}

class EUComplianceChecker implements RegionalComplianceChecker {
  checkCompliance(amount: number): boolean {
    // EU: Strong Customer Authentication for > €30
    return amount <= 30 || this.performSCA();
  }

  private performSCA(): boolean {
    console.log('EU: Performing Strong Customer Authentication');
    return true;
  }
}

class EUPaymentFactory implements RegionalPaymentFactory {
  createProcessor(): RegionalPaymentProcessor {
    return new EUPaymentProcessor();
  }

  createTaxCalculator(): RegionalTaxCalculator {
    return new EUTaxCalculator();
  }

  createComplianceChecker(): RegionalComplianceChecker {
    return new EUComplianceChecker();
  }
}

// ===== CLIENTE =====

class MultiRegionPaymentService {
  private processor: RegionalPaymentProcessor;
  private taxCalculator: RegionalTaxCalculator;
  private complianceChecker: RegionalComplianceChecker;

  constructor(factory: RegionalPaymentFactory) {
    this.processor = factory.createProcessor();
    this.taxCalculator = factory.createTaxCalculator();
    this.complianceChecker = factory.createComplianceChecker();
  }

  async processPayment(amount: number, currency: string): Promise<void> {
    // Compliance check
    if (!this.complianceChecker.checkCompliance(amount)) {
      console.log('Compliance check failed');
      return;
    }

    // Calculate tax
    const tax = this.taxCalculator.calculateTax(amount);
    const total = amount + tax;

    console.log(`Tax: ${tax}, Total: ${total}`);

    // Process
    await this.processor.processPayment(total, currency);
  }
}

// Uso basado en región del cliente
async function processRegionalPayment(customerRegion: 'US' | 'EU') {
  let factory: RegionalPaymentFactory;

  if (customerRegion === 'US') {
    factory = new USPaymentFactory();
  } else {
    factory = new EUPaymentFactory();
  }

  const service = new MultiRegionPaymentService(factory);
  await service.processPayment(100, customerRegion === 'US' ? 'USD' : 'EUR');
}

// ==========================================
// SECCIÓN 4: ABSTRACT FACTORY PARA TEST/PROD
// Diferentes implementaciones para testing
// ==========================================

/**
 * ✅ Usar Abstract Factory para separar test/prod
 */

interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface PaymentGatewayService {
  charge(amount: number): Promise<string>;
}

interface LoggingService {
  log(message: string): void;
}

// Abstract Factory
interface ServiceFactory {
  createEmailService(): EmailService;
  createPaymentGateway(): PaymentGatewayService;
  createLogger(): LoggingService;
}

// ===== PRODUCTION =====

class ProductionEmailService implements EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`REAL EMAIL to ${to}: ${subject}`);
    // Integración real con SendGrid
  }
}

class ProductionPaymentGateway implements PaymentGatewayService {
  async charge(amount: number): Promise<string> {
    console.log(`REAL CHARGE: $${amount}`);
    // Integración real con Stripe
    return 'real_charge_id';
  }
}

class ProductionLogger implements LoggingService {
  log(message: string): void {
    // Enviar a Datadog, Sentry, etc.
    console.log(`[PROD] ${message}`);
  }
}

class ProductionServiceFactory implements ServiceFactory {
  createEmailService(): EmailService {
    return new ProductionEmailService();
  }

  createPaymentGateway(): PaymentGatewayService {
    return new ProductionPaymentGateway();
  }

  createLogger(): LoggingService {
    return new ProductionLogger();
  }
}

// ===== TEST =====

class MockEmailService implements EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`MOCK EMAIL to ${to}: ${subject}`);
    // No envía email real
  }
}

class MockPaymentGateway implements PaymentGatewayService {
  async charge(amount: number): Promise<string> {
    console.log(`MOCK CHARGE: $${amount}`);
    return 'mock_charge_id';
  }
}

class MockLogger implements LoggingService {
  log(message: string): void {
    console.log(`[TEST] ${message}`);
  }
}

class TestServiceFactory implements ServiceFactory {
  createEmailService(): EmailService {
    return new MockEmailService();
  }

  createPaymentGateway(): PaymentGatewayService {
    return new MockPaymentGateway();
  }

  createLogger(): LoggingService {
    return new MockLogger();
  }
}

// ===== APLICACIÓN =====

class Application {
  private emailService: EmailService;
  private paymentGateway: PaymentGatewayService;
  private logger: LoggingService;

  constructor(factory: ServiceFactory) {
    this.emailService = factory.createEmailService();
    this.paymentGateway = factory.createPaymentGateway();
    this.logger = factory.createLogger();
  }

  async processOrder(amount: number, customerEmail: string): Promise<void> {
    this.logger.log('Processing order');

    const chargeId = await this.paymentGateway.charge(amount);

    await this.emailService.send(
      customerEmail,
      'Order Confirmation',
      `Your payment ${chargeId} was successful`
    );

    this.logger.log('Order processed');
  }
}

// Uso
async function runApplication(environment: 'production' | 'test') {
  const factory: ServiceFactory =
    environment === 'production'
      ? new ProductionServiceFactory()
      : new TestServiceFactory();

  const app = new Application(factory);
  await app.processOrder(100, 'customer@example.com');
}

// ==========================================
// SECCIÓN 5: MEJORES PRÁCTICAS
// ==========================================

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. **Usa Abstract Factory cuando:**
 *    - Tienes familias de productos relacionados
 *    - Productos deben ser compatibles entre sí
 *    - Quieres aislar creación de productos
 *    - Necesitas cambiar familia completa fácilmente
 *
 * 2. **Combina con Singleton:**
 *    - Factory puede ser singleton si solo necesitas una instancia
 *
 * 3. **Retorna interfaces:**
 *    - Factory methods retornan interfaces, no clases concretas
 *
 * 4. **Nombres consistentes:**
 *    - createX() para todos los productos
 *
 * 5. **Testing:**
 *    - Abstract Factory es excelente para test/prod separation
 */

/**
 * ⚠️ ERRORES COMUNES:
 *
 * 1. **Confundir con Factory Method:**
 *    - Factory Method: UN producto
 *    - Abstract Factory: FAMILIA de productos
 *
 * 2. **Demasiados productos:**
 *    - Si factory tiene >5 métodos, considerar dividir
 *
 * 3. **Productos no relacionados:**
 *    - Solo agrupar productos que deben ser consistentes
 *
 * 4. **Complejidad innecesaria:**
 *    - No usar si no hay múltiples familias
 */

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('ABSTRACT FACTORY PATTERN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Payment Systems (Stripe vs PayPal):');
await demoAbstractFactory();

console.log('\n2. Regional Payment Processing:');
await processRegionalPayment('US');
await processRegionalPayment('EU');

console.log('\n3. Production vs Test:');
await runApplication('test');

console.log('\n✅ Beneficios de Abstract Factory:');
console.log('   - Asegura consistencia entre productos');
console.log('   - Fácil cambiar familia completa');
console.log('   - Aísla código cliente de implementaciones');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia clave entre Factory Method y Abstract Factory?
 *    Pista: Uno crea un producto, otro crea familia de productos
 *
 * 2. ¿Por qué Abstract Factory asegura consistencia entre productos?
 *    Pista: Todos los productos vienen de la misma factory
 *
 * 3. ¿Cómo usarías Abstract Factory para test vs production?
 *    Pista: Una factory crea mocks, otra crea servicios reales
 *
 * 4. ¿Cuándo NO deberías usar Abstract Factory?
 *    Pista: Cuando no hay múltiples familias o productos no están relacionados
 *
 * 5. ¿Cómo Stripe podría usar Abstract Factory para US vs EU?
 *    Pista: Diferentes payment methods, validations, compliance por región
 *
 * 6. ¿Abstract Factory viola Single Responsibility Principle?
 *    Pista: No, cada factory tiene una responsabilidad: crear familia
 *
 * 7. ¿Cómo combinarías Abstract Factory con Singleton?
 *    Pista: Factory puede ser singleton si solo necesitas una instancia
 *
 * 8. ¿Qué patron usarías para agregar productos a la familia?
 *    Pista: Extender factory (pero viola Open/Closed), o usar composición
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): UI Theme Factory
 *
 * Implementa Abstract Factory para temas de UI:
 * - Productos: Button, Input, Card
 * - Familias: LightTheme, DarkTheme
 *
 * Cada tema debe tener colores y estilos consistentes.
 *
 * Ejemplo:
 * ```typescript
 * const factory = new DarkThemeFactory();
 * const button = factory.createButton();
 * const input = factory.createInput();
 * ```
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Database Factory
 *
 * Implementa Abstract Factory para diferentes databases:
 * - Productos: Connection, QueryBuilder, Transaction
 * - Familias: PostgresFactory, MongoFactory
 *
 * Cada database tiene su propia implementación de queries.
 *
 * Debe permitir cambiar de Postgres a Mongo sin cambiar código cliente.
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Multi-Region E-commerce
 *
 * Implementa Abstract Factory para e-commerce multi-región:
 *
 * Productos:
 * - PaymentProcessor
 * - TaxCalculator
 * - ShippingCalculator
 * - CurrencyConverter
 *
 * Familias (regiones):
 * - NorthAmerica: USD, sales tax, USPS shipping
 * - Europe: EUR, VAT, DHL shipping
 * - Asia: JPY/CNY, consumption tax, local shipping
 *
 * Cada región tiene rules diferentes pero deben trabajar juntos.
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Subscription Billing Engine
 *
 * Diseña Abstract Factory para subscription billing:
 *
 * Productos:
 * - PricingCalculator (flat, per-seat, usage-based)
 * - InvoiceGenerator (PDF, HTML, email)
 * - PaymentScheduler (monthly, annual, custom)
 * - DiscountApplicator (percentage, fixed, trial)
 *
 * Familias (planes):
 * - StartupPlan: Simple pricing, básico features
 * - EnterprisePlan: Complex pricing, advanced features
 * - CustomPlan: Totalmente configurable
 *
 * Requisitos:
 * - Productos deben ser consistentes dentro de cada plan
 * - Fácil agregar nuevos planes
 * - Testing con mock factories
 * - Métricas y analytics integrados
 *
 * Inspiración: Stripe Billing, Chargebee
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Interfaces
  PaymentSystemFactory,
  RegionalPaymentFactory,
  ServiceFactory,

  // Concrete Factories
  StripeFactory,
  PayPalFactory,
  USPaymentFactory,
  EUPaymentFactory,
  ProductionServiceFactory,
  TestServiceFactory,

  // Services
  PaymentService,
  MultiRegionPaymentService,
  Application
};
