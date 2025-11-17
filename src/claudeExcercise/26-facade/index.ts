/**
 * ==========================================
 * FACADE PATTERN
 * (Patrón Estructural)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * Facade provee una interface SIMPLIFICADA a un subsistema complejo.
 * Oculta la complejidad del subsistema detrás de una interface simple.
 *
 * Características clave:
 * 1. **Simplificación**: Interface simple para sistema complejo
 * 2. **Ocultamiento**: Detalles de implementación ocultos
 * 3. **Desacoplamiento**: Cliente no depende de subsistema
 * 4. **Punto de entrada único**: Una clase orquesta múltiples clases
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - Stripe.js Facade: Oculta complejidad de tokenización, 3D Secure, etc.
 * - Cliente solo ve: stripe.createToken(card)
 * - Internamente: validación, encriptación, API calls, fraud detection
 *
 * **AWS SDK:**
 * - S3 Facade: upload() oculta multipart upload, retry, presigning
 * - DynamoDB Facade: query() oculta pagination, capacity units
 *
 * **Payment Systems:**
 * - PaymentFacade orquesta: validation, gateway, notification, logging
 * - Cliente solo llama: processPayment()
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Simplifica uso de subsistemas complejos
 * - Reduce dependencias del cliente
 * - Facilita testing y mantenimiento
 * - Provee interface de alto nivel
 */

// ==========================================
// SECCIÓN 1: PROBLEMA SIN FACADE
// Cliente debe conocer y orquestar subsistemas
// ==========================================

/**
 * ⚠️ PROBLEMA: Cliente maneja complejidad directamente
 */

class PaymentValidator {
  validateCard(cardNumber: string): boolean {
    console.log('Validating card...');
    return cardNumber.length === 16;
  }

  validateAmount(amount: number): boolean {
    console.log('Validating amount...');
    return amount > 0;
  }
}

class FraudDetector {
  checkFraud(customerId: string, amount: number): boolean {
    console.log('Checking fraud...');
    return amount < 10000; // Simplified
  }
}

class PaymentGateway {
  charge(amount: number, cardNumber: string): { success: boolean; id: string } {
    console.log('Processing charge...');
    return { success: true, id: 'ch_' + Date.now() };
  }
}

