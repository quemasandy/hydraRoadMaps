/**
 * ==========================================
 * POLIMORFISMO
 * (Polymorphism)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * Polimorfismo significa "muchas formas" (poly = muchas, morph = formas).
 * Es la capacidad de diferentes objetos de responder al MISMO mensaje
 * de maneras DIFERENTES.
 *
 * Permite escribir código que funciona con abstracciones (interfaces, clases base)
 * pero ejecuta comportamiento específico según el tipo concreto.
 *
 * 📚 TRES TIPOS DE POLIMORFISMO:
 *
 * 1. **Ad-hoc Polymorphism** (Sobrecarga)
 *    - Mismo nombre de función, diferentes firmas
 *    - Function overloading, operator overloading
 *    - Decidido en tiempo de compilación
 *
 * 2. **Parametric Polymorphism** (Genéricos)
 *    - Código que funciona con CUALQUIER tipo
 *    - Generics en TypeScript
 *    - Decidido en tiempo de compilación
 *
 * 3. **Subtype Polymorphism** (Herencia/Interfaces)
 *    - Objetos de diferentes clases responden al mismo mensaje
 *    - Inheritance, interfaces
 *    - Decidido en tiempo de ejecución (dynamic dispatch)
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - PaymentMethod es polimórfico: Card, BankAccount, Wallet
 * - Todos implementan `charge()`, pero cada uno lo hace diferente
 * - Stripe API procesa cualquier PaymentMethod sin switch statements
 * - Event system: Todos los eventos implementan interface Event
 *
 * **PayPal:**
 * - PaymentProcessor polimórfico para diferentes países
 * - US, EU, APAC tienen regulaciones diferentes
 * - Mismo código procesa todos usando interface común
 * - Tax calculators polimórficos por jurisdicción
 *
 * **Amazon:**
 * - ShippingStrategy polimórfico: Standard, Prime, SameDay
 * - Discount rules polimórficas: Percentage, Fixed, BOGO
 * - Cada estrategia implementa `calculate()` de forma diferente
 *
 * **Netflix:**
 * - VideoPlayer polimórfico para diferentes formatos
 * - Recommendation algorithm polimórfico por región/usuario
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - **Extensibilidad**: Agregar nuevos tipos sin cambiar código existente (Open/Closed)
 * - **Reutilización**: Mismo código funciona con múltiples tipos
 * - **Mantenibilidad**: Elimina switch/if statements complejos
 * - **Testabilidad**: Puedes usar mocks/stubs que implementan misma interface
 * - **Expresividad**: Código más claro y cercano al dominio
 */

// ==========================================
// SECCIÓN 1: SUBTYPE POLYMORPHISM (El más común en OOP)
// Diferentes clases responden al mismo mensaje
// ==========================================

/**
 * ✅ Ejemplo clásico: Diferentes payment methods
 *
 * Todos implementan el mismo método `process()`,
 * pero cada uno lo hace de manera diferente
 */

// Interface común
interface PaymentMethod {
  process(amount: number): Promise<PaymentResult>;
  validate(): boolean;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

// ✅ Implementación 1: Credit Card
class CreditCardPayment implements PaymentMethod {
  constructor(
    private cardNumber: string,
    private cvv: string,
    private expiry: string
  ) {}

  validate(): boolean {
    return (
      this.cardNumber.length === 16 &&
      this.cvv.length === 3 &&
      !!this.expiry
    );
  }

  async process(amount: number): Promise<PaymentResult> {
    console.log(`Processing ${amount} via Credit Card ending in ${this.cardNumber.slice(-4)}`);

    // Lógica específica de tarjeta de crédito
    // - Validar con banco emisor
    // - 3D Secure si es necesario
    // - Autorización y captura

    return {
      success: true,
      transactionId: `cc_${Date.now()}`,
      message: 'Credit card payment successful'
    };
  }
}

// ✅ Implementación 2: Bank Transfer
class BankTransferPayment implements PaymentMethod {
  constructor(
    private accountNumber: string,
    private routingNumber: string
  ) {}

  validate(): boolean {
    return (
      this.accountNumber.length > 0 &&
      this.routingNumber.length === 9
    );
  }

