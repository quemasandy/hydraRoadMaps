/**
 * ==========================================
 * ABSTRACCIÓN
 * (Abstraction)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * La abstracción es el proceso de OCULTAR la complejidad de implementación
 * y MOSTRAR solo las características esenciales de un objeto.
 *
 * Dos aspectos clave:
 * 1. **Data Abstraction**: Representar características esenciales sin detalles de implementación
 * 2. **Control Abstraction**: Operaciones de alto nivel que ocultan complejidad interna
 *
 * Diferencia con Encapsulación:
 * - **Encapsulación**: CÓMO ocultamos (private, public, protected)
 * - **Abstracción**: QUÉ ocultamos (complejidad, detalles irrelevantes)
 *
 * 📚 CONCEPTOS CLAVE:
 * - Abstract classes: Clases que no se pueden instanciar directamente
 * - Interfaces: Contratos puros sin implementación
 * - Niveles de abstracción: Bajo nivel → Alto nivel
 * - Abstraction layers: Cada capa oculta la complejidad de la anterior
 * - "Leaky abstractions": Cuando los detalles se filtran
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - Stripe abstrae TODA la complejidad de pagos globales
 * - Cliente usa: `stripe.paymentIntents.create({ amount: 1000 })`
 * - Oculta: PCI compliance, 3D Secure, fraud detection, retry logic,
 *   currency conversion, tax calculation, regulatory compliance
 * - Múltiples niveles: HTTP API → Client Library → Business Logic
 *
 * **AWS:**
 * - S3 abstrae almacenamiento distribuido
 * - Cliente: `s3.upload(file)` - simple
 * - Oculta: Replicación multi-AZ, sharding, partitioning, consistency,
 *   network protocols, disk management
 * - Niveles: SDK → REST API → Distributed Storage → Physical disks
 *
 * **Google Cloud:**
 * - BigQuery abstrae distributed computing
 * - Cliente: SQL queries - familiar
 * - Oculta: Dremel engine, columnar storage, distributed execution,
 *   query optimization
 *
 * **PayPal:**
 * - PayPal Checkout abstrae múltiples payment methods
 * - Cliente: Botón de PayPal - un click
 * - Oculta: Credit cards, bank accounts, PayPal balance, buyer protection,
 *   currency conversion, compliance
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - **Simplifica uso**: Clientes no necesitan entender complejidad interna
 * - **Reduce acoplamiento**: Dependes de abstracción, no de implementación
 * - **Permite evolución**: Puedes cambiar implementación sin afectar clientes
 * - **Mejora mantenibilidad**: Cambios están contenidos en capas
 * - **Facilita testing**: Puedes mockear abstracciones
 */

// ==========================================
// SECCIÓN 1: EJEMPLO SIN ABSTRACCIÓN
// Cliente maneja todos los detalles de bajo nivel
// ==========================================

/**
 * ⚠️ PROBLEMA: Sin abstracción, el cliente debe conocer TODOS los detalles
 *
 * Consecuencias:
 * 1. Código cliente complejo
 * 2. Duplicación de lógica
 * 3. Alto acoplamiento a detalles de implementación
 * 4. Difícil de cambiar o extender
 */

