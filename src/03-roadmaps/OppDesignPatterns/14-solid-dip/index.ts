/**
 * ==========================================
 * SOLID: DEPENDENCY INVERSION PRINCIPLE (DIP)
 * ==========================================
 *
 * "Módulos de alto nivel no deben depender de módulos de bajo nivel.
 * Ambos deben depender de abstracciones.
 * Las abstracciones no deben depender de los detalles.
 * Los detalles deben depender de las abstracciones."
 * - Robert C. Martin
 *
 * 📚 CONCEPTO CLAVE:
 * - Depende de interfaces/abstracciones, no de implementaciones concretas
 * - Invierte la dirección de dependencia
 * - Inyecta dependencias en vez de crearlas internamente
 *
 * 🏢 USO EN BIG TECH:
 * Stripe SDK usa DIP extensivamente:
 * - StripeClient depends on HttpClient interface (not axios/fetch directly)
 * - PaymentService depends on PaymentGateway interface (not Stripe directly)
 * - Permite testing, swapping implementations
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Testabilidad: Mock dependencies fácilmente
 * - Flexibilidad: Cambiar implementaciones sin modificar código
 * - Reusabilidad: Código independiente de detalles
 * - Mantenibilidad: Cambios localizados
 */

// ============================================
// ❌ VIOLACIÓN DE DIP
// ============================================

/**
 * EJEMPLO MALO: Módulo de alto nivel depende de implementación concreta
 *
 * 💥 PROBLEMA: PaymentService está acoplado a StripeAPI concreta
 */

/**
 * Módulo de bajo nivel: Implementación concreta de Stripe
 */
class StripeAPIBad {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  chargeCard(amount: number, cardToken: string): string {
    console.log(`[Stripe] Charging ${amount} with API key ${this.apiKey.substring(0, 10)}...`);
    // Llamar a Stripe API real
    return `stripe_charge_${Date.now()}`;
  }

  refundCharge(chargeId: string, amount: number): string {
    console.log(`[Stripe] Refunding ${amount} for charge ${chargeId}`);
    return `stripe_refund_${Date.now()}`;
  }
}

/**
 * ❌ Módulo de alto nivel: Depende directamente de StripeAPIBad
 */
class PaymentServiceBad {
  private stripe: StripeAPIBad; // ❌ Acoplamiento concreto!

  constructor() {
    // ❌ Crea instancia internamente (acoplamiento fuerte)
    this.stripe = new StripeAPIBad("sk_test_12345");
  }

  processPayment(amount: number, cardToken: string): string {
    // ❌ Acoplado a implementación de Stripe
    return this.stripe.chargeCard(amount, cardToken);
  }

  refundPayment(chargeId: string, amount: number): string {
    return this.stripe.refundCharge(chargeId, amount);
  }
}

/**
 * 💥 PROBLEMAS:
 * - No puedes cambiar a PayPal sin modificar PaymentServiceBad
 * - No puedes testear sin llamar a Stripe real
 * - PaymentServiceBad conoce detalles de implementación de Stripe
 * - No puedes reutilizar PaymentServiceBad con otro gateway
 * - Viola Open/Closed Principle también
 */

// Uso
const serviceBad = new PaymentServiceBad();
serviceBad.processPayment(5000, "tok_visa");

// ❌ No hay forma de inyectar mock para testing
// ❌ No hay forma de cambiar a PayPal
// ❌ Acoplamiento fuerte

// ============================================
// ✅ CUMPLIMIENTO DE DIP
// ============================================

/**
 * PASO 1: Definir abstracción (interface)
 *
 * ✅ Módulos de alto y bajo nivel dependen de esta abstracción
 */
interface PaymentGateway {
  charge(amount: number, paymentToken: string): Promise<ChargeResult>;
  refund(chargeId: string, amount: number): Promise<RefundResult>;
  getGatewayName(): string;
}

interface ChargeResult {
  success: boolean;
  chargeId?: string;
  errorMessage?: string;
}

interface RefundResult {
  success: boolean;
  refundId?: string;
  errorMessage?: string;
}

/**
 * PASO 2: Implementaciones concretas dependen de abstracción
 *
 * ✅ Módulo de bajo nivel implementa interface
 */