class NotificationService {
  sendEmail(to: string, subject: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

class TransactionLogger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

// ⚠️ Cliente debe conocer y orquestar todos los subsistemas
function badClientCode() {
  const validator = new PaymentValidator();
  const fraudDetector = new FraudDetector();
  const gateway = new PaymentGateway();
  const notifier = new NotificationService();
  const logger = new TransactionLogger();

  // ⚠️ Cliente debe conocer orden correcto de llamadas
  const amount = 5000;
  const cardNumber = '4242424242424242';
  const customerId = 'cus_123';
  const email = 'customer@example.com';

  logger.log('Starting payment process');

  if (!validator.validateCard(cardNumber)) {
    logger.log('Card validation failed');
    return;
  }

  if (!validator.validateAmount(amount)) {
    logger.log('Amount validation failed');
    return;
  }

  if (!fraudDetector.checkFraud(customerId, amount)) {
    logger.log('Fraud detected');
    notifier.sendEmail(email, 'Suspicious activity detected');
    return;
  }

  const result = gateway.charge(amount, cardNumber);

  if (result.success) {
    logger.log(`Payment successful: ${result.id}`);
    notifier.sendEmail(email, 'Payment confirmation');
  }

  // ⚠️ PROBLEMAS:
  // - Cliente debe conocer 5 subsistemas
  // - Debe saber orden correcto
  // - Duplicación si se usa en múltiples lugares
  // - Difícil de testear
}

// ==========================================
// SECCIÓN 2: FACADE PATTERN - SOLUCIÓN
// Interface simplificada
// ==========================================

/**
 * ✅ SOLUCIÓN: Facade orquesta subsistemas
 */

class PaymentFacade {
  private validator: PaymentValidator;
  private fraudDetector: FraudDetector;
  private gateway: PaymentGateway;
  private notifier: NotificationService;
  private logger: TransactionLogger;

  constructor() {
    // ✅ Facade crea y maneja subsistemas
    this.validator = new PaymentValidator();
    this.fraudDetector = new FraudDetector();
    this.gateway = new PaymentGateway();
    this.notifier = new NotificationService();
    this.logger = new TransactionLogger();
  }

  // ✅ Interface simplificada
  public processPayment(
    amount: number,
    cardNumber: string,
    customerId: string,
    email: string
  ): boolean {
    this.logger.log('Starting payment process');

    // Facade orquesta todos los pasos
    if (!this.validator.validateCard(cardNumber)) {
      this.logger.log('Card validation failed');
      return false;
    }

    if (!this.validator.validateAmount(amount)) {
      this.logger.log('Amount validation failed');
      return false;
    }

    if (!this.fraudDetector.checkFraud(customerId, amount)) {
      this.logger.log('Fraud detected');
      this.notifier.sendEmail(email, 'Suspicious activity detected');
      return false;
    }

    const result = this.gateway.charge(amount, cardNumber);

    if (result.success) {
      this.logger.log(`Payment successful: ${result.id}`);
      this.notifier.sendEmail(email, 'Payment confirmation');
      return true;
    }

    return false;
  }
}

// ✅ Cliente usa interface simple
function goodClientCode() {
  const paymentFacade = new PaymentFacade();

  // ✅ Una sola llamada, toda la complejidad oculta
  const success = paymentFacade.processPayment(
    5000,
    '4242424242424242',
    'cus_123',
    'customer@example.com'
  );

  console.log('Payment result:', success);

  // ✅ BENEFICIOS:
  // - Interface simple
  // - Cliente no conoce subsistemas
  // - Fácil de usar y testear
  // - Cambios internos no afectan cliente
}

// ==========================================
// SECCIÓN 3: FACADE PARA SUBSCRIPTION BILLING
// Caso de uso real
// ==========================================

/**
 * 💰 CASO REAL: Subscription Billing Facade
 * Simplifica proceso complejo de suscripciones
 */

// Subsistemas complejos
class CustomerRepository {
  findById(id: string): { id: string; email: string } | null {
    console.log(`Finding customer ${id}`);
    return { id, email: 'customer@example.com' };
  }
}

class PlanService {
  getPlan(planId: string): { id: string; price: number; interval: string } | null {
    console.log(`Getting plan ${planId}`);
    return { id: planId, price: 9.99, interval: 'month' };
  }
}

class BillingEngine {
  calculateNextBillingDate(interval: string): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }

  createInvoice(customerId: string, amount: number): string {
    console.log(`Creating invoice for ${customerId}: $${amount}`);
    return 'inv_' + Date.now();
  }
}

class SubscriptionDatabase {
  save(subscription: any): void {
    console.log('Saving subscription to database');
  }
}

class EmailNotifier {
  sendWelcomeEmail(email: string, planName: string): void {
    console.log(`Sending welcome email to ${email} for ${planName}`);
  }
}

// ✅ Facade simplifica toda la operación
class SubscriptionFacade {
  private customerRepo: CustomerRepository;
  private planService: PlanService;
  private billingEngine: BillingEngine;
  private subscriptionDB: SubscriptionDatabase;
  private emailNotifier: EmailNotifier;

  constructor() {
    this.customerRepo = new CustomerRepository();
    this.planService = new PlanService();
    this.billingEngine = new BillingEngine();
    this.subscriptionDB = new SubscriptionDatabase();
    this.emailNotifier = new EmailNotifier();
  }