// Cliente debe manejar TODOS los detalles del pago
function processPaymentWithoutAbstraction(
  amount: number,
  cardNumber: string,
  cvv: string,
  expiry: string
) {
  // 1. Validar tarjeta (cliente debe saber cómo)
  if (cardNumber.length !== 16) {
    throw new Error('Invalid card number');
  }

  // 2. Validar CVV (cliente debe saber formato)
  if (cvv.length !== 3 && cvv.length !== 4) {
    throw new Error('Invalid CVV');
  }

  // 3. Parsear expiry (cliente debe saber formato)
  const [month, year] = expiry.split('/').map(Number);
  if (month < 1 || month > 12) {
    throw new Error('Invalid expiry month');
  }

  // 4. Construir request HTTP manualmente
  const requestBody = {
    card: {
      number: cardNumber,
      cvv: cvv,
      exp_month: month,
      exp_year: year
    },
    amount: amount * 100, // Convertir a centavos
    currency: 'usd'
  };

  // 5. Manejar HTTP, headers, auth
  const headers = {
    'Authorization': 'Bearer sk_test_123',
    'Content-Type': 'application/json'
  };

  // 6. Hacer request (pseudo-código)
  // const response = fetch('https://api.stripe.com/v1/charges', {
  //   method: 'POST',
  //   headers,
  //   body: JSON.stringify(requestBody)
  // });

  // 7. Parsear response
  // 8. Manejar errores específicos de Stripe
  // 9. Retry logic si falla
  // ...

  // ⚠️ PROBLEMA: El cliente debe conocer DEMASIADO
  // Si algo cambia en Stripe, TODO este código se rompe
}

// ==========================================
// SECCIÓN 2: EJEMPLO CON ABSTRACCIÓN
// Ocultar complejidad detrás de interface simple
// ==========================================

/**
 * ✅ SOLUCIÓN: Abstraer la complejidad
 *
 * Beneficios:
 * 1. Cliente usa interface simple y de alto nivel
 * 2. Detalles ocultos en implementación
 * 3. Bajo acoplamiento
 * 4. Fácil de cambiar gateway (Stripe → PayPal)
 */

// ✅ Abstracción: Interface de alto nivel
interface PaymentGateway {
  // Interface simple, oculta complejidad
  charge(amount: number, paymentMethod: string): Promise<PaymentResult>;
  refund(chargeId: string, amount?: number): Promise<RefundResult>;
}

interface PaymentResult {
  id: string;
  status: 'succeeded' | 'failed';
  amount: number;
}

interface RefundResult {
  id: string;
  status: 'succeeded' | 'failed';
  amount: number;
}

// Implementación concreta oculta TODOS los detalles
class StripeGateway implements PaymentGateway {
  private apiKey: string;
  private baseUrl: string = 'https://api.stripe.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async charge(
    amount: number,
    paymentMethod: string
  ): Promise<PaymentResult> {
    // Toda la complejidad está OCULTA aquí
    const charge = await this.createCharge(amount, paymentMethod);
    return this.mapToPaymentResult(charge);
  }

  async refund(chargeId: string, amount?: number): Promise<RefundResult> {
    const refund = await this.createRefund(chargeId, amount);
    return this.mapToRefundResult(refund);
  }

  // ❌ Métodos privados: detalles de implementación ocultos
  private async createCharge(
    amount: number,
    paymentMethod: string
  ): Promise<any> {
    // Validación, HTTP request, retry logic, etc.
    // Todo oculto del cliente
    return {
      id: 'ch_123',
      status: 'succeeded',
      amount: amount
    };
  }

  private async createRefund(
    chargeId: string,
    amount?: number
  ): Promise<any> {
    return {
      id: 'ref_123',
      status: 'succeeded',
      amount: amount || 0
    };
  }

  private mapToPaymentResult(charge: any): PaymentResult {
    return {
      id: charge.id,
      status: charge.status,
      amount: charge.amount
    };
  }

  private mapToRefundResult(refund: any): RefundResult {
    return {
      id: refund.id,
      status: refund.status,
      amount: refund.amount
    };
  }
}

// ✅ Cliente usa abstracción simple
async function processPaymentWithAbstraction(
  gateway: PaymentGateway,
  amount: number,
  paymentMethod: string
) {
  // ✅ Simple, de alto nivel, sin detalles
  const result = await gateway.charge(amount, paymentMethod);

  if (result.status === 'succeeded') {
    console.log(`Payment succeeded: ${result.id}`);
  }

  // ✅ El cliente NO sabe:
  // - Cómo se valida la tarjeta
  // - Cómo se hace el HTTP request
  // - Cómo se maneja retry logic
  // - Cómo se parsea la response
  // Todo está ABSTRAÍDO
}