/**
 * Implementación: Stripe
 */
class StripeGateway implements PaymentGateway {
  constructor(private apiKey: string) {}

  async charge(amount: number, paymentToken: string): Promise<ChargeResult> {
    console.log(`[Stripe] Charging $${amount / 100} with token ${paymentToken}`);

    // Simular llamada a Stripe API
    try {
      // await stripe.charges.create({ amount, source: paymentToken })
      return {
        success: true,
        chargeId: `ch_stripe_${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: "Stripe API error",
      };
    }
  }

  async refund(chargeId: string, amount: number): Promise<RefundResult> {
    console.log(`[Stripe] Refunding $${amount / 100} for ${chargeId}`);

    try {
      return {
        success: true,
        refundId: `re_stripe_${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: "Stripe refund error",
      };
    }
  }

  getGatewayName(): string {
    return "Stripe";
  }
}

/**
 * Implementación: PayPal
 */
class PayPalGateway implements PaymentGateway {
  constructor(
    private clientId: string,
    private clientSecret: string
  ) {}

  async charge(amount: number, paymentToken: string): Promise<ChargeResult> {
    console.log(`[PayPal] Charging $${amount / 100} with token ${paymentToken}`);

    try {
      // Llamar a PayPal API
      return {
        success: true,
        chargeId: `paypal_${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: "PayPal API error",
      };
    }
  }

  async refund(chargeId: string, amount: number): Promise<RefundResult> {
    console.log(`[PayPal] Refunding $${amount / 100} for ${chargeId}`);

    try {
      return {
        success: true,
        refundId: `refund_paypal_${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: "PayPal refund error",
      };
    }
  }

  getGatewayName(): string {
    return "PayPal";
  }
}

/**
 * Implementación: Mock (para testing)
 */
class MockPaymentGateway implements PaymentGateway {
  public chargeCallCount = 0;
  public refundCallCount = 0;

  async charge(amount: number, paymentToken: string): Promise<ChargeResult> {
    this.chargeCallCount++;
    console.log(`[Mock] Simulating charge of $${amount / 100}`);
    return {
      success: true,
      chargeId: `mock_charge_${this.chargeCallCount}`,
    };
  }

  async refund(chargeId: string, amount: number): Promise<RefundResult> {
    this.refundCallCount++;
    console.log(`[Mock] Simulating refund of $${amount / 100}`);
    return {
      success: true,
      refundId: `mock_refund_${this.refundCallCount}`,
    };
  }

  getGatewayName(): string {
    return "Mock Gateway";
  }
}

/**
 * PASO 3: Módulo de alto nivel depende de abstracción
 *
 * ✅ PaymentService depende de interface, no de implementación concreta
 */
class PaymentService {
  // ✅ Depende de abstracción (PaymentGateway)
  // ✅ Inyección de dependencia (constructor injection)
  constructor(private gateway: PaymentGateway) {}

  async processPayment(amount: number, paymentToken: string): Promise<void> {
    console.log(`\nProcessing payment via ${this.gateway.getGatewayName()}...`);

    // Validar amount
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    // Usar abstracción (no conoce detalles de implementación)
    const result = await this.gateway.charge(amount, paymentToken);

    if (result.success) {
      console.log(`✅ Payment successful: ${result.chargeId}`);
      await this.sendConfirmationEmail(result.chargeId!);
    } else {
      console.log(`❌ Payment failed: ${result.errorMessage}`);
      throw new Error(result.errorMessage);
    }
  }

  async refundPayment(chargeId: string, amount: number): Promise<void> {
    console.log(`\nRefunding via ${this.gateway.getGatewayName()}...`);

    const result = await this.gateway.refund(chargeId, amount);

    if (result.success) {
      console.log(`✅ Refund successful: ${result.refundId}`);
    } else {
      console.log(`❌ Refund failed: ${result.errorMessage}`);
      throw new Error(result.errorMessage);
    }
  }

