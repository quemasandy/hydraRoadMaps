/**
 * ==========================================
 * ACOPLAMIENTO Y COHESIÓN
 * (Coupling and Cohesion)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * ACOPLAMIENTO (Coupling):
 * - Mide el grado de interdependencia entre módulos/clases
 * - Queremos BAJO acoplamiento (loose coupling)
 * - Módulos independientes son más fáciles de mantener, probar y reutilizar
 *
 * COHESIÓN (Cohesion):
 * - Mide qué tan relacionadas están las responsabilidades dentro de un módulo
 * - Queremos ALTA cohesión (high cohesion)
 * - Módulos cohesivos tienen un propósito claro y único
 *
 * 📚 CONCEPTOS CLAVE:
 * - Bajo acoplamiento: Módulos pueden cambiar independientemente
 * - Alta cohesión: Módulo hace una cosa y la hace bien
 * - Tipos de acoplamiento: Content, Common, External, Control, Stamp, Data
 * - Tipos de cohesión: Functional, Sequential, Communicational, Procedural, Temporal, Logical, Coincidental
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - Microservicios con bajo acoplamiento para independencia de deployment
 * - Payment Processing Service no depende de Billing Service internamente
 * - Comunicación vía eventos (event-driven architecture)
 * - Alta cohesión: ChargeService solo maneja cargos, RefundService solo reembolsos
 *
 * **PayPal:**
 * - Arquitectura de servicios desacoplados permite escalar componentes independientemente
 * - Fraud Detection Service opera independiente de Payment Processing
 * - Interfaces bien definidas reducen acoplamiento
 *
 * **Amazon:**
 * - "Two-pizza teams" con servicios altamente cohesivos
 * - APIs públicas fuerzan bajo acoplamiento entre equipos
 * - Cada servicio tiene un propósito claro (Order Service, Inventory Service, Payment Service)
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Facilita el mantenimiento: cambios localizados no afectan otros módulos
 * - Mejora la testeabilidad: módulos desacoplados se pueden probar en aislamiento
 * - Permite la reutilización: módulos cohesivos tienen valor independiente
 * - Escalabilidad: módulos desacoplados se pueden escalar independientemente
 * - Reduce complejidad: cohesión alta = propósito claro
 */

// ==========================================
// SECCIÓN 1: TIPOS DE ACOPLAMIENTO
// (De peor a mejor)
// ==========================================

/**
 * 1. CONTENT COUPLING (El peor) ⚠️
 * Un módulo modifica los datos internos de otro módulo directamente
 */

class BadPaymentProcessor {
  // Expone datos internos públicamente
  public transactionLog: string[] = [];
  public balance: number = 0;
}

class BadBillingSystem {
  processPayment(processor: BadPaymentProcessor) {
    // ⚠️ MALO: Modifica directamente los internals de otro módulo
    processor.balance += 100;
    processor.transactionLog.push('Direct modification');
    // Si PaymentProcessor cambia su estructura interna, esto se rompe
  }
}

/**
 * 2. COMMON COUPLING ⚠️
 * Módulos comparten datos globales
 */

// Estado global compartido
let globalPaymentConfig = {
  apiKey: 'sk_test_123',
  timeout: 5000
};

class PaymentServiceA {
  process() {
    // ⚠️ MALO: Depende de estado global
    console.log(`Using API key: ${globalPaymentConfig.apiKey}`);
  }
}

class PaymentServiceB {
  updateConfig() {
    // ⚠️ MALO: Modificar esto afecta a todos los servicios
    globalPaymentConfig.timeout = 10000;
  }
}

/**
 * 3. STAMP COUPLING (Aceptable pero mejorable) ⚙️
 * Módulos comparten estructuras de datos complejas, pero solo usan parte
 */