// ==========================================
// SECCIÓN 3: ABSTRACT CLASSES VS INTERFACES
// ==========================================

/**
 * INTERFACES:
 * - Contrato puro, sin implementación
 * - Una clase puede implementar múltiples interfaces
 * - Define "WHAT" (qué debe hacer)
 *
 * ABSTRACT CLASSES:
 * - Pueden tener implementación parcial
 * - Solo puedes heredar de una clase abstracta
 * - Define "WHAT" y parte del "HOW"
 */

// ✅ Abstract Class: Template con implementación parcial
abstract class AbstractPaymentProcessor {
  // ✅ Método concreto: implementación común
  public async processPayment(
    amount: number,
    method: string
  ): Promise<boolean> {
    // Lógica común para TODOS los processors
    if (!this.validateAmount(amount)) {
      return false;
    }

    // Template Method: cada subclase implementa su versión
    const result = await this.executePayment(amount, method);

    // Logging común
    this.logTransaction(result);

    return result;
  }

  // ✅ Método abstracto: subclases DEBEN implementar
  protected abstract executePayment(
    amount: number,
    method: string
  ): Promise<boolean>;

  // ✅ Método concreto protegido: usado por subclases
  protected validateAmount(amount: number): boolean {
    return amount > 0 && Number.isFinite(amount);
  }

  protected logTransaction(success: boolean): void {
    console.log(`Transaction ${success ? 'succeeded' : 'failed'}`);
  }
}

// Subclase concreta: implementa solo lo específico
class StripeProcessor extends AbstractPaymentProcessor {
  protected async executePayment(
    amount: number,
    method: string
  ): Promise<boolean> {
    // Implementación específica de Stripe
    console.log(`Processing ${amount} via Stripe`);
    return true;
  }
}

class PayPalProcessor extends AbstractPaymentProcessor {
  protected async executePayment(
    amount: number,
    method: string
  ): Promise<boolean> {
    // Implementación específica de PayPal
    console.log(`Processing ${amount} via PayPal`);
    return true;
  }
}

// ✅ Cliente usa abstracción
function useAbstractClass() {
  const processors: AbstractPaymentProcessor[] = [
    new StripeProcessor(),
    new PayPalProcessor()
  ];

  processors.forEach(processor => {
    processor.processPayment(100, 'card');
    // Cada uno ejecuta su propia implementación
    // Pero comparten validación y logging
  });
}

// ==========================================
// SECCIÓN 4: NIVELES DE ABSTRACCIÓN
// Capas que ocultan complejidad progresivamente
// ==========================================

/**
 * Sistema de pagos con múltiples niveles de abstracción
 *
 * Nivel 1 (Más bajo): HTTP/Network
 * Nivel 2: Gateway API Client
 * Nivel 3: Payment Service
 * Nivel 4 (Más alto): Business Logic
 */

// Nivel 1: HTTP Client (bajo nivel)
class HttpClient {
  async post(url: string, data: any, headers: any): Promise<any> {
    // Detalles de HTTP: sockets, TCP, TLS, etc.
    console.log(`POST ${url}`);
    return { status: 200, data: { id: 'ch_123' } };
  }
}

// Nivel 2: Gateway API Client (abstrae HTTP)
class StripeAPIClient {
  private http: HttpClient;
  private apiKey: string;

  constructor(apiKey: string) {
    this.http = new HttpClient();
    this.apiKey = apiKey;
  }

  async createCharge(amount: number, source: string): Promise<any> {
    // Abstrae detalles de HTTP
    const url = 'https://api.stripe.com/v1/charges';
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const data = { amount, source, currency: 'usd' };

    return await this.http.post(url, data, headers);
  }
}

// Nivel 3: Payment Service (abstrae API específica)
class PaymentService {
  private stripeClient: StripeAPIClient;

  constructor(apiKey: string) {
    this.stripeClient = new StripeAPIClient(apiKey);
  }