  // ✅ Una llamada simple oculta toda la complejidad
  public createSubscription(customerId: string, planId: string): {
    success: boolean;
    subscriptionId?: string;
    error?: string;
  } {
    // Paso 1: Validar customer
    const customer = this.customerRepo.findById(customerId);
    if (!customer) {
      return { success: false, error: 'Customer not found' };
    }

    // Paso 2: Validar plan
    const plan = this.planService.getPlan(planId);
    if (!plan) {
      return { success: false, error: 'Plan not found' };
    }

    // Paso 3: Calcular billing
    const nextBillingDate = this.billingEngine.calculateNextBillingDate(
      plan.interval
    );

    // Paso 4: Crear invoice inicial
    const invoiceId = this.billingEngine.createInvoice(
      customerId,
      plan.price
    );

    // Paso 5: Guardar subscription
    const subscription = {
      id: 'sub_' + Date.now(),
      customerId,
      planId,
      nextBillingDate,
      invoiceId,
      status: 'active'
    };

    this.subscriptionDB.save(subscription);

    // Paso 6: Notificar
    this.emailNotifier.sendWelcomeEmail(customer.email, planId);

    return { success: true, subscriptionId: subscription.id };
  }

  // ✅ Otra operación compleja simplificada
  public cancelSubscription(subscriptionId: string): boolean {
    // Orquesta: actualizar DB, crear final invoice, enviar email, etc.
    console.log(`Canceling subscription ${subscriptionId}`);
    return true;
  }
}

// Uso simple del facade
function useSubscriptionFacade() {
  const subscriptionFacade = new SubscriptionFacade();

  // ✅ Cliente solo necesita una llamada
  const result = subscriptionFacade.createSubscription('cus_123', 'plan_pro');

  if (result.success) {
    console.log('Subscription created:', result.subscriptionId);
  } else {
    console.log('Error:', result.error);
  }
}

// ==========================================
// SECCIÓN 4: FACADE CON DEPENDENCY INJECTION
// Mejor testabilidad
// ==========================================

/**
 * ✅ Facade con DI para testing
 */

interface IPaymentGateway {
  charge(amount: number, cardNumber: string): { success: boolean; id: string };
}

interface INotificationService {
  sendEmail(to: string, subject: string): void;
}

class TestablePaymentFacade {
  constructor(
    private validator: PaymentValidator,
    private fraudDetector: FraudDetector,
    private gateway: IPaymentGateway, // ✅ Interface
    private notifier: INotificationService, // ✅ Interface
    private logger: TransactionLogger
  ) {}

  public processPayment(
    amount: number,
    cardNumber: string,
    customerId: string,
    email: string
  ): boolean {
    this.logger.log('Starting payment');

    if (!this.validator.validateCard(cardNumber)) return false;
    if (!this.validator.validateAmount(amount)) return false;
    if (!this.fraudDetector.checkFraud(customerId, amount)) {
      this.notifier.sendEmail(email, 'Fraud detected');
      return false;
    }

    const result = this.gateway.charge(amount, cardNumber);

    if (result.success) {
      this.notifier.sendEmail(email, 'Payment successful');
      return true;
    }

    return false;
  }
}

// Testing con mocks
function testFacadeWithMocks() {
  const mockGateway: IPaymentGateway = {
    charge: () => ({ success: true, id: 'mock_charge' })
  };

  const mockNotifier: INotificationService = {
    sendEmail: (to, subject) => console.log(`Mock email: ${subject}`)
  };

  const facade = new TestablePaymentFacade(
    new PaymentValidator(),
    new FraudDetector(),
    mockGateway,
    mockNotifier,
    new TransactionLogger()
  );

  // ✅ Fácil de testear
  const result = facade.processPayment(100, '4242424242424242', 'cus_1', 'test@test.com');
  console.assert(result === true);
}

// ==========================================
// SECCIÓN 5: MULTIPLE FACADES
// Diferentes vistas del mismo subsistema
// ==========================================

/**
 * ✅ Múltiples facades para diferentes necesidades
 */

// Facade simple para casos básicos
class SimplifiedPaymentFacade {
  private paymentFacade: PaymentFacade;

  constructor() {
    this.paymentFacade = new PaymentFacade();
  }