  async process(amount: number): Promise<PaymentResult> {
    console.log(`Processing ${amount} via Bank Transfer`);

    // Lógica específica de transferencia bancaria
    // - Validar cuenta existe
    // - Iniciar ACH transfer
    // - Puede tardar 3-5 días

    return {
      success: true,
      transactionId: `ach_${Date.now()}`,
      message: 'Bank transfer initiated (3-5 business days)'
    };
  }
}

// ✅ Implementación 3: Digital Wallet
class WalletPayment implements PaymentMethod {
  constructor(
    private walletId: string,
    private walletType: 'PayPal' | 'ApplePay' | 'GooglePay'
  ) {}

  validate(): boolean {
    return this.walletId.length > 0;
  }

  async process(amount: number): Promise<PaymentResult> {
    console.log(`Processing ${amount} via ${this.walletType}`);

    // Lógica específica de wallet
    // - Redirect a wallet provider
    // - OAuth flow
    // - Instant confirmation

    return {
      success: true,
      transactionId: `wallet_${Date.now()}`,
      message: `${this.walletType} payment successful`
    };
  }
}

// ✅ POLIMORFISMO EN ACCIÓN: Mismo código funciona con TODOS los tipos
class PaymentProcessor {
  async processPayment(
    paymentMethod: PaymentMethod, // Acepta CUALQUIER PaymentMethod
    amount: number
  ): Promise<PaymentResult> {
    // Validar
    if (!paymentMethod.validate()) {
      return {
        success: false,
        transactionId: '',
        message: 'Payment method validation failed'
      };
    }

    // Procesar - cada payment method ejecuta SU versión
    const result = await paymentMethod.process(amount);

    // Logging común
    console.log(`Transaction ${result.transactionId}: ${result.message}`);

    return result;
  }
}

// Demo: Mismo código, diferentes comportamientos
async function demoSubtypePolymorphism() {
  const processor = new PaymentProcessor();

  const paymentMethods: PaymentMethod[] = [
    new CreditCardPayment('4242424242424242', '123', '12/25'),
    new BankTransferPayment('123456789', '021000021'),
    new WalletPayment('wallet_123', 'PayPal')
  ];

  // ✅ Un solo loop procesa TODOS los tipos
  for (const method of paymentMethods) {
    await processor.processPayment(method, 5000);
  }

  // ✅ Sin polimorfismo necesitaríamos:
  // if (method instanceof CreditCardPayment) { ... }
  // else if (method instanceof BankTransferPayment) { ... }
  // else if (method instanceof WalletPayment) { ... }
  // ⚠️ Violación de Open/Closed Principle
}

// ==========================================
// SECCIÓN 2: AD-HOC POLYMORPHISM (Function Overloading)
// Mismo nombre, diferentes firmas
// ==========================================

/**
 * TypeScript soporta function overloading vía declaraciones múltiples
 */

// ✅ Overloads: diferentes formas de crear un Payment
class Payment {
  private amount: number;
  private currency: string;
  private description: string;

  // Overload signatures
  constructor(amount: number);
  constructor(amount: number, currency: string);
  constructor(amount: number, currency: string, description: string);

  // Implementation signature (debe acomodar todos los overloads)
  constructor(
    amount: number,
    currency: string = 'USD',
    description: string = ''
  ) {
    this.amount = amount;
    this.currency = currency;
    this.description = description;
  }

  getDetails(): string {
    return `${this.amount} ${this.currency} - ${this.description || 'No description'}`;
  }
}

// Uso: mismo constructor, diferentes firmas
function demoAdHocPolymorphism() {
  const payment1 = new Payment(100);
  const payment2 = new Payment(100, 'EUR');
  const payment3 = new Payment(100, 'GBP', 'Order #123');

  console.log(payment1.getDetails()); // 100 USD - No description
  console.log(payment2.getDetails()); // 100 EUR - No description
  console.log(payment3.getDetails()); // 100 GBP - Order #123
}

// ✅ Otro ejemplo: formatear montos de diferentes formas
class CurrencyFormatter {
  // Overload 1: solo amount (usa USD por defecto)
  format(amount: number): string;

  // Overload 2: amount + currency
  format(amount: number, currency: string): string;

  // Overload 3: amount + currency + locale
  format(amount: number, currency: string, locale: string): string;