  async charge(
    amountInDollars: number,
    cardToken: string
  ): Promise<string> {
    // Abstrae conversión de unidades y mapeo
    const amountInCents = amountInDollars * 100;
    const result = await this.stripeClient.createCharge(
      amountInCents,
      cardToken
    );
    return result.data.id;
  }
}

// Nivel 4: Business Logic (más alto nivel)
class CheckoutService {
  private paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  async completeOrder(
    orderId: string,
    amount: number,
    cardToken: string
  ): Promise<void> {
    // Abstracción de alto nivel: lógica de negocio
    console.log(`Processing order ${orderId}`);

    const chargeId = await this.paymentService.charge(amount, cardToken);

    console.log(`Order completed with charge: ${chargeId}`);

    // Aquí: enviar email, actualizar inventario, etc.
  }
}

// ✅ Cada nivel abstrae el anterior
// ✅ CheckoutService no sabe nada de HTTP, Stripe API, centavos, etc.

// ==========================================
// SECCIÓN 5: LEAKY ABSTRACTIONS
// Cuando los detalles se filtran
// ==========================================

/**
 * "Leaky Abstraction": Abstracción que no oculta completamente
 * los detalles de implementación
 *
 * Esto es MALO porque rompe el propósito de la abstracción
 */

// ⚠️ LEAKY: Cliente debe conocer detalles de Stripe
interface LeakyPaymentGateway {
  // ⚠️ Problema: Expone concepto específico de Stripe (PaymentIntent)
  createPaymentIntent(amount: number): Promise<StripePaymentIntent>;

  // ⚠️ Problema: Usa tipos específicos de Stripe
  confirmPaymentIntent(intent: StripePaymentIntent): Promise<void>;
}

interface StripePaymentIntent {
  id: string;
  client_secret: string; // Concepto específico de Stripe
  status: string;
}

// Si cambias a PayPal, ¡la interface no tiene sentido!

// ✅ GOOD: Abstracción que oculta detalles del gateway
interface GoodPaymentGateway {
  // ✅ Conceptos genéricos, no específicos de un proveedor
  initiatePayment(amount: number): Promise<PaymentSession>;
  confirmPayment(sessionId: string): Promise<PaymentResult>;
}

interface PaymentSession {
  id: string;
  status: 'pending' | 'ready' | 'completed';
}

// Esta abstracción funciona para Stripe, PayPal, Square, etc.

// ==========================================
// SECCIÓN 6: ABSTRACTION LAYERS EN BILLING
// Sistema real de facturación con capas
// ==========================================

/**
 * 💰 CASO REAL: Sistema de billing con múltiples abstracciones
 *
 * Inspirado en arquitectura de Stripe Billing
 */

// ✅ Nivel 1: Repository abstrae persistencia
interface SubscriptionRepository {
  save(subscription: Subscription): Promise<void>;
  findById(id: string): Promise<Subscription | null>;
  findByCustomer(customerId: string): Promise<Subscription[]>;
}

// ✅ Nivel 2: Pricing abstrae cálculos de precio
interface PricingCalculator {
  calculatePrice(planId: string, quantity: number): number;
  calculateProration(
    oldPlan: string,
    newPlan: string,
    daysRemaining: number
  ): number;
}

// ✅ Nivel 3: BillingService abstrae flujo de billing
interface BillingService {
  createSubscription(
    customerId: string,
    planId: string
  ): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  changePlan(subscriptionId: string, newPlanId: string): Promise<void>;
}

interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: number;
}

// Implementación concreta (oculta TODOS los detalles)
class StripeBillingService implements BillingService {
  constructor(
    private repo: SubscriptionRepository,
    private pricing: PricingCalculator,
    private gateway: PaymentGateway
  ) {}

  async createSubscription(
    customerId: string,
    planId: string
  ): Promise<Subscription> {
    // Toda la complejidad está aquí, OCULTA del cliente
    const price = this.pricing.calculatePrice(planId, 1);

    // Cargar primer período
    await this.gateway.charge(price, 'pm_123');

    // Crear subscription
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      customerId,
      planId,
      status: 'active',
      currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 días
    };