interface CompletePaymentData {
  id: string;
  amount: number;
  currency: string;
  customer: {
    id: string;
    email: string;
    name: string;
    address: string;
    phone: string;
  };
  card: {
    number: string;
    exp: string;
    cvv: string;
  };
  metadata: Record<string, any>;
}

class EmailService {
  // ⚙️ MEJORABLE: Recibe toda la estructura pero solo usa email
  sendReceipt(payment: CompletePaymentData) {
    console.log(`Sending to ${payment.customer.email}`);
    // Solo necesita el email, pero recibe todo
  }
}

/**
 * 4. DATA COUPLING (El mejor) ✅
 * Módulos se comunican solo con datos primitivos o estructuras mínimas necesarias
 */

class GoodEmailService {
  // ✅ EXCELENTE: Solo recibe lo que necesita
  sendReceipt(email: string, amount: number, currency: string) {
    console.log(`Sending receipt to ${email} for ${amount} ${currency}`);
  }
}

// ==========================================
// SECCIÓN 2: TIPOS DE COHESIÓN
// (De peor a mejor)
// ==========================================

/**
 * 1. COINCIDENTAL COHESION (La peor) ⚠️
 * Funcionalidades no relacionadas agrupadas arbitrariamente
 */

class UtilityService {
  // ⚠️ MALO: Funcionalidades no relacionadas
  processPayment() { /* ... */ }
  sendEmail() { /* ... */ }
  calculateTax() { /* ... */ }
  validateAddress() { /* ... */ }
  generatePDF() { /* ... */ }
  // No hay relación clara entre estas funciones
}

/**
 * 2. LOGICAL COHESION ⚠️
 * Funcionalidades relacionadas lógicamente pero operacionalmente diferentes
 */

class InputHandler {
  // ⚠️ MEJORABLE: Maneja diferentes tipos de input
  handle(type: string, data: any) {
    switch (type) {
      case 'payment':
        return this.handlePayment(data);
      case 'refund':
        return this.handleRefund(data);
      case 'subscription':
        return this.handleSubscription(data);
    }
  }

  private handlePayment(data: any) { /* ... */ }
  private handleRefund(data: any) { /* ... */ }
  private handleSubscription(data: any) { /* ... */ }
}

/**
 * 3. FUNCTIONAL COHESION (La mejor) ✅
 * Todas las partes contribuyen a una única función bien definida
 */