  // Implementation
  format(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}

const formatter = new CurrencyFormatter();
console.log(formatter.format(1234.56)); // $1,234.56
console.log(formatter.format(1234.56, 'EUR')); // €1,234.56
console.log(formatter.format(1234.56, 'JPY', 'ja-JP')); // ¥1,235

// ==========================================
// SECCIÓN 3: PARAMETRIC POLYMORPHISM (Generics)
// Código que funciona con CUALQUIER tipo
// ==========================================

/**
 * ✅ Generics permiten escribir código reutilizable
 * que funciona con múltiples tipos sin perder type safety
 */

// Genérico: funciona con Payment, Refund, Subscription, etc.
class Repository<T> {
  private items: Map<string, T> = new Map();

  save(id: string, item: T): void {
    this.items.set(id, item);
  }

  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return Array.from(this.items.values());
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }
}

// Usar con diferentes tipos
interface PaymentEntity {
  id: string;
  amount: number;
}

interface RefundEntity {
  id: string;
  paymentId: string;
  amount: number;
}

function demoParametricPolymorphism() {
  // ✅ Mismo Repository<T> funciona con cualquier tipo
  const paymentRepo = new Repository<PaymentEntity>();
  const refundRepo = new Repository<RefundEntity>();

  paymentRepo.save('pay_1', { id: 'pay_1', amount: 1000 });
  refundRepo.save('ref_1', { id: 'ref_1', paymentId: 'pay_1', amount: 500 });

  const payment = paymentRepo.findById('pay_1'); // Type: PaymentEntity | undefined
  const refund = refundRepo.findById('ref_1'); // Type: RefundEntity | undefined

  // ✅ Type safety completa, código 100% reutilizable
}

// ✅ Otro ejemplo: Result type polimórfico
class Result<T, E = Error> {
  private constructor(
    private _value?: T,
    private _error?: E
  ) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(value, undefined);
  }

  static err<E>(error: E): Result<never, E> {
    return new Result<never, E>(undefined, error);
  }

  isOk(): boolean {
    return this._value !== undefined;
  }

  isErr(): boolean {
    return this._error !== undefined;
  }

  unwrap(): T {
    if (this._value === undefined) {
      throw new Error('Called unwrap on an Err value');
    }
    return this._value;
  }

  unwrapErr(): E {
    if (this._error === undefined) {
      throw new Error('Called unwrapErr on an Ok value');
    }
    return this._error;
  }
}

// Uso con diferentes tipos
function chargeCard(amount: number): Result<string, string> {
  if (amount <= 0) {
    return Result.err('Amount must be positive');
  }

  return Result.ok(`charge_${Date.now()}`);
}

function processCharge() {
  const result = chargeCard(100);

  if (result.isOk()) {
    console.log(`Charge successful: ${result.unwrap()}`);
  } else {
    console.log(`Charge failed: ${result.unwrapErr()}`);
  }
}

// ==========================================
// SECCIÓN 4: POLIMORFISMO CON ABSTRACT CLASSES
// Template Method Pattern
// ==========================================

/**
 * ✅ Abstract classes permiten definir algoritmo general
 * con pasos específicos implementados por subclases
 */

abstract class PaymentGateway {
  // ✅ Template method: mismo para todos
  public async charge(
    amount: number,
    paymentMethod: string
  ): Promise<boolean> {
    console.log(`Starting charge of ${amount}`);

    // 1. Validar (común)
    if (!this.validateAmount(amount)) {
      return false;
    }

    // 2. Pre-procesamiento (puede ser customizado)
    await this.preProcess(amount);

    // 3. Ejecutar cargo (polimórfico - cada gateway lo implementa)
    const success = await this.executeCharge(amount, paymentMethod);

    // 4. Post-procesamiento (puede ser customizado)
    await this.postProcess(success);

    return success;
  }

  // Método concreto: igual para todos
  protected validateAmount(amount: number): boolean {
    return amount > 0 && Number.isFinite(amount);
  }

  // Métodos con implementación default (pueden overridearse)
  protected async preProcess(amount: number): Promise<void> {
    console.log('Pre-processing payment');
  }

  protected async postProcess(success: boolean): Promise<void> {
    console.log(`Post-processing: ${success ? 'success' : 'failure'}`);
  }

  // ✅ Método abstracto: cada gateway DEBE implementar
  protected abstract executeCharge(
    amount: number,
    paymentMethod: string
  ): Promise<boolean>;
}