    await this.repo.save(subscription);

    return subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const sub = await this.repo.findById(subscriptionId);
    if (!sub) throw new Error('Subscription not found');

    sub.status = 'canceled';
    await this.repo.save(sub);
  }

  async changePlan(
    subscriptionId: string,
    newPlanId: string
  ): Promise<void> {
    const sub = await this.repo.findById(subscriptionId);
    if (!sub) throw new Error('Subscription not found');

    // Calcular prorateo (lógica compleja oculta)
    const daysRemaining = Math.floor(
      (sub.currentPeriodEnd - Date.now()) / (24 * 60 * 60 * 1000)
    );
    const proratedAmount = this.pricing.calculateProration(
      sub.planId,
      newPlanId,
      daysRemaining
    );

    // Cobrar diferencia
    if (proratedAmount > 0) {
      await this.gateway.charge(proratedAmount, 'pm_123');
    }

    sub.planId = newPlanId;
    await this.repo.save(sub);
  }
}

// ✅ Cliente usa abstracción de alto nivel
async function useStripeBillingService(billing: BillingService) {
  // ✅ Operaciones simples, de alto nivel
  const subscription = await billing.createSubscription('cus_123', 'plan_pro');

  console.log(`Subscription created: ${subscription.id}`);

  // Cambiar plan (toda la complejidad de prorateo está oculta)
  await billing.changePlan(subscription.id, 'plan_enterprise');

  // Cancelar
  await billing.cancelSubscription(subscription.id);

  // ✅ Cliente NO sabe sobre:
  // - Cómo se calcula el prorateo
  // - Cómo se almacenan las suscripciones
  // - Cómo se procesa el pago
  // - Detalles de Stripe API
}

// ==========================================
// SECCIÓN 7: FACADE PATTERN
// Abstracción que simplifica subsistemas complejos
// ==========================================

/**
 * Facade: Interface unificada para un subsistema complejo
 */

// Subsistemas complejos
class PaymentValidator {
  validate(amount: number, method: string): boolean {
    return amount > 0 && !!method;
  }
}

class FraudDetector {
  checkFraud(customerId: string, amount: number): boolean {
    // Lógica compleja de fraud detection
    return amount < 10000; // Simplificado
  }
}

class PaymentLogger {
  log(message: string): void {
    console.log(`[Payment Log] ${message}`);
  }
}

class PaymentNotifier {
  sendConfirmation(email: string, amount: number): void {
    console.log(`Email sent to ${email}: Payment of ${amount} confirmed`);
  }
}

// ✅ Facade abstrae todos los subsistemas
class PaymentFacade {
  private validator: PaymentValidator;
  private fraudDetector: FraudDetector;
  private logger: PaymentLogger;
  private notifier: PaymentNotifier;
  private gateway: PaymentGateway;

  constructor(gateway: PaymentGateway) {
    this.validator = new PaymentValidator();
    this.fraudDetector = new FraudDetector();
    this.logger = new PaymentLogger();
    this.notifier = new PaymentNotifier();
    this.gateway = gateway;
  }

  // ✅ Interface simple que orquesta subsistemas complejos
  async processPayment(
    customerId: string,
    amount: number,
    method: string,
    email: string
  ): Promise<boolean> {
    this.logger.log(`Processing payment for ${customerId}`);

    // Validar
    if (!this.validator.validate(amount, method)) {
      this.logger.log('Validation failed');
      return false;
    }

    // Fraud check
    if (!this.fraudDetector.checkFraud(customerId, amount)) {
      this.logger.log('Fraud detected');
      return false;
    }

    // Procesar pago
    const result = await this.gateway.charge(amount, method);

    if (result.status === 'succeeded') {
      // Notificar
      this.notifier.sendConfirmation(email, amount);
      this.logger.log('Payment succeeded');
      return true;
    }

    this.logger.log('Payment failed');
    return false;
  }
}