  // ✅ Interface aún más simple
  public quickPayment(amount: number, cardNumber: string): boolean {
    // Usa valores por defecto
    return this.paymentFacade.processPayment(
      amount,
      cardNumber,
      'guest',
      'noreply@example.com'
    );
  }
}

// Facade avanzada para casos complejos
class AdvancedPaymentFacade extends PaymentFacade {
  // ✅ Operaciones adicionales para usuarios avanzados
  public processPaymentWithRetry(
    amount: number,
    cardNumber: string,
    customerId: string,
    email: string,
    maxRetries: number = 3
  ): boolean {
    for (let i = 0; i < maxRetries; i++) {
      const success = this.processPayment(amount, cardNumber, customerId, email);
      if (success) return true;

      console.log(`Retry ${i + 1}/${maxRetries}`);
    }

    return false;
  }
}

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('FACADE PATTERN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Payment Facade:');
goodClientCode();

console.log('\n2. Subscription Facade:');
useSubscriptionFacade();

console.log('\n3. Testing con Mocks:');
testFacadeWithMocks();

console.log('\n✅ Beneficios del Facade:');
console.log('   - Interface simple para subsistema complejo');
console.log('   - Oculta detalles de implementación');
console.log('   - Desacopla cliente de subsistema');
console.log('   - Facilita testing y mantenimiento');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre Facade y Adapter?
 *    Pista: Facade simplifica, Adapter convierte interfaces
 *
 * 2. ¿Facade viola Single Responsibility Principle?
 *    Pista: No, su única responsabilidad es orquestar subsistema
 *
 * 3. ¿Cómo Stripe usa Facade en su SDK?
 *    Pista: stripe.createToken() oculta validación, encriptación, API
 *
 * 4. ¿Facade debe crear subsistemas o recibirlos inyectados?
 *    Pista: Depende, DI mejora testabilidad
 *
 * 5. ¿Puedes tener múltiples facades para mismo subsistema?
 *    Pista: Sí, diferentes niveles de abstracción
 *
 * 6. ¿Facade debe exponer subsistemas?
 *    Pista: Depende, a veces útil para casos avanzados
 *
 * 7. ¿Cuándo Facade se vuelve God Object?
 *    Pista: Cuando hace demasiado, dividir en facades especializados
 *
 * 8. ¿Cómo se relaciona Facade con Microservicios?
 *    Pista: API Gateway es un Facade para microservicios
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Email Facade
 *
 * Crea facade que simplifica envío de emails:
 * - Subsistemas: SMTP client, Template engine, Attachment handler
 * - Facade: sendEmail(to, template, data)
 *
 * El facade debe orquestar:
 * - Cargar template
 * - Renderizar con data
 * - Adjuntar archivos si es necesario
 * - Enviar vía SMTP
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): E-commerce Checkout Facade
 *
 * Diseña facade para checkout process:
 *
 * Subsistemas:
 * - Cart service
 * - Inventory service
 * - Payment service
 * - Shipping service
 * - Tax calculator
 * - Email notifier
 *
 * Facade.checkout() debe:
 * - Validar cart
 * - Reservar inventory
 * - Calcular tax
 * - Procesar payment
 * - Crear shipping label
 * - Enviar confirmación
 * - Manejar rollback si algo falla
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Multi-Gateway Payment Facade
 *
 * Crea facade que:
 * - Soporta múltiples gateways (Stripe, PayPal, Square)
 * - Intelligent routing (selecciona gateway óptimo)
 * - Fallback automático si gateway falla
 * - Rate limiting
 * - Retry logic con exponential backoff
 * - Circuit breaker pattern
 * - Comprehensive logging y métricas
 *
 * Interface: processPayment(amount, method, options)
 *
 * Debe orquestar: validation, routing, processing, fallback, logging
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): API Gateway Facade
 *
 * Diseña API Gateway como Facade para microservicios:
 *
 * Microservicios:
 * - Auth service
 * - User service
 * - Product service
 * - Order service
 * - Payment service
 * - Notification service
 *
 * API Gateway debe:
 * - Request routing
 * - Authentication/Authorization
 * - Rate limiting
 * - Request/Response transformation
 * - Service aggregation (1 request → múltiples services)
 * - Caching
 * - Load balancing
 * - Circuit breaking
 * - Logging y métricas
 *
 * Inspiración: AWS API Gateway, Kong, Nginx
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  PaymentFacade,
  SubscriptionFacade,
  TestablePaymentFacade,
  SimplifiedPaymentFacade,
  AdvancedPaymentFacade
};