// ✅ Implementación 1: Stripe
class StripeGateway extends PaymentGateway {
  protected async executeCharge(
    amount: number,
    paymentMethod: string
  ): Promise<boolean> {
    console.log('Executing charge via Stripe');
    // Lógica específica de Stripe
    return true;
  }

  // Override preProcess para agregar fraud detection
  protected async preProcess(amount: number): Promise<void> {
    await super.preProcess(amount);
    console.log('Stripe: Running fraud detection');
  }
}

// ✅ Implementación 2: PayPal
class PayPalGateway extends PaymentGateway {
  protected async executeCharge(
    amount: number,
    paymentMethod: string
  ): Promise<boolean> {
    console.log('Executing charge via PayPal');
    // Lógica específica de PayPal
    return true;
  }
}

// ✅ Uso polimórfico
async function useGateways() {
  const gateways: PaymentGateway[] = [
    new StripeGateway(),
    new PayPalGateway()
  ];

  for (const gateway of gateways) {
    // ✅ Mismo método, diferentes implementaciones
    await gateway.charge(5000, 'pm_123');
  }
}

// ==========================================
// SECCIÓN 5: POLIMORFISMO EN ESTRATEGIAS DE DESCUENTO
// Strategy Pattern
// ==========================================

/**
 * 💰 CASO REAL: Diferentes estrategias de descuento
 * Todas implementan `calculate()`, cada una de forma diferente
 */

interface DiscountStrategy {
  calculate(subtotal: number): number;
  getDescription(): string;
}

// ✅ Estrategia 1: Descuento porcentual
class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {}

  calculate(subtotal: number): number {
    return subtotal * (this.percentage / 100);
  }

  getDescription(): string {
    return `${this.percentage}% off`;
  }
}

// ✅ Estrategia 2: Descuento fijo
class FixedDiscount implements DiscountStrategy {
  constructor(private amount: number) {}

  calculate(subtotal: number): number {
    return Math.min(this.amount, subtotal);
  }

  getDescription(): string {
    return `$${this.amount} off`;
  }
}

// ✅ Estrategia 3: Buy One Get One
class BOGODiscount implements DiscountStrategy {
  calculate(subtotal: number): number {
    // 50% del total (asumiendo items iguales)
    return subtotal * 0.5;
  }

  getDescription(): string {
    return 'Buy One Get One Free';
  }
}

// ✅ Estrategia 4: Descuento por volumen
class VolumeDiscount implements DiscountStrategy {
  constructor(
    private threshold: number,
    private discountPercent: number
  ) {}

  calculate(subtotal: number): number {
    if (subtotal >= this.threshold) {
      return subtotal * (this.discountPercent / 100);
    }
    return 0;
  }

  getDescription(): string {
    return `${this.discountPercent}% off orders over $${this.threshold}`;
  }
}

// ✅ Clase que usa estrategia polimórficamente
class ShoppingCart {
  private items: Array<{ price: number; quantity: number }> = [];
  private discountStrategy: DiscountStrategy | null = null;

  addItem(price: number, quantity: number): void {
    this.items.push({ price, quantity });
  }

  setDiscountStrategy(strategy: DiscountStrategy): void {
    this.discountStrategy = strategy;
  }

  calculateSubtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  calculateDiscount(): number {
    if (!this.discountStrategy) return 0;

    // ✅ Polimorfismo: cada estrategia calcula diferente
    return this.discountStrategy.calculate(this.calculateSubtotal());
  }

  calculateTotal(): number {
    return this.calculateSubtotal() - this.calculateDiscount();
  }

  getReceipt(): string {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount();
    const total = this.calculateTotal();

    let receipt = `Subtotal: $${subtotal.toFixed(2)}\n`;

    if (this.discountStrategy) {
      receipt += `Discount (${this.discountStrategy.getDescription()}): -$${discount.toFixed(2)}\n`;
    }

    receipt += `Total: $${total.toFixed(2)}`;

    return receipt;
  }
}