// ✅ EXCELENTE: Alta cohesión funcional
class PaymentValidator {
  // Todas las funciones contribuyen a UN propósito: validar pagos
  validate(payment: Payment): ValidationResult {
    const errors: string[] = [];

    if (!this.isValidAmount(payment.amount)) {
      errors.push('Invalid amount');
    }

    if (!this.isValidCurrency(payment.currency)) {
      errors.push('Invalid currency');
    }

    if (!this.isValidPaymentMethod(payment.method)) {
      errors.push('Invalid payment method');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidAmount(amount: number): boolean {
    return amount > 0 && Number.isFinite(amount);
  }

  private isValidCurrency(currency: string): boolean {
    return ['USD', 'EUR', 'GBP'].includes(currency);
  }

  private isValidPaymentMethod(method: string): boolean {
    return ['card', 'bank_account', 'wallet'].includes(method);
  }
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ==========================================
// SECCIÓN 3: EJEMPLO MALO - ALTO ACOPLAMIENTO, BAJA COHESIÓN
// Sistema de billing monolítico
// ==========================================

/**
 * ⚠️ VIOLACIÓN: Alto acoplamiento y baja cohesión
 *
 * Problemas:
 * 1. BillingSystem hace DEMASIADAS cosas (baja cohesión)
 * 2. Depende directamente de implementaciones concretas (alto acoplamiento)
 * 3. Difícil de testear: necesitas toda la infraestructura
 * 4. Difícil de mantener: cambios en una parte afectan todo
 * 5. Imposible de reutilizar: está todo acoplado
 */

class DatabaseConnection {
  save(data: any) {
    console.log('Saving to database:', data);
  }
}

class EmailClient {
  send(to: string, subject: string, body: string) {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

class StripeAPI {
  charge(amount: number, token: string) {
    console.log(`Charging ${amount} via Stripe`);
    return { id: 'ch_123', status: 'succeeded' };
  }
}

class BadBillingSystemMonolithic {
  // ⚠️ Alto acoplamiento: depende directamente de implementaciones concretas
  private db = new DatabaseConnection();
  private email = new EmailClient();
  private stripe = new StripeAPI();

  // ⚠️ Baja cohesión: hace demasiadas cosas no relacionadas
  processBilling(
    customerId: string,
    amount: number,
    cardToken: string,
    email: string
  ) {
    // 1. Validación
    if (amount <= 0) throw new Error('Invalid amount');
    if (!cardToken) throw new Error('No card token');

    // 2. Procesamiento de pago
    const charge = this.stripe.charge(amount, cardToken);

    // 3. Guardado en DB
    this.db.save({
      customerId,
      chargeId: charge.id,
      amount,
      timestamp: Date.now()
    });

    // 4. Generación de PDF (¿por qué está aquí?)
    const pdf = this.generateInvoicePDF(customerId, amount);

    // 5. Envío de email
    this.email.send(
      email,
      'Payment Receipt',
      `Your payment of ${amount} was processed`
    );

    // 6. Logging
    console.log(`Payment processed for customer ${customerId}`);

    // 7. Actualización de analytics
    this.updateAnalytics(customerId, amount);

    // ⚠️ PROBLEMA: Esta clase hace TODO
    // Si algo cambia en cualquier parte, toda la clase se ve afectada
  }

  private generateInvoicePDF(customerId: string, amount: number): string {
    return `Invoice PDF for ${customerId}: ${amount}`;
  }

  private updateAnalytics(customerId: string, amount: number) {
    console.log(`Analytics updated for ${customerId}`);
  }
}

// Usar este sistema es difícil de testear
function testBadSystem() {
  const billing = new BadBillingSystemMonolithic();
  // Para testear necesitas:
  // - Base de datos real o mock
  // - Cliente de email real o mock
  // - Stripe API real o mock
  // - Todo está acoplado, no puedes testear en aislamiento
}

// ==========================================
// SECCIÓN 4: EJEMPLO BUENO - BAJO ACOPLAMIENTO, ALTA COHESIÓN
// Sistema de billing modular
// ==========================================

/**
 * ✅ SOLUCIÓN: Bajo acoplamiento y alta cohesión
 *
 * Beneficios:
 * 1. Cada clase tiene UNA responsabilidad (alta cohesión)
 * 2. Dependencias inyectadas vía interfaces (bajo acoplamiento)
 * 3. Fácil de testear: puedes mockear cada dependencia
 * 4. Fácil de mantener: cambios están localizados
 * 5. Reutilizable: cada componente tiene valor independiente
 */

// Interfaces definen contratos (bajo acoplamiento)
interface IPaymentGateway {
  charge(amount: number, token: string): Promise<ChargeResult>;
}

interface IRepository {
  save<T>(entity: T): Promise<void>;
}

interface INotificationService {
  sendPaymentConfirmation(email: string, amount: number): Promise<void>;
}

interface IInvoiceGenerator {
  generate(customerId: string, amount: number): Promise<string>;
}

interface ChargeResult {
  id: string;
  status: 'succeeded' | 'failed';
}

// ✅ Alta cohesión: Solo valida pagos
class GoodPaymentValidator {
  validate(amount: number, token: string): ValidationResult {
    const errors: string[] = [];

    if (amount <= 0) {
      errors.push('Amount must be positive');
    }

    if (!token) {
      errors.push('Payment token is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// ✅ Alta cohesión: Solo procesa pagos
class GoodPaymentProcessor {
  constructor(
    private gateway: IPaymentGateway,
    private validator: GoodPaymentValidator
  ) {}

  async process(amount: number, token: string): Promise<ChargeResult> {
    const validation = this.validator.validate(amount, token);

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return await this.gateway.charge(amount, token);
  }
}

// ✅ Alta cohesión: Solo guarda transacciones
class TransactionRepository {
  constructor(private db: IRepository) {}

  async saveTransaction(
    customerId: string,
    chargeId: string,
    amount: number
  ): Promise<void> {
    await this.db.save({
      customerId,
      chargeId,
      amount,
      timestamp: Date.now()
    });
  }
}

// ✅ Alta cohesión: Orquesta el flujo, pero delega responsabilidades
class GoodBillingService {
  constructor(
    private paymentProcessor: GoodPaymentProcessor,
    private transactionRepo: TransactionRepository,
    private notificationService: INotificationService,
    private invoiceGenerator: IInvoiceGenerator
  ) {
    // ✅ Bajo acoplamiento: Depende de abstracciones, no de implementaciones
  }

  async processBilling(
    customerId: string,
    amount: number,
    cardToken: string,
    email: string
  ): Promise<void> {
    // Delega cada responsabilidad al módulo apropiado
    const charge = await this.paymentProcessor.process(amount, cardToken);

    await this.transactionRepo.saveTransaction(
      customerId,
      charge.id,
      amount
    );

    const invoice = await this.invoiceGenerator.generate(customerId, amount);

    await this.notificationService.sendPaymentConfirmation(email, amount);

    // ✅ Cada paso está desacoplado y delegado a un módulo cohesivo
  }
}

// ==========================================
// SECCIÓN 5: MÉTRICAS DE ACOPLAMIENTO Y COHESIÓN
// ==========================================

/**
 * 🔍 CÓMO MEDIR ACOPLAMIENTO:
 *
 * 1. **Afferent Coupling (Ca)**: Cuántas clases dependen de esta clase
 * 2. **Efferent Coupling (Ce)**: De cuántas clases depende esta clase
 * 3. **Instability (I)**: Ce / (Ca + Ce)
 *    - I = 0: Totalmente estable (muchas clases dependen de ti)
 *    - I = 1: Totalmente inestable (dependes de muchas clases)
 *
 * 🎯 Objetivo: Bajo Ce (pocas dependencias salientes)
 */

// Ejemplo de clase con bajo acoplamiento
class LowCouplingExample {
  // Solo depende de 1 interface (Ce = 1)
  constructor(private logger: ILogger) {}

  doSomething() {
    this.logger.log('Action performed');
  }
}

interface ILogger {
  log(message: string): void;
}

/**
 * 🔍 CÓMO MEDIR COHESIÓN:
 *
 * LCOM (Lack of Cohesion of Methods):
 * - Mide cuánto comparten métodos las variables de instancia
 * - LCOM bajo = Alta cohesión
 * - LCOM alto = Baja cohesión (clase hace cosas no relacionadas)
 */

// ⚠️ LCOM alto (baja cohesión)
class HighLCOM {
  private paymentAmount: number = 0;
  private userName: string = '';
  private logFile: string = '';

  // Estos métodos no comparten variables
  processPayment() {
    return this.paymentAmount * 1.1;
  }

  formatUserName() {
    return this.userName.toUpperCase();
  }

  writeLog() {
    return `Log: ${this.logFile}`;
  }
}

// ✅ LCOM bajo (alta cohesión)
class LowLCOM {
  private amount: number = 0;
  private currency: string = 'USD';
  private fee: number = 0;

  // Todos los métodos trabajan con las mismas variables
  calculateTotal(): number {
    return this.amount + this.fee;
  }

  format(): string {
    return `${this.calculateTotal()} ${this.currency}`;
  }

  applyDiscount(percent: number): void {
    this.amount = this.amount * (1 - percent / 100);
  }
}

// ==========================================
// SECCIÓN 6: PATRONES PARA REDUCIR ACOPLAMIENTO
// ==========================================

/**
 * PATRÓN 1: Dependency Injection
 * Inyectar dependencias en lugar de crearlas internamente
 */

// ⚠️ MALO: Alto acoplamiento
class TightlyCoupledService {
  private gateway = new StripeAPI(); // Acoplado a Stripe

  process() {
    this.gateway.charge(100, 'tok_123');
  }
}

// ✅ BUENO: Bajo acoplamiento
class LooselyCoupledService {
  constructor(private gateway: IPaymentGateway) {
    // Puede ser Stripe, PayPal, o cualquier implementación
  }

  process() {
    this.gateway.charge(100, 'tok_123');
  }
}

/**
 * PATRÓN 2: Event-Driven Architecture
 * Desacoplar mediante eventos en lugar de llamadas directas
 */

type EventHandler = (event: any) => void;

class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventType: string, handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  publish(eventType: string, event: any) {
    const handlers = this.handlers.get(eventType) || [];
    handlers.forEach(handler => handler(event));
  }
}

// ✅ Servicios desacoplados vía eventos
class PaymentService {
  constructor(private eventBus: EventBus) {}

  async processPayment(amount: number) {
    // Procesar pago...

    // Publicar evento en lugar de llamar servicios directamente
    this.eventBus.publish('payment.completed', {
      amount,
      timestamp: Date.now()
    });
  }
}

class AnalyticsService {
  constructor(eventBus: EventBus) {
    // Suscribirse a eventos de interés
    eventBus.subscribe('payment.completed', (event) => {
      this.trackPayment(event);
    });
  }

  private trackPayment(event: any) {
    console.log('Tracking payment:', event);
  }
}

class EmailServiceDecoupled {
  constructor(eventBus: EventBus) {
    eventBus.subscribe('payment.completed', (event) => {
      this.sendConfirmation(event);
    });
  }

  private sendConfirmation(event: any) {
    console.log('Sending email for payment:', event);
  }
}

// ✅ PaymentService no sabe nada de Analytics o Email
// ✅ Analytics y Email pueden agregarse/removerse sin afectar PaymentService

/**
 * PATRÓN 3: Facade Pattern
 * Simplificar interfaces complejas
 */

class ComplexPaymentSubsystem {
  validateCard() { /* ... */ }
  authorizePayment() { /* ... */ }
  capturePayment() { /* ... */ }
  updateInventory() { /* ... */ }
  sendReceipt() { /* ... */ }
}

// ✅ Facade oculta complejidad
class PaymentFacade {
  private subsystem = new ComplexPaymentSubsystem();

  processPayment(amount: number, card: string) {
    // Orquesta las llamadas complejas
    this.subsystem.validateCard();
    this.subsystem.authorizePayment();
    this.subsystem.capturePayment();
    this.subsystem.updateInventory();
    this.subsystem.sendReceipt();
  }
}

// Cliente solo ve interface simple
const facade = new PaymentFacade();
facade.processPayment(100, 'card_123');

// ==========================================
// SECCIÓN 7: CASO DE USO REAL - SISTEMA DE BILLING STRIPE-LIKE
// Aplicando bajo acoplamiento y alta cohesión
// ==========================================

/**
 * 💰 CONTEXTO DE BILLING:
 * Sistema de facturación con múltiples componentes desacoplados
 * Similar a cómo Stripe organiza sus servicios internamente
 */

// Interfaces para bajo acoplamiento
interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  save(customer: Customer): Promise<void>;
}

interface IPricingService {
  calculatePrice(planId: string, quantity: number): number;
  calculateTax(amount: number, country: string): number;
}

interface ISubscriptionRepository {
  save(subscription: Subscription): Promise<void>;
}

// Entidades de dominio
interface Customer {
  id: string;
  email: string;
  paymentMethod: string;
}

interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'canceled';
}

// ✅ Alta cohesión: Solo calcula precios
class PricingService implements IPricingService {
  private plans = new Map([
    ['basic', 10],
    ['pro', 25],
    ['enterprise', 100]
  ]);

  private taxRates = new Map([
    ['US', 0.08],
    ['EU', 0.20],
    ['JP', 0.10]
  ]);

  calculatePrice(planId: string, quantity: number): number {
    const basePrice = this.plans.get(planId) || 0;
    return basePrice * quantity;
  }

  calculateTax(amount: number, country: string): number {
    const rate = this.taxRates.get(country) || 0;
    return amount * rate;
  }
}

// ✅ Alta cohesión: Solo maneja suscripciones
class SubscriptionService {
  constructor(
    private customerRepo: ICustomerRepository,
    private subscriptionRepo: ISubscriptionRepository,
    private pricingService: IPricingService,
    private paymentProcessor: GoodPaymentProcessor,
    private eventBus: EventBus
  ) {
    // ✅ Bajo acoplamiento: Todas las dependencias son interfaces
  }

  async createSubscription(
    customerId: string,
    planId: string,
    country: string
  ): Promise<void> {
    // 1. Obtener customer
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) throw new Error('Customer not found');

    // 2. Calcular precio con impuestos
    const basePrice = this.pricingService.calculatePrice(planId, 1);
    const tax = this.pricingService.calculateTax(basePrice, country);
    const totalAmount = basePrice + tax;

    // 3. Procesar pago
    await this.paymentProcessor.process(totalAmount, customer.paymentMethod);

    // 4. Crear suscripción
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      customerId,
      planId,
      status: 'active'
    };
    await this.subscriptionRepo.save(subscription);

    // 5. Emitir evento
    this.eventBus.publish('subscription.created', subscription);

    // ✅ Cada responsabilidad está delegada a un módulo cohesivo
    // ✅ Cambios en pricing, payment, o storage no afectan esta lógica
  }
}

// ==========================================
// SECCIÓN 8: MEJORES PRÁCTICAS Y ERRORES COMUNES
// ==========================================

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * Para REDUCIR ACOPLAMIENTO:
 * 1. Depender de abstracciones (interfaces), no de implementaciones concretas
 * 2. Usar Dependency Injection en lugar de crear dependencias
 * 3. Comunicarse vía eventos para desacoplar componentes
 * 4. Definir interfaces en términos de lo que NECESITAS, no de lo que el proveedor OFRECE
 * 5. Evitar "Law of Demeter" violations (a.b.c.d.doSomething())
 *
 * Para AUMENTAR COHESIÓN:
 * 1. Una clase, una responsabilidad (SRP)
 * 2. Si una clase tiene métodos que no comparten datos, dividir la clase
 * 3. Agrupar código que cambia por las mismas razones
 * 4. Nombres de clase deben reflejar un propósito único y claro
 * 5. Si es difícil nombrar la clase, probablemente tiene baja cohesión
 */

/**
 * ⚠️ ERRORES COMUNES:
 *
 * 1. **God Objects**: Clases que hacen demasiado
 *    - Síntoma: Clase con >500 líneas, muchos métodos públicos
 *    - Solución: Dividir por responsabilidades
 *
 * 2. **Feature Envy**: Método que usa más datos de otra clase que de la propia
 *    - Síntoma: this.other.getX(), this.other.getY(), this.other.calculate()
 *    - Solución: Mover el método a la otra clase
 *
 * 3. **Inappropriate Intimacy**: Clases que conocen demasiado de los internals de otras
 *    - Síntoma: Acceso directo a campos privados, getters excesivos
 *    - Solución: Encapsular mejor, "Tell, Don't Ask"
 *
 * 4. **Shotgun Surgery**: Un cambio requiere modificar muchas clases
 *    - Síntoma: Alto acoplamiento
 *    - Solución: Consolidar lógica relacionada
 *
 * 5. **Lazy Class**: Clase que hace muy poco
 *    - Síntoma: Clase con 1-2 métodos triviales
 *    - Solución: Inline en clase que la usa, o agregar más responsabilidad cohesiva
 */

// ⚠️ Error: Feature Envy
class OrderProcessor {
  processOrder(order: Order) {
    // Este método "envidia" los datos de Order
    const subtotal = order.getItems().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * order.getTaxRate();
    const total = subtotal + tax;

    // ⚠️ Esta lógica debería estar EN Order, no aquí
  }
}

interface Order {
  getItems(): Array<{ price: number; quantity: number }>;
  getTaxRate(): number;
}

// ✅ Solución: Mover lógica a Order
class BetterOrder {
  constructor(
    private items: Array<{ price: number; quantity: number }>,
    private taxRate: number
  ) {}

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const tax = subtotal * this.taxRate;
    return subtotal + tax;
  }

  private calculateSubtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
}

class BetterOrderProcessor {
  processOrder(order: BetterOrder) {
    const total = order.calculateTotal();
    // ✅ Simple, sin feature envy
  }
}

// ==========================================
// SECCIÓN 9: TESTING Y ACOPLAMIENTO
// ==========================================

/**
 * El acoplamiento se hace evidente al escribir tests
 */

// ⚠️ Difícil de testear (alto acoplamiento)
class HardToTestService {
  processPayment() {
    const gateway = new StripeAPI(); // Creado internamente
    const db = new DatabaseConnection(); // Creado internamente

    // Para testear necesitas Stripe y DB reales
  }
}

// ✅ Fácil de testear (bajo acoplamiento)
class EasyToTestService {
  constructor(
    private gateway: IPaymentGateway,
    private db: IRepository
  ) {}

  processPayment() {
    // Para testear, inyectas mocks
  }
}

// Test con mocks
class MockPaymentGateway implements IPaymentGateway {
  async charge(amount: number, token: string): Promise<ChargeResult> {
    return { id: 'mock_charge', status: 'succeeded' };
  }
}

class MockRepository implements IRepository {
  async save<T>(entity: T): Promise<void> {
    // No hace nada, es un mock
  }
}

function testService() {
  const mockGateway = new MockPaymentGateway();
  const mockRepo = new MockRepository();
  const service = new EasyToTestService(mockGateway, mockRepo);

  // ✅ Test completamente aislado, sin dependencias externas
  service.processPayment();
}

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('ACOPLAMIENTO Y COHESIÓN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Sistema con ALTO acoplamiento y BAJA cohesión:');
console.log('   - Difícil de mantener');
console.log('   - Difícil de testear');
console.log('   - Imposible de reutilizar');

console.log('\n2. Sistema con BAJO acoplamiento y ALTA cohesión:');
console.log('   - Fácil de mantener (cambios localizados)');
console.log('   - Fácil de testear (mocks simples)');
console.log('   - Componentes reutilizables');

console.log('\n3. Métricas importantes:');
console.log('   - Efferent Coupling (Ce): Dependencias salientes');
console.log('   - Afferent Coupling (Ca): Dependencias entrantes');
console.log('   - LCOM: Lack of Cohesion of Methods');

console.log('\n4. Cómo lo usa Big Tech:');
console.log('   - Stripe: Microservicios desacoplados vía eventos');
console.log('   - Amazon: Two-pizza teams con servicios cohesivos');
console.log('   - PayPal: Interfaces bien definidas entre servicios');

console.log('\n✅ Objetivo: Bajo acoplamiento + Alta cohesión = Código mantenible');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Por qué el bajo acoplamiento facilita el testing?
 *    Pista: Piensa en mocks e inyección de dependencias
 *
 * 2. ¿Cómo identificarías que una clase tiene baja cohesión?
 *    Pista: Métodos que no comparten datos, dificultad para nombrar la clase
 *
 * 3. ¿Cuál es la relación entre SOLID y acoplamiento/cohesión?
 *    Pista: SRP promueve cohesión, DIP reduce acoplamiento
 *
 * 4. ¿Por qué los microservicios promueven bajo acoplamiento?
 *    Pista: Comunicación vía APIs/eventos, deployment independiente
 *
 * 5. ¿Cómo mediría el acoplamiento en un codebase existente?
 *    Pista: Métricas Ca/Ce, análisis de dependencias, herramientas de análisis estático
 *
 * 6. ¿Event-driven architecture siempre reduce acoplamiento? ¿Qué trade-offs tiene?
 *    Pista: Debugging más difícil, eventual consistency, complejidad operacional
 *
 * 7. ¿Cómo decidirías si dos funcionalidades deben estar en la misma clase o separadas?
 *    Pista: ¿Cambian por las mismas razones? ¿Comparten datos? ¿Tienen propósito común?
 *
 * 8. ¿Qué rol juegan las interfaces en reducir acoplamiento?
 *    Pista: Dependency Inversion, contratos, mockability
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Identificar acoplamiento
 *
 * Dado este código, identifica:
 * - Tipo de acoplamiento (content, common, stamp, data)
 * - Cómo reducirlo
 *
 * ```typescript
 * class InvoiceService {
 *   generateInvoice(customer: Customer) {
 *     const total = customer.orders
 *       .map(o => o.total)
 *       .reduce((a, b) => a + b, 0);
 *
 *     // Accede directamente a datos internos de customer
 *     customer.balance -= total;
 *     customer.lastInvoiceDate = new Date();
 *   }
 * }
 * ```
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Refactoring para cohesión
 *
 * Refactoriza esta clase para mejorar cohesión:
 *
 * ```typescript
 * class PaymentHelper {
 *   validateCard(cardNumber: string): boolean { }
 *   formatCurrency(amount: number, currency: string): string { }
 *   sendEmail(to: string, subject: string): void { }
 *   calculateTax(amount: number, country: string): number { }
 *   logError(error: Error): void { }
 * }
 * ```
 *
 * Pista: Agrupa por responsabilidad funcional
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Event-driven refactoring
 *
 * Refactoriza este sistema de alto acoplamiento a event-driven:
 *
 * ```typescript
 * class OrderService {
 *   placeOrder(order: Order) {
 *     this.paymentService.charge(order.total);
 *     this.inventoryService.reserve(order.items);
 *     this.emailService.sendConfirmation(order.customer);
 *     this.analyticsService.trackOrder(order);
 *   }
 * }
 * ```
 *
 * Objetivos:
 * - OrderService no debe conocer PaymentService, InventoryService, etc.
 * - Usar EventBus para desacoplar
 * - Cada servicio se suscribe a eventos relevantes
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Diseño de microservicios
 *
 * Diseña una arquitectura de microservicios para un sistema de billing con:
 * - Customer Service
 * - Subscription Service
 * - Payment Service
 * - Invoice Service
 * - Notification Service
 *
 * Requisitos:
 * 1. Define interfaces de comunicación entre servicios
 * 2. Minimiza acoplamiento (cada servicio debe ser independiente)
 * 3. Asegura alta cohesión (cada servicio tiene propósito claro)
 * 4. Decide: ¿comunicación síncrona (API) o asíncrona (eventos)?
 * 5. Maneja consistencia eventual
 *
 * Pista: Algunos servicios se comunicarán vía API REST,
 * otros vía eventos (pub-sub)
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Interfaces
  IPaymentGateway,
  IRepository,
  INotificationService,

  // Good examples
  GoodPaymentValidator,
  GoodPaymentProcessor,
  GoodBillingService,

  // Patterns
  EventBus,
  PaymentFacade,

  // Services
  PricingService,
  SubscriptionService
};