// ✅ Cliente usa una sola interface simple
async function useFacade(facade: PaymentFacade) {
  const success = await facade.processPayment(
    'cus_123',
    5000,
    'card',
    'customer@example.com'
  );

  console.log(`Payment ${success ? 'succeeded' : 'failed'}`);

  // ✅ Cliente NO necesita saber sobre:
  // - PaymentValidator
  // - FraudDetector
  // - PaymentLogger
  // - PaymentNotifier
  // Facade abstrae toda esa complejidad
}

// ==========================================
// SECCIÓN 8: MEJORES PRÁCTICAS
// ==========================================

/**
 * ✅ MEJORES PRÁCTICAS DE ABSTRACCIÓN:
 *
 * 1. **Single Level of Abstraction Principle (SLAP)**
 *    - Cada método debe operar en UN solo nivel de abstracción
 *    - No mezcles alto nivel con bajo nivel en el mismo método
 *
 * 2. **Abstraer lo volátil**
 *    - Abstrae detalles que probablemente cambien
 *    - No sobre-abstraigas cosas estables
 *
 * 3. **Nombres descriptivos**
 *    - Nombres de alto nivel reflejan "qué" hace, no "cómo"
 *    - `processPayment()` no `sendHttpPostToStripeAPI()`
 *
 * 4. **Interfaces sobre implementaciones**
 *    - Depende de abstracciones (interfaces), no de concreciones
 *
 * 5. **Evita leaky abstractions**
 *    - No expongas detalles de implementación en la interface
 *    - PaymentGateway no debe exponer conceptos de Stripe
 *
 * 6. **Capas coherentes**
 *    - Cada capa debe tener propósito claro
 *    - No saltes niveles (Controller → Database directamente)
 *
 * 7. **Abstract classes para shared behavior**
 *    - Usa abstract classes cuando subclases comparten lógica
 *    - Usa interfaces cuando solo defines contrato
 *
 * 8. **Documentar la abstracción**
 *    - Explica qué oculta y por qué
 *    - Documenta invariantes y precondiciones
 */

/**
 * ⚠️ ERRORES COMUNES:
 *
 * 1. **Over-abstraction**
 *    - Crear abstracciones antes de necesitarlas
 *    - "Rule of Three": Abstrae cuando tienes 3+ casos similares
 *
 * 2. **Under-abstraction**
 *    - Dejar detalles de bajo nivel en código de alto nivel
 *    - Mixing SQL queries en controllers
 *
 * 3. **Leaky abstractions**
 *    - Exponer detalles de implementación
 *    - Forzar clientes a conocer internals
 *
 * 4. **Wrong abstraction**
 *    - Abstracción que no modela correctamente el dominio
 *    - Más costoso que duplicación
 *
 * 5. **Mixing abstraction levels**
 *    - Tener alto y bajo nivel en mismo método/clase
 *
 * 6. **God interfaces**
 *    - Interfaces con demasiados métodos
 *    - Viola Interface Segregation Principle
 */

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('ABSTRACCIÓN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Sin abstracción:');
console.log('   - Cliente maneja todos los detalles');
console.log('   - Código complejo y frágil');

console.log('\n2. Con abstracción:');
const gateway = new StripeGateway('sk_test_123');
console.log('   - Cliente usa interface simple');
console.log('   - Complejidad oculta');

console.log('\n3. Abstract classes:');
useAbstractClass();

console.log('\n4. Niveles de abstracción:');
console.log('   HTTP → API Client → Service → Business Logic');

console.log('\n5. Facade pattern:');
const facade = new PaymentFacade(gateway);
useFacade(facade);