// Demo: mismo cart, diferentes estrategias
function demoDiscountPolymorphism() {
  const cart = new ShoppingCart();
  cart.addItem(50, 2); // 2 items @ $50 = $100

  console.log('\n--- No discount ---');
  console.log(cart.getReceipt());

  console.log('\n--- 20% discount ---');
  cart.setDiscountStrategy(new PercentageDiscount(20));
  console.log(cart.getReceipt());

  console.log('\n--- $15 fixed discount ---');
  cart.setDiscountStrategy(new FixedDiscount(15));
  console.log(cart.getReceipt());

  console.log('\n--- BOGO ---');
  cart.setDiscountStrategy(new BOGODiscount());
  console.log(cart.getReceipt());

  console.log('\n--- Volume discount (10% over $80) ---');
  cart.setDiscountStrategy(new VolumeDiscount(80, 10));
  console.log(cart.getReceipt());

  // ✅ Agregar nueva estrategia no requiere cambiar ShoppingCart
  // ✅ Open/Closed Principle en acción
}

// ==========================================
// SECCIÓN 6: POLIMORFISMO EN EVENT HANDLERS
// Diferentes eventos, mismo handler interface
// ==========================================

/**
 * ✅ Event system polimórfico - inspirado en Stripe Webhooks
 */

interface StripeEvent {
  type: string;
  data: any;
}

interface EventHandler {
  handle(event: StripeEvent): void;
  canHandle(eventType: string): boolean;
}

// ✅ Handler 1: Payment succeeded
class PaymentSucceededHandler implements EventHandler {
  canHandle(eventType: string): boolean {
    return eventType === 'payment_intent.succeeded';
  }

  handle(event: StripeEvent): void {
    console.log('Handling payment succeeded event');
    // - Marcar orden como pagada
    // - Enviar confirmación al cliente
    // - Actualizar inventario
  }
}

// ✅ Handler 2: Payment failed
class PaymentFailedHandler implements EventHandler {
  canHandle(eventType: string): boolean {
    return eventType === 'payment_intent.payment_failed';
  }

  handle(event: StripeEvent): void {
    console.log('Handling payment failed event');
    // - Notificar al cliente
    // - Intentar método de pago alternativo
    // - Log para análisis
  }
}

// ✅ Handler 3: Subscription created
class SubscriptionCreatedHandler implements EventHandler {
  canHandle(eventType: string): boolean {
    return eventType === 'customer.subscription.created';
  }

  handle(event: StripeEvent): void {
    console.log('Handling subscription created event');
    // - Activar acceso del usuario
    // - Enviar email de bienvenida
    // - Actualizar analytics
  }
}

// ✅ Event dispatcher polimórfico
class EventDispatcher {
  private handlers: EventHandler[] = [];

  registerHandler(handler: EventHandler): void {
    this.handlers.push(handler);
  }

  dispatch(event: StripeEvent): void {
    console.log(`Dispatching event: ${event.type}`);

    // ✅ Polimorfismo: encuentra y ejecuta handler apropiado
    for (const handler of this.handlers) {
      if (handler.canHandle(event.type)) {
        handler.handle(event);
        break;
      }
    }
  }
}

// Demo: registrar handlers y despachar eventos
function demoEventPolymorphism() {
  const dispatcher = new EventDispatcher();

  // Registrar todos los handlers
  dispatcher.registerHandler(new PaymentSucceededHandler());
  dispatcher.registerHandler(new PaymentFailedHandler());
  dispatcher.registerHandler(new SubscriptionCreatedHandler());

  // Despachar diferentes eventos
  const events: StripeEvent[] = [
    { type: 'payment_intent.succeeded', data: {} },
    { type: 'payment_intent.payment_failed', data: {} },
    { type: 'customer.subscription.created', data: {} }
  ];

  events.forEach(event => dispatcher.dispatch(event));

  // ✅ Agregar nuevo tipo de evento solo requiere:
  // 1. Crear nuevo handler que implemente EventHandler
  // 2. Registrarlo con dispatcher
  // ✅ NO requiere modificar EventDispatcher (Open/Closed)
}

// ==========================================
// SECCIÓN 7: POLIMORFISMO Y LISKOV SUBSTITUTION
// ==========================================

/**
 * ⚠️ VIOLACIÓN: Polimorfismo que rompe LSP
 */

class Bird {
  fly(): void {
    console.log('Flying');
  }
}

class Penguin extends Bird {
  // ⚠️ Penguins can't fly, pero heredan de Bird
  fly(): void {
    throw new Error('Penguins cannot fly');
  }
}

function makeBirdFly(bird: Bird) {
  bird.fly(); // ⚠️ Falla si es Penguin
}