  private async sendConfirmationEmail(chargeId: string): Promise<void> {
    console.log(`📧 Sending confirmation email for ${chargeId}`);
  }
}

/**
 * ✅ USO: Inyección de dependencia
 *
 * Creamos la dependencia FUERA y la inyectamos
 */

// Con Stripe
const stripeGateway = new StripeGateway("sk_test_123");
const stripeService = new PaymentService(stripeGateway);
await stripeService.processPayment(5000, "tok_visa");

// Con PayPal (mismo código, diferente implementación)
const paypalGateway = new PayPalGateway("client_id", "client_secret");
const paypalService = new PaymentService(paypalGateway);
await paypalService.processPayment(7500, "tok_paypal");

// Con Mock (para testing)
const mockGateway = new MockPaymentGateway();
const mockService = new PaymentService(mockGateway);
await mockService.processPayment(3000, "tok_test");
console.log(`Mock was called ${mockGateway.chargeCallCount} times`);

/**
 * ✅ BENEFICIOS:
 * - Podemos cambiar gateway sin modificar PaymentService
 * - Podemos testear con MockPaymentGateway
 * - PaymentService no conoce detalles de Stripe/PayPal
 * - Flexible, extensible, testeable
 */

// ============================================
// PATRÓN: Dependency Injection Container
// ============================================

/**
 * Contenedor de DI simple
 *
 * 🏢 BIG TECH: NestJS, Angular usan DI containers
 */
class DIContainer {
  private services = new Map<string, any>();