console.log('\n✅ Beneficios de abstracción:');
console.log('   - Simplifica uso (oculta complejidad)');
console.log('   - Reduce acoplamiento (depende de interface)');
console.log('   - Permite evolución (cambiar implementación)');
console.log('   - Mejora mantenibilidad (cambios localizados)');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre abstracción y encapsulación?
 *    Pista: Encapsulación es el "cómo", abstracción es el "qué"
 *
 * 2. ¿Cuándo usarías abstract class vs interface?
 *    Pista: Abstract class cuando hay implementación compartida
 *
 * 3. ¿Qué es una "leaky abstraction" y por qué es problemática?
 *    Pista: Cuando detalles de implementación se filtran a la interface
 *
 * 4. ¿Cómo Stripe abstrae la complejidad de pagos globales?
 *    Pista: Una API simple oculta PCI, 3DS, fraud, compliance, etc.
 *
 * 5. ¿Qué significa "Single Level of Abstraction Principle"?
 *    Pista: Cada método opera en un solo nivel (no mezclar alto/bajo)
 *
 * 6. ¿Cuándo una abstracción es "prematura" o "innecesaria"?
 *    Pista: Cuando no hay variación o complejidad real que ocultar
 *
 * 7. ¿Cómo se relaciona Dependency Inversion con abstracción?
 *    Pista: Ambos promueven depender de abstracciones, no concreciones
 *
 * 8. ¿Qué trade-offs tiene agregar capas de abstracción?
 *    Pista: Simplicidad vs indirección, debugging más difícil
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Abstraer operaciones de archivo
 *
 * Dado código que lee/escribe archivos directamente:
 *
 * ```typescript
 * function saveData(data: string) {
 *   const fs = require('fs');
 *   fs.writeFileSync('/path/to/file.txt', data);
 * }
 * ```
 *
 * Crea una abstracción `StorageService` que:
 * - Oculta detalles de filesystem
 * - Puede cambiar a S3, DB, etc. sin afectar clientes
 * - Interface: save(key, data), load(key), delete(key)
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Email Service con abstracciones
 *
 * Crea un sistema de email con múltiples niveles:
 *
 * 1. **EmailProvider** (bajo nivel): SendGrid, Mailgun, SES
 * 2. **EmailService** (medio): Templates, retry logic
 * 3. **NotificationService** (alto): Lógica de negocio
 *
 * Requisitos:
 * - NotificationService.sendPaymentConfirmation(order)
 * - Debe poder cambiar de SendGrid a Mailgun sin cambiar NotificationService
 * - Abstraer: templates, retry, rate limiting
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Multi-currency Payment System
 *
 * Diseña abstracción para pagos multi-currency que oculte:
 * - Currency conversion (API externa)
 * - Exchange rates (cambiar provider)
 * - Rounding rules (diferentes por país)
 * - Tax calculation (VAT, sales tax, GST)
 *
 * Interface pública:
 * ```typescript
 * interface PaymentService {
 *   charge(amount: Money, paymentMethod: string): Promise<Receipt>;
 * }
 *
 * interface Money {
 *   amount: number;
 *   currency: string;
 * }
 * ```
 *
 * Toda la complejidad debe estar oculta.
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Database Abstraction Layer
 *
 * Diseña un ORM-like abstraction que oculte:
 * - SQL vs NoSQL differences
 * - Connection pooling
 * - Query optimization
 * - Transactions
 * - Migrations
 *
 * Debe soportar múltiples backends:
 * - PostgreSQL (relational)
 * - MongoDB (document)
 * - DynamoDB (key-value)
 *
 * Interface pública:
 * ```typescript
 * interface Repository<T> {
 *   find(query: Query): Promise<T[]>;
 *   save(entity: T): Promise<void>;
 *   delete(id: string): Promise<void>;
 * }
 * ```
 *
 * Inspiración: TypeORM, Prisma, Hibernate
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Interfaces
  PaymentGateway,
  BillingService,

  // Implementations
  StripeGateway,
  StripeBillingService,
  PaymentFacade,

  // Abstract classes
  AbstractPaymentProcessor,
  StripeProcessor,
  PayPalProcessor
};