// ✅ SOLUCIÓN: Diseño polimórfico correcto
interface Animal {
  move(): void;
}

class FlyingBird implements Animal {
  move(): void {
    console.log('Flying through the air');
  }
}

class SwimmingBird implements Animal {
  move(): void {
    console.log('Swimming in water');
  }
}

function makeAnimalMove(animal: Animal) {
  animal.move(); // ✅ Funciona con todos los tipos
}

// ==========================================
// SECCIÓN 8: MEJORES PRÁCTICAS
// ==========================================

/**
 * ✅ MEJORES PRÁCTICAS DE POLIMORFISMO:
 *
 * 1. **Prefiere composición + interfaces sobre herencia profunda**
 *    - Herencia crea acoplamiento fuerte
 *    - Interfaces permiten polimorfismo sin acoplamiento
 *
 * 2. **Program to interfaces, not implementations**
 *    - Declara variables como interfaces, no clases concretas
 *    - Permite cambiar implementación fácilmente
 *
 * 3. **Usa polimorfismo para eliminar switch/if statements**
 *    - Si tienes switch(type), considera polimorfismo
 *    - Cada case se convierte en una clase
 *
 * 4. **Respeta Liskov Substitution Principle**
 *    - Subtipos deben ser sustituibles por tipo base
 *    - No lances excepciones en overrides donde base no lo hace
 *
 * 5. **Strategy pattern para algoritmos intercambiables**
 *    - Encapsula cada algoritmo en su propia clase
 *    - Cliente puede cambiar estrategia en runtime
 *
 * 6. **Template Method para algoritmos con variaciones**
 *    - Esqueleto en clase base
 *    - Pasos específicos en subclases
 *
 * 7. **Generics para code reuse con type safety**
 *    - Evita any, usa genéricos
 *    - Repository<T>, Result<T, E>, etc.
 *
 * 8. **Factory pattern para crear objetos polimórficos**
 *    - Factory decide qué implementación concreta crear
 *    - Cliente recibe interface, no sabe implementación
 */

/**
 * ⚠️ ERRORES COMUNES:
 *
 * 1. **Herencia excesiva**
 *    - Jerarquías profundas (5+ niveles)
 *    - Solución: Composición + interfaces
 *
 * 2. **Violar LSP**
 *    - Subclases que no pueden sustituir clase base
 *    - Square extends Rectangle
 *
 * 3. **Instanceof checks en lugar de polimorfismo**
 *    - if (obj instanceof ClassA) { ... }
 *    - Solución: Agregar método polimórfico a interface
 *
 * 4. **Switch statements sobre tipos**
 *    - switch(payment.type) { case 'card': ... }
 *    - Solución: Polimorfismo con PaymentMethod interface
 *
 * 5. **Overloading mal usado**
 *    - Muchos overloads confusos
 *    - Solución: Options object pattern
 *
 * 6. **Generics demasiado complejos**
 *    - Type<A, B<C, D<E>>>
 *    - Solución: Simplificar, usar type aliases
 */

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('POLIMORFISMO - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Subtype Polymorphism (Payment Methods):');
demoSubtypePolymorphism();

console.log('\n2. Ad-hoc Polymorphism (Function Overloading):');
demoAdHocPolymorphism();

console.log('\n3. Parametric Polymorphism (Generics):');
demoParametricPolymorphism();

console.log('\n4. Abstract Classes (Payment Gateways):');
useGateways();

console.log('\n5. Strategy Pattern (Discounts):');
demoDiscountPolymorphism();

console.log('\n6. Event Handlers:');
demoEventPolymorphism();