  register<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not registered`);
    }
    return service;
  }
}

// Configurar contenedor
const container = new DIContainer();

// Registrar dependencias
container.register<PaymentGateway>("paymentGateway", new StripeGateway("sk_test_123"));

// Resolver dependencias
const gateway = container.resolve<PaymentGateway>("paymentGateway");
const service = new PaymentService(gateway);

// ============================================
// MÁS EJEMPLOS DE DIP
// ============================================

/**
 * EJEMPLO: Repository Pattern con DIP
 */

/**
 * Abstracción: Data storage interface
 */
interface DataStore<T> {
  save(id: string, data: T): Promise<void>;
  load(id: string): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
}

/**
 * Implementación: En memoria
 */
class InMemoryStore<T> implements DataStore<T> {
  private store = new Map<string, T>();

  async save(id: string, data: T): Promise<void> {
    console.log(`[InMemory] Saving ${id}`);
    this.store.set(id, data);
  }

  async load(id: string): Promise<T | undefined> {
    console.log(`[InMemory] Loading ${id}`);
    return this.store.get(id);
  }

  async delete(id: string): Promise<boolean> {
    console.log(`[InMemory] Deleting ${id}`);
    return this.store.delete(id);
  }
}

/**
 * Implementación: Redis (simulado)
 */
class RedisStore<T> implements DataStore<T> {
  constructor(private redisClient: any) {}

  async save(id: string, data: T): Promise<void> {
    console.log(`[Redis] Saving ${id} to Redis`);
    // await this.redisClient.set(id, JSON.stringify(data))
  }

  async load(id: string): Promise<T | undefined> {
    console.log(`[Redis] Loading ${id} from Redis`);
    // const data = await this.redisClient.get(id)
    // return JSON.parse(data)
    return undefined;
  }

  async delete(id: string): Promise<boolean> {
    console.log(`[Redis] Deleting ${id} from Redis`);
    // return await this.redisClient.del(id)
    return true;
  }
}

/**
 * ✅ Módulo de alto nivel: Depende de abstracción
 */
class UserRepository {
  // ✅ Depende de abstracción DataStore
  constructor(private store: DataStore<User>) {}

  async createUser(user: Omit<User, "id">): Promise<User> {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      ...user,
    };

    await this.store.save(newUser.id, newUser);
    return newUser;
  }

  async getUser(id: string): Promise<User | undefined> {
    return await this.store.load(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.store.delete(id);
  }
}

interface User {
  id: string;
  email: string;
  name: string;
}

// Uso con diferentes implementaciones
const inMemoryRepo = new UserRepository(new InMemoryStore<User>());
const redisRepo = new UserRepository(new RedisStore<User>(null));

await inMemoryRepo.createUser({ email: "test@example.com", name: "Test" });

/**
 * EJEMPLO: Logger con DIP
 */

/**
 * Abstracción: Logger interface
 */
interface Logger {
  log(level: "info" | "warn" | "error", message: string): void;
}

/**
 * Implementación: Console logger
 */
class ConsoleLogger implements Logger {
  log(level: "info" | "warn" | "error", message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  }
}

/**
 * Implementación: File logger
 */
class FileLogger implements Logger {
  constructor(private filePath: string) {}

  log(level: "info" | "warn" | "error", message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    console.log(`[FileLogger] Writing to ${this.filePath}: ${logEntry.trim()}`);
    // fs.appendFileSync(this.filePath, logEntry)
  }
}

/**
 * ✅ Servicio que depende de Logger abstraction
 */
class OrderService {
  constructor(
    private gateway: PaymentGateway,
    private logger: Logger // ✅ Depende de abstracción
  ) {}

  async createOrder(amount: number): Promise<void> {
    this.logger.log("info", `Creating order for $${amount / 100}`);

    try {
      const result = await this.gateway.charge(amount, "tok_test");

      if (result.success) {
        this.logger.log("info", `Order created successfully: ${result.chargeId}`);
      } else {
        this.logger.log("error", `Order creation failed: ${result.errorMessage}`);
      }
    } catch (error) {
      this.logger.log("error", `Exception during order creation: ${error}`);
      throw error;
    }
  }
}

// Uso con diferentes loggers
const consoleLogger = new ConsoleLogger();
const fileLogger = new FileLogger("/var/log/orders.log");

const orderService1 = new OrderService(stripeGateway, consoleLogger);
const orderService2 = new OrderService(stripeGateway, fileLogger);

await orderService1.createOrder(10000);
await orderService2.createOrder(15000);

// ============================================
// DEMOSTRACIÓN COMPLETA
// ============================================

console.log("\n" + "=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Dependency Inversion Principle");
console.log("=".repeat(60));

console.log("\n❌ VIOLACIÓN DE DIP:");
console.log("PaymentServiceBad está acoplado a StripeAPIBad");
const badService = new PaymentServiceBad();
badService.processPayment(5000, "tok_visa");
console.log("- No puedes cambiar a PayPal sin modificar código");
console.log("- No puedes mockear para testing");

console.log("\n✅ CUMPLIMIENTO DE DIP:");
console.log("PaymentService depende de abstracción PaymentGateway");
await stripeService.processPayment(5000, "tok_visa");
await paypalService.processPayment(5000, "tok_paypal");
await mockService.processPayment(5000, "tok_test");
console.log("- Puedes cambiar implementación fácilmente");
console.log("- Puedes mockear para testing");

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. PAYMENT GATEWAYS:
 *    - PaymentGateway interface
 *    - Stripe, PayPal, Square implementations
 *    - Easy to switch providers
 *
 * 2. DATA STORAGE:
 *    - DataStore interface
 *    - PostgreSQL, Redis, MongoDB implementations
 *    - Database-agnostic repositories
 *
 * 3. NOTIFICATION CHANNELS:
 *    - NotificationSender interface
 *    - Email, SMS, Push implementations
 *    - Multi-channel notifications
 *
 * 4. TAX CALCULATORS:
 *    - TaxCalculator interface
 *    - Avalara, TaxJar implementations
 *    - Country-specific implementations
 *
 * 5. LOGGING:
 *    - Logger interface
 *    - Console, File, CloudWatch implementations
 *    - Centralized logging
 *
 * 6. AUTHENTICATION:
 *    - AuthProvider interface
 *    - OAuth, JWT, API Key implementations
 *    - Multiple auth strategies
 *
 * 7. REPORTING:
 *    - ReportGenerator interface
 *    - PDF, Excel, CSV implementations
 *    - Multiple export formats
 */

console.log("\n" + "=".repeat(60));
console.log("💡 TÉCNICAS DE DEPENDENCY INJECTION");
console.log("=".repeat(60));

/**
 * 🔧 TÉCNICAS DE DI:
 *
 * 1. CONSTRUCTOR INJECTION (preferida):
 *    ✅ constructor(private gateway: PaymentGateway) {}
 *    - Dependencies explícitas
 *    - Inmutable después de construcción
 *
 * 2. PROPERTY INJECTION:
 *    ⚠️ service.gateway = new StripeGateway()
 *    - Menos preferida
 *    - Útil para optional dependencies
 *
 * 3. METHOD INJECTION:
 *    ⚠️ service.process(gateway, amount)
 *    - Cuando dependencia varía por llamada
 *
 * 4. DI CONTAINER:
 *    ✅ container.resolve<PaymentGateway>("gateway")
 *    - Centraliza configuración
 *    - Auto-wiring
 *
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. PREFER INTERFACES:
 *    ✅ gateway: PaymentGateway
 *    ❌ gateway: StripeGateway
 *
 * 2. CONSTRUCTOR INJECTION:
 *    ✅ constructor(gateway: PaymentGateway)
 *    - Clara declaración de dependencias
 *
 * 3. SINGLE RESPONSIBILITY:
 *    ✅ Cada clase hace una cosa
 *    - Facilita DI
 *
 * 4. AVOID SERVICE LOCATOR:
 *    ❌ const gateway = ServiceLocator.get("gateway")
 *    ✅ Inyectar explícitamente
 *
 * 5. COMPOSITION ROOT:
 *    - Un lugar donde se configuran todas las dependencies
 *    - Main(), App.bootstrap(), etc.
 *
 * ⚠️ ANTI-PATTERNS:
 *
 * 1. NEW INSIDE CLASS:
 *    ❌ this.gateway = new StripeGateway()
 *    ✅ Inyectar desde fuera
 *
 * 2. STATIC DEPENDENCIES:
 *    ❌ StripeAPI.charge()
 *    ✅ Instance method con interfaz
 *
 * 3. SERVICE LOCATOR:
 *    ❌ Oculta dependencias
 *    ✅ Constructor injection las hace explícitas
 *
 * 4. ABSTRACT CLASS COMO DEPENDENCY:
 *    ⚠️ Preferir interfaces
 *    - Más flexibles
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿DIP es lo mismo que Dependency Injection?
 *    Pista: No, DIP es principio, DI es técnica
 *
 * 2. ¿Cuándo NO usar DI?
 *    Pista: Clases de utilidad, value objects
 *
 * 3. ¿Interfaces vs Abstract Classes para abstracciones?
 *    Pista: Interfaces más flexibles, abstract classes permiten código compartido
 *
 * 4. ¿Cómo DIP facilita testing?
 *    Pista: Mock implementations fácilmente
 *
 * 5. ¿DIP aumenta complejidad?
 *    Pista: Sí, pero beneficios > costos en apps grandes
 *
 * 6. ¿Cómo DIP se relaciona con OCP?
 *    Pista: DIP permite extensión sin modificación
 *
 * 7. ¿Qué es Inversion of Control (IoC)?
 *    Pista: Concepto más amplio que incluye DI
 *
 * 8. ¿Circular dependencies con DI?
 *    Pista: Señal de mal diseño, usar eventos o mediator
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Refactoriza a DIP:
 *    class EmailService {
 *      send() {
 *        const smtp = new SMTPClient();
 *        smtp.send(...);
 *      }
 *    }
 *    Usa EmailSender interface
 *
 * 2. INTERMEDIO:
 *    Implementa notification system con DIP:
 *    - NotificationSender interface
 *    - Email, SMS, Push implementations
 *    - NotificationService que usa interface
 *    - DI container para configuración
 *
 * 3. AVANZADO:
 *    Crea multi-gateway payment system:
 *    - PaymentGateway interface
 *    - Stripe, PayPal, Square implementations
 *    - PaymentRouter que selecciona gateway
 *    - Fallback a gateway alternativo
 *    - Mock para testing completo
 *
 * 4. EXPERTO:
 *    Diseña plugin system con DI:
 *    - Plugin interface con lifecycle hooks
 *    - DI container con auto-wiring
 *    - Lazy loading de plugins
 *    - Plugin dependencies (plugins que dependen de otros)
 *    - Circular dependency detection
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Depende de abstracciones!");
console.log("=".repeat(60));

export {
  PaymentGateway,
  ChargeResult,
  RefundResult,
  StripeGateway,
  PayPalGateway,
  MockPaymentGateway,
  PaymentService,
  DIContainer,
  DataStore,
  InMemoryStore,
  RedisStore,
  UserRepository,
  Logger,
  ConsoleLogger,
  FileLogger,
  OrderService,
};