console.log('\n✅ Beneficios del polimorfismo:');
console.log('   - Extensibilidad sin modificar código existente');
console.log('   - Elimina switch/if statements complejos');
console.log('   - Código más limpio y mantenible');
console.log('   - Facilita testing con mocks');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre los tres tipos de polimorfismo?
 *    Pista: Ad-hoc (overloading), Parametric (generics), Subtype (herencia/interfaces)
 *
 * 2. ¿Cómo Stripe usa polimorfismo en su sistema de payment methods?
 *    Pista: Todos implementan charge(), pero cada uno diferente
 *
 * 3. ¿Por qué polimorfismo elimina la necesidad de switch statements?
 *    Pista: Cada case se convierte en una clase que implementa interface
 *
 * 4. ¿Cómo se relaciona polimorfismo con Open/Closed Principle?
 *    Pista: Puedes agregar nuevos tipos sin modificar código existente
 *
 * 5. ¿Cuándo usarías abstract class vs interface para polimorfismo?
 *    Pista: Abstract class cuando hay código compartido
 *
 * 6. ¿Qué es "dynamic dispatch" y cómo se relaciona con polimorfismo?
 *    Pista: Decisión de qué método ejecutar se hace en runtime
 *
 * 7. ¿Cómo los generics preservan type safety mientras son polimórficos?
 *    Pista: Type parameter T se resuelve en compile time
 *
 * 8. ¿Qué problemas causa violar Liskov Substitution con polimorfismo?
 *    Pista: Subtipo no es realmente sustituible, rompe expectativas
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Refactorizar switch con polimorfismo
 *
 * Dado este código:
 *
 * ```typescript
 * function calculateShipping(type: string, weight: number): number {
 *   switch(type) {
 *     case 'standard':
 *       return weight * 0.5;
 *     case 'express':
 *       return weight * 1.5;
 *     case 'overnight':
 *       return weight * 3.0;
 *     default:
 *       return 0;
 *   }
 * }
 * ```
 *
 * Refactoriza usando polimorfismo:
 * - Crea interface ShippingMethod
 * - Implementa StandardShipping, ExpressShipping, OvernightShipping
 * - Elimina el switch statement
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Tax Calculator polimórfico
 *
 * Implementa un sistema de tax calculation con:
 * - Interface TaxCalculator
 * - Implementaciones: USTaxCalculator, EUTaxCalculator, NoTaxCalculator
 * - US: sales tax varía por estado
 * - EU: VAT (20% en UK, 19% en DE, 21% en ES)
 * - NoTax: para regiones sin impuestos
 *
 * Cliente debe poder calcular tax sin saber qué jurisdicción:
 * ```typescript
 * const calculator: TaxCalculator = getTaxCalculator(country);
 * const tax = calculator.calculate(amount);
 * ```
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Notification System polimórfico
 *
 * Diseña sistema de notificaciones con:
 * - Interface NotificationChannel
 * - Implementaciones: EmailChannel, SMSChannel, PushChannel, SlackChannel
 * - Cada canal tiene diferentes:
 *   - Rate limits (email: ilimitado, SMS: 100/día, Push: 1000/día)
 *   - Costs (email: gratis, SMS: $0.01, Push: gratis)
 *   - Delivery guarantees
 *
 * NotificationService debe:
 * - Enviar por múltiples canales polimórficamente
 * - Respetar rate limits de cada canal
 * - Elegir canal óptimo basado en urgencia y costo
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Pricing Engine con Strategy + Template Method
 *
 * Implementa pricing engine para SaaS billing:
 *
 * Requisitos:
 * 1. **Pricing Models** (polimórficos):
 *    - FlatRate: $10/mes
 *    - PerSeat: $5/usuario/mes
 *    - Usage-based: $0.01/API call
 *    - Tiered: 0-1000 gratis, 1001-10000 = $0.05, 10000+ = $0.03
 *
 * 2. **Add-ons** (composable):
 *    - Support: +$50/mes
 *    - Analytics: +$100/mes
 *    - WhiteLabel: +$500/mes
 *
 * 3. **Discounts** (polimórficos):
 *    - Percentage, Fixed, VolumeDiscount
 *    - Multiple discounts stack
 *
 * 4. **Template Method para billing cycle**:
 *    - calculateBasePrice() - polimórfico
 *    - applyAddOns() - común
 *    - applyDiscounts() - común
 *    - calculateTax() - polimórfico por región
 *    - generateInvoice() - común
 *
 * Inspiración: Stripe Billing, Chargebee
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Interfaces
  PaymentMethod,
  DiscountStrategy,
  EventHandler,

  // Implementations
  CreditCardPayment,
  BankTransferPayment,
  WalletPayment,
  PaymentProcessor,

  // Strategies
  PercentageDiscount,
  FixedDiscount,
  BOGODiscount,
  VolumeDiscount,

  // Abstract classes
  PaymentGateway,
  StripeGateway,
  PayPalGateway,

  // Utilities
  Repository,
  Result,
  ShoppingCart,
  EventDispatcher
};
