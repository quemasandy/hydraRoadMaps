/**
 * ==========================================
 * ENCAPSULACIÓN
 * (Encapsulation)
 * ==========================================
 *
 * 🔑 CONCEPTO FUNDAMENTAL:
 *
 * La encapsulación es el principio de OCULTAR los detalles internos de implementación
 * y EXPONER solo lo necesario a través de una interfaz pública bien definida.
 *
 * Dos aspectos clave:
 * 1. **Information Hiding**: Ocultar datos internos (private/protected)
 * 2. **Interface Design**: Exponer operaciones significativas (public API)
 *
 * 📚 CONCEPTOS CLAVE:
 * - Modificadores de acceso: public, private, protected
 * - Getters/Setters con validación
 * - "Tell, Don't Ask" principle
 * - Inmutabilidad y readonly
 * - Interfaz pública vs detalles de implementación
 *
 * 🏢 USO EN BIG TECH:
 *
 * **Stripe:**
 * - Stripe Payment Intent oculta complejidad de 3D Secure, retries, etc.
 * - API pública simple: `stripe.paymentIntents.create()`
 * - Implementación interna privada: fraud detection, routing, retry logic
 * - Los clientes NO pueden modificar directamente el estado interno
 * - Solo interactúan vía métodos controlados: confirm(), capture(), cancel()
 *
 * **PayPal:**
 * - PayPal Order encapsula el flujo completo de checkout
 * - Oculta detalles de payment method, currency conversion, risk assessment
 * - API pública: create(), authorize(), capture()
 * - Cambios internos no afectan a clientes (siempre que API pública no cambie)
 *
 * **Amazon:**
 * - Amazon Cart encapsula lógica de pricing, promociones, inventario
 * - addItem(), removeItem(), checkout() - operaciones de alto nivel
 * - Los detalles de cómo se calculan descuentos están ocultos
 * - Validaciones internas aseguran invariantes (ej: cantidad > 0)
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - **Mantenibilidad**: Puedes cambiar implementación sin romper clientes
 * - **Seguridad**: Previene modificación no autorizada del estado
 * - **Validación**: Asegura que el objeto siempre está en estado válido
 * - **Flexibilidad**: Clientes dependen de interface, no de implementación
 * - **Reducción de complejidad**: Los clientes solo ven lo que necesitan
 */

// ==========================================
// SECCIÓN 1: VIOLACIÓN DE ENCAPSULACIÓN
// Ejemplo de clase MAL diseñada
// ==========================================

/**
 * ⚠️ PROBLEMA: Todo es público, sin encapsulación
 *
 * Consecuencias:
 * 1. Cualquiera puede modificar datos directamente
 * 2. No hay validación
 * 3. Estado inconsistente posible
 * 4. No se pueden cambiar internals sin romper clientes
 */

class BadPayment {
  // ⚠️ MALO: Todo público, sin protección
  public id: string;
  public amountInCents: number;
  public currency: string;
  public status: string; // 'pending' | 'succeeded' | 'failed'
  public createdAt: number;
  public metadata: Record<string, any>;

  constructor(amount: number, currency: string) {
    this.id = `pay_${Date.now()}`;
    this.amountInCents = amount;
    this.currency = currency;
    this.status = 'pending';
    this.createdAt = Date.now();
    this.metadata = {};
  }
}

// Cliente puede hacer CUALQUIER cosa (¡peligroso!)
function badUsage() {
  const payment = new BadPayment(5000, 'USD');

  // ⚠️ Modificación directa sin validación
  payment.amountInCents = -100; // ❌ Cantidad negativa!
  payment.currency = 'INVALID'; // ❌ Moneda inválida!
  payment.status = 'random'; // ❌ Estado no válido!

  // ⚠️ Cambio de estado inconsistente
  payment.status = 'succeeded';
  // Pero... ¿se procesó realmente? ¿Se notificó? ¿Se guardó en DB?
  // No hay garantías, solo cambio directo de campo

  // ⚠️ Si PaymentClass cambia su estructura interna, este código se rompe
  // Ejemplo: Si renombramos `amountInCents` a `amount`, todos los clientes fallan
}

// ==========================================
// SECCIÓN 2: ENCAPSULACIÓN CORRECTA
// Ejemplo de clase BIEN diseñada
// ==========================================

/**
 * ✅ SOLUCIÓN: Encapsular datos y operaciones
 *
 * Beneficios:
 * 1. Datos privados: solo accesibles vía interface controlada
 * 2. Validación en setters/métodos
 * 3. Estado siempre consistente
 * 4. Implementación interna puede cambiar sin afectar clientes
 */

type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed';

class GoodPayment {
  // ✅ Campos PRIVADOS - no accesibles desde fuera
  private readonly _id: string;
  private _amountInCents: number;
  private readonly _currency: string;
  private _status: PaymentStatus;
  private readonly _createdAt: number;
  private _metadata: Record<string, any>;

  constructor(amountInCents: number, currency: string) {
    // Validación en constructor
    if (amountInCents <= 0) {
      throw new Error('Amount must be positive');
    }

    if (!this.isValidCurrency(currency)) {
      throw new Error(`Invalid currency: ${currency}`);
    }

    this._id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this._amountInCents = amountInCents;
    this._currency = currency;
    this._status = 'pending';
    this._createdAt = Date.now();
    this._metadata = {};
  }

  // ✅ Getters públicos: solo lectura controlada
  get id(): string {
    return this._id;
  }

  get amountInCents(): number {
    return this._amountInCents;
  }

  get currency(): string {
    return this._currency;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get createdAt(): number {
    return this._createdAt;
  }

  // ✅ Getter que calcula valor derivado
  get amountInDollars(): number {
    return this._amountInCents / 100;
  }

  // ✅ Métodos públicos: operaciones de alto nivel
  public confirm(): void {
    if (this._status !== 'pending') {
      throw new Error(`Cannot confirm payment in status: ${this._status}`);
    }

    this._status = 'processing';
    // Aquí iría lógica de procesamiento real
    // (llamada a gateway, etc.)
  }

  public markAsSucceeded(): void {
    if (this._status !== 'processing') {
      throw new Error(
        `Cannot mark as succeeded from status: ${this._status}`
      );
    }

    this._status = 'succeeded';
    // Aquí podrían ir side-effects: logging, eventos, etc.
  }

  public markAsFailed(): void {
    if (this._status !== 'processing') {
      throw new Error(`Cannot mark as failed from status: ${this._status}`);
    }

    this._status = 'failed';
  }

  public addMetadata(key: string, value: any): void {
    // Validación antes de agregar
    if (!key || key.trim() === '') {
      throw new Error('Metadata key cannot be empty');
    }

    this._metadata[key] = value;
  }

  public getMetadata(key: string): any {
    return this._metadata[key];
  }

  // ✅ Método privado: lógica interna
  private isValidCurrency(currency: string): boolean {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY'];
    return validCurrencies.includes(currency);
  }

  // ✅ Método público: representación externa
  public toJSON(): object {
    return {
      id: this._id,
      amount: this._amountInCents,
      currency: this._currency,
      status: this._status,
      created: this._createdAt
      // Nota: NO exponemos _metadata directamente
      // Solo vía getMetadata()
    };
  }
}

// Cliente usa interface controlada
function goodUsage() {
  const payment = new GoodPayment(5000, 'USD');

  // ✅ Solo lectura de datos
  console.log(payment.id);
  console.log(payment.amountInDollars); // 50.00

  // ❌ No se puede modificar directamente
  // payment.status = 'succeeded'; // ERROR: readonly property

  // ✅ Se usa método controlado
  payment.confirm();
  payment.markAsSucceeded();

  // ✅ Validación automática
  try {
    payment.confirm(); // Error: ya no está en 'pending'
  } catch (error) {
    console.log('Expected error:', (error as Error).message);
  }
}

// ==========================================
// SECCIÓN 3: "TELL, DON'T ASK" PRINCIPLE
// ==========================================

/**
 * Principio: En lugar de PREGUNTAR por datos y actuar externamente,
 * DECIR al objeto que haga la operación
 *
 * "Tell, Don't Ask" promueve mejor encapsulación
 */

// ⚠️ MALO: "Ask" - preguntar y actuar externamente
class BankAccount {
  constructor(public balance: number) {}
}

function badWithdraw(account: BankAccount, amount: number) {
  // ⚠️ Preguntamos por el estado
  if (account.balance >= amount) {
    // ⚠️ Actuamos externamente
    account.balance -= amount;
    console.log('Withdrawal successful');
  } else {
    console.log('Insufficient funds');
  }

  // Problema: La lógica de withdrawal está FUERA de BankAccount
  // Si hay múltiples lugares que hacen withdraw, la lógica se duplica
}

// ✅ BUENO: "Tell" - decir al objeto que actúe
class GoodBankAccount {
  private _balance: number;

  constructor(balance: number) {
    this._balance = balance;
  }

  get balance(): number {
    return this._balance;
  }

  // ✅ El objeto encapsula su propia lógica
  public withdraw(amount: number): boolean {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (this._balance < amount) {
      return false; // Insufficient funds
    }

    this._balance -= amount;
    // Aquí podríamos agregar: logging, eventos, etc.
    return true;
  }

  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    this._balance += amount;
  }
}

function goodWithdraw(account: GoodBankAccount, amount: number) {
  // ✅ Le DECIMOS al objeto que actúe
  const success = account.withdraw(amount);

  if (success) {
    console.log('Withdrawal successful');
  } else {
    console.log('Insufficient funds');
  }

  // Beneficio: La lógica está encapsulada en BankAccount
  // Cambios en validación/lógica están centralizados
}

// ==========================================
// SECCIÓN 4: GETTERS/SETTERS VS ACCESO DIRECTO
// ==========================================

/**
 * Getters/Setters permiten:
 * 1. Validación al asignar
 * 2. Computed properties
 * 3. Side-effects (logging, eventos)
 * 4. Cambiar implementación sin cambiar interface
 */

// ⚠️ MALO: Acceso directo sin validación
class BadInvoice {
  public total: number = 0;
  public tax: number = 0;
}

const badInvoice = new BadInvoice();
badInvoice.total = -100; // ❌ No hay validación
badInvoice.tax = 999; // ❌ Tax puede ser cualquier cosa

// ✅ BUENO: Getters/Setters con validación
class GoodInvoice {
  private _subtotal: number = 0;
  private _taxRate: number = 0.08; // 8%

  set subtotal(value: number) {
    if (value < 0) {
      throw new Error('Subtotal cannot be negative');
    }
    this._subtotal = value;
  }

  get subtotal(): number {
    return this._subtotal;
  }

  set taxRate(value: number) {
    if (value < 0 || value > 1) {
      throw new Error('Tax rate must be between 0 and 1');
    }
    this._taxRate = value;
  }

  get taxRate(): number {
    return this._taxRate;
  }

  // ✅ Computed property: calculado dinámicamente
  get tax(): number {
    return this._subtotal * this._taxRate;
  }

  // ✅ Computed property: total siempre correcto
  get total(): number {
    return this._subtotal + this.tax;
  }
}

const goodInvoice = new GoodInvoice();
goodInvoice.subtotal = 100; // ✅ Validado
console.log(goodInvoice.tax); // 8 (calculado)
console.log(goodInvoice.total); // 108 (calculado)

// ✅ Si cambiamos taxRate, total se recalcula automáticamente
goodInvoice.taxRate = 0.10;
console.log(goodInvoice.total); // 110

// ==========================================
// SECCIÓN 5: INMUTABILIDAD Y READONLY
// ==========================================

/**
 * readonly: campos que no deben cambiar después de inicialización
 * Previene modificación accidental
 */

class PaymentIntent {
  // ✅ readonly: no se puede cambiar después de constructor
  public readonly id: string;
  public readonly customerId: string;
  public readonly createdAt: number;

  // Puede cambiar
  private _status: PaymentStatus;

  constructor(customerId: string) {
    this.id = `pi_${Date.now()}`;
    this.customerId = customerId;
    this.createdAt = Date.now();
    this._status = 'pending';
  }

  get status(): PaymentStatus {
    return this._status;
  }

  confirm() {
    this._status = 'processing';
  }
}

const intent = new PaymentIntent('cus_123');
console.log(intent.id); // OK: leer
// intent.id = 'new_id'; // ❌ ERROR: Cannot assign to 'id' because it is readonly

// ==========================================
// SECCIÓN 6: ENCAPSULACIÓN DE COLECCIONES
// ==========================================

/**
 * Problema: Si expones array/object directamente,
 * los clientes pueden modificarlo sin control
 */

// ⚠️ MALO: Exposición directa de array
class BadShoppingCart {
  public items: Array<{ id: string; quantity: number }> = [];
}

const badCart = new BadShoppingCart();
// ⚠️ Cliente puede modificar directamente
badCart.items.push({ id: 'invalid', quantity: -5 }); // Sin validación!

// ✅ BUENO: Encapsular colección
class GoodShoppingCart {
  private _items: Array<{ id: string; quantity: number }> = [];

  // ✅ Retornar copia read-only
  get items(): ReadonlyArray<{ id: string; quantity: number }> {
    // Opción 1: Retornar copia
    return [...this._items];

    // Opción 2: Retornar read-only type
    // return this._items as ReadonlyArray<...>;
  }

  // ✅ Métodos controlados para modificar
  public addItem(id: string, quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const existingItem = this._items.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this._items.push({ id, quantity });
    }
  }

  public removeItem(id: string): void {
    const index = this._items.findIndex(item => item.id === id);

    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  public updateQuantity(id: string, quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const item = this._items.find(item => item.id === id);

    if (item) {
      item.quantity = quantity;
    }
  }

  public clear(): void {
    this._items = [];
  }

  get itemCount(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

const goodCart = new GoodShoppingCart();
goodCart.addItem('prod_1', 2); // ✅ Validado
console.log(goodCart.itemCount); // 2

// ==========================================
// SECCIÓN 7: CASO REAL - STRIPE PAYMENT INTENT
// Encapsulación en sistema de pagos
// ==========================================

/**
 * 💰 CONTEXTO REAL:
 * Stripe PaymentIntent encapsula todo el flujo de pago
 * Inspirado en el diseño real de Stripe
 */

type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'canceled';

interface PaymentMethodDetails {
  type: 'card' | 'bank_account';
  last4: string;
}

class StripePaymentIntent {
  // ✅ Datos privados: ocultan complejidad interna
  private readonly _id: string;
  private readonly _amount: number;
  private readonly _currency: string;
  private _status: PaymentIntentStatus;
  private _paymentMethod: PaymentMethodDetails | null = null;
  private _clientSecret: string;
  private readonly _metadata: Record<string, string> = {};

  // Detalles internos de implementación (nunca expuestos)
  private _retryCount: number = 0;
  private _lastRetryAt: number | null = null;
  private _fraudScore: number = 0;

  constructor(amount: number, currency: string) {
    if (amount < 50) {
      throw new Error('Amount must be at least 50 cents');
    }

    this._id = `pi_${Date.now()}_${Math.random().toString(36)}`;
    this._amount = amount;
    this._currency = currency;
    this._status = 'requires_payment_method';
    this._clientSecret = `${this._id}_secret_${Math.random().toString(36)}`;

    // Calcular fraud score (lógica privada)
    this._fraudScore = this.calculateFraudScore();
  }

  // ✅ Interface pública: solo lo necesario
  get id(): string {
    return this._id;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  get status(): PaymentIntentStatus {
    return this._status;
  }

  get clientSecret(): string {
    return this._clientSecret;
  }

  // ✅ Operación pública: attach payment method
  public attachPaymentMethod(
    paymentMethod: PaymentMethodDetails
  ): void {
    if (this._status !== 'requires_payment_method') {
      throw new Error(
        `Cannot attach payment method in status: ${this._status}`
      );
    }

    this._paymentMethod = paymentMethod;
    this._status = 'requires_confirmation';
  }

  // ✅ Operación pública: confirmar pago
  public confirm(): void {
    if (this._status !== 'requires_confirmation') {
      throw new Error(`Cannot confirm in status: ${this._status}`);
    }

    // Validación interna de fraud
    if (this._fraudScore > 80) {
      this._status = 'requires_action'; // Requiere 3D Secure
      return;
    }

    this._status = 'processing';
    this.processPayment();
  }

  // ✅ Operación pública: cancelar
  public cancel(): void {
    if (this._status === 'succeeded') {
      throw new Error('Cannot cancel succeeded payment');
    }

    this._status = 'canceled';
  }

  // ✅ Metadata público (pero controlado)
  public addMetadata(key: string, value: string): void {
    if (Object.keys(this._metadata).length >= 50) {
      throw new Error('Maximum 50 metadata keys allowed');
    }

    this._metadata[key] = value;
  }

  // ❌ Métodos privados: lógica interna
  private calculateFraudScore(): number {
    // Lógica compleja interna de fraud detection
    // Los clientes NO necesitan saber cómo se calcula
    return Math.random() * 100;
  }

  private processPayment(): void {
    // Simular procesamiento asíncrono
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success
        this._status = 'succeeded';
      } else {
        // Retry logic (privado)
        this.retryPayment();
      }
    }, 1000);
  }

  private retryPayment(): void {
    this._retryCount++;
    this._lastRetryAt = Date.now();

    if (this._retryCount < 3) {
      // Retry automático (oculto del cliente)
      this.processPayment();
    } else {
      // Max retries alcanzado
      this._status = 'canceled';
    }
  }

  // ✅ Representación pública para API
  public toJSON(): object {
    return {
      id: this._id,
      amount: this._amount,
      currency: this._currency,
      status: this._status,
      payment_method: this._paymentMethod,
      metadata: { ...this._metadata }
      // Nota: NO exponemos _fraudScore, _retryCount, etc.
    };
  }
}

// Uso del PaymentIntent (como cliente de Stripe)
function usePaymentIntent() {
  const intent = new StripePaymentIntent(5000, 'USD');

  console.log('Created:', intent.id);

  // Attach payment method
  intent.attachPaymentMethod({ type: 'card', last4: '4242' });

  // Confirm
  intent.confirm();

  console.log('Status:', intent.status);

  // ✅ Los clientes NO necesitan saber sobre:
  // - Fraud detection
  // - Retry logic
  // - 3D Secure handling
  // Todo está encapsulado!
}

// ==========================================
// SECCIÓN 8: MEJORES PRÁCTICAS
// ==========================================

/**
 * ✅ MEJORES PRÁCTICAS DE ENCAPSULACIÓN:
 *
 * 1. **Default to private**
 *    - Haz todo privado por defecto
 *    - Solo haz público lo que NECESITA ser público
 *    - Es fácil hacer algo público después, difícil hacerlo privado
 *
 * 2. **Use readonly para datos inmutables**
 *    - ID, timestamps, datos que no cambian
 *    - Previene bugs de modificación accidental
 *
 * 3. **Valida en setters y métodos**
 *    - Asegura que el objeto siempre está en estado válido
 *    - Throw errors para validaciones críticas
 *
 * 4. **"Tell, Don't Ask"**
 *    - Prefiere métodos que hacen acciones
 *    - Evita exponer datos internos para que otros actúen
 *
 * 5. **Encapsula colecciones**
 *    - No expongas arrays/objects mutables directamente
 *    - Provee métodos controlados (add, remove, update)
 *
 * 6. **Computed properties**
 *    - Usa getters para valores derivados
 *    - No almacenes datos redundantes
 *
 * 7. **Oculta detalles de implementación**
 *    - Los clientes no deben saber "cómo" funciona
 *    - Solo el "qué" hace
 *
 * 8. **Interface pública estable**
 *    - Puedes cambiar implementación sin romper clientes
 *    - Versionado semántico para cambios de API
 */

/**
 * ⚠️ ERRORES COMUNES:
 *
 * 1. **Anemic Domain Model**
 *    - Objetos con solo getters/setters, sin comportamiento
 *    - Toda la lógica está en "service" classes
 *    - Solución: Mover lógica a los objetos de dominio
 *
 * 2. **Getters/Setters triviales para TODO**
 *    - public get x() { return this._x; }
 *    - public set x(value) { this._x = value; }
 *    - ¿Para qué? Es lo mismo que hacer el campo público
 *    - Solución: Solo usar getters/setters cuando agregan valor
 *
 * 3. **Exponer estructuras internas**
 *    - get items() { return this._items; } // ¡Retorna referencia mutable!
 *    - Solución: Retornar copia o ReadonlyArray
 *
 * 4. **Demasiados getters**
 *    - Si tienes getter para cada campo, puede indicar "Feature Envy"
 *    - Solución: Mover lógica al objeto que tiene los datos
 *
 * 5. **Lógica en getters/setters**
 *    - Evita lógica compleja en getters (debe ser rápido)
 *    - Evita side-effects en getters (no debe cambiar estado)
 *    - Setters pueden validar, pero no hacer procesamiento complejo
 */

// ==========================================
// SECCIÓN 9: ENCAPSULACIÓN Y TESTING
// ==========================================

/**
 * Buena encapsulación facilita testing
 */

class WellEncapsulatedService {
  private _transactionCount: number = 0;

  public processTransaction(amount: number): boolean {
    if (amount <= 0) return false;

    this.incrementCounter();
    this.logTransaction(amount);

    return true;
  }

  public getTransactionCount(): number {
    return this._transactionCount;
  }

  private incrementCounter(): void {
    this._transactionCount++;
  }

  private logTransaction(amount: number): void {
    console.log(`Transaction processed: ${amount}`);
  }
}

// Test: Solo necesitamos interface pública
function testWellEncapsulated() {
  const service = new WellEncapsulatedService();

  // ✅ Test vía interface pública
  service.processTransaction(100);
  console.assert(service.getTransactionCount() === 1);

  service.processTransaction(200);
  console.assert(service.getTransactionCount() === 2);

  // No necesitamos acceso a métodos privados para testear
  // La interface pública es suficiente
}

// ==========================================
// MAIN - DEMOSTRACIÓN
// ==========================================

console.log('='.repeat(50));
console.log('ENCAPSULACIÓN - DEMOSTRACIÓN');
console.log('='.repeat(50));

console.log('\n1. Sin encapsulación:');
console.log('   - Datos públicos modificables sin control');
console.log('   - Sin validación');
console.log('   - Estado inconsistente posible');

console.log('\n2. Con encapsulación:');
const payment = new GoodPayment(5000, 'USD');
console.log('   - Datos privados protegidos');
console.log('   - Validación automática');
console.log('   - Estado siempre consistente');
console.log(`   Payment ID: ${payment.id}`);
console.log(`   Amount: $${payment.amountInDollars}`);

console.log('\n3. Tell, Don\'t Ask:');
const account = new GoodBankAccount(1000);
const success = account.withdraw(500);
console.log(`   Withdrawal ${success ? 'succeeded' : 'failed'}`);

console.log('\n4. Stripe PaymentIntent (encapsulación real):');
usePaymentIntent();

console.log('\n✅ Beneficios de encapsulación:');
console.log('   - Mantenibilidad: cambios internos no afectan clientes');
console.log('   - Seguridad: previene modificación no autorizada');
console.log('   - Validación: garantiza estado consistente');
console.log('   - Flexibilidad: interface pública estable');

// ==========================================
// PREGUNTAS PARA REFLEXIONAR
// ==========================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuándo usarías getters/setters vs acceso directo público?
 *    Pista: Cuando necesitas validación, computed values, o side-effects
 *
 * 2. ¿Cómo se relaciona encapsulación con el principio "Tell, Don't Ask"?
 *    Pista: Ambos buscan que objetos encapsulen su lógica
 *
 * 3. ¿Por qué Stripe encapsula el fraud detection en PaymentIntent?
 *    Pista: Complejidad oculta, puede cambiar algoritmo sin afectar API
 *
 * 4. ¿Cuál es el peligro de exponer colecciones mutables (arrays)?
 *    Pista: Clientes pueden modificarlas sin validación
 *
 * 5. ¿Cómo decidirías qué hacer público vs privado en una nueva clase?
 *    Pista: Default a privado, solo exponer lo mínimo necesario
 *
 * 6. ¿readonly resuelve todos los problemas de inmutabilidad?
 *    Pista: No, solo previene reasignación, no mutación profunda
 *
 * 7. ¿Cómo se relaciona encapsulación con bajo acoplamiento?
 *    Pista: Ocultar detalles reduce dependencias en esos detalles
 *
 * 8. ¿Qué es un "Anemic Domain Model" y por qué es un anti-pattern?
 *    Pista: Objetos sin comportamiento, solo getters/setters
 */

// ==========================================
// EJERCICIOS PRÁCTICOS
// ==========================================

/**
 * 📝 EJERCICIO 1 (BÁSICO): Refactorizar para encapsulación
 *
 * Dado este código sin encapsulación, refactorízalo:
 *
 * ```typescript
 * class Customer {
 *   public name: string;
 *   public email: string;
 *   public balance: number;
 *   public creditLimit: number;
 * }
 *
 * function makePurchase(customer: Customer, amount: number) {
 *   if (customer.balance + amount <= customer.creditLimit) {
 *     customer.balance += amount;
 *   }
 * }
 * ```
 *
 * Requisitos:
 * - Hacer campos privados
 * - Agregar validación
 * - Mover lógica de purchase a Customer (Tell, Don't Ask)
 */

/**
 * 📝 EJERCICIO 2 (INTERMEDIO): Shopping Cart con encapsulación
 *
 * Implementa un ShoppingCart con:
 * - Items privados (no accesibles directamente)
 * - Métodos: addItem, removeItem, updateQuantity, clear
 * - Computed properties: totalItems, subtotal, tax, total
 * - Validación: cantidad > 0, precio > 0
 * - Método applyDiscount que valida el código
 *
 * Asegúrate de que:
 * - No se pueda modificar items directamente
 * - Total siempre se calcula correctamente
 * - Estado siempre es consistente
 */

/**
 * 📝 EJERCICIO 3 (AVANZADO): Subscription con State Machine
 *
 * Implementa una clase Subscription que:
 * - Encapsula estados: trial, active, past_due, canceled
 * - Transiciones de estado válidas:
 *   - trial → active (al confirmar payment method)
 *   - active → past_due (si falla pago)
 *   - past_due → active (si se recupera pago)
 *   - cualquiera → canceled (al cancelar)
 * - No permite transiciones inválidas
 * - Encapsula lógica de billing cycles
 * - Métodos públicos: activate, markPastDue, cancel, retry
 *
 * Inspiración: https://stripe.com/docs/billing/subscriptions/overview
 */

/**
 * 📝 EJERCICIO 4 (EXPERTO): Rate Limiter encapsulado
 *
 * Implementa un RateLimiter para APIs que:
 * - Limita requests por usuario (ej: 100 req/hour)
 * - Usa sliding window algorithm
 * - Interface pública: allowRequest(userId: string): boolean
 * - Encapsula:
 *   - Estructura de datos interna (Map, Array, etc.)
 *   - Algoritmo de sliding window
 *   - Limpieza de datos antiguos
 * - Debe ser thread-safe (considera race conditions)
 *
 * Objetivo:
 * - Cliente solo llama allowRequest
 * - Toda la complejidad está oculta
 * - Puedes cambiar de sliding window a token bucket sin afectar clientes
 */

// ==========================================
// EXPORTS
// ==========================================

export {
  // Good examples
  GoodPayment,
  GoodBankAccount,
  GoodInvoice,
  GoodShoppingCart,
  StripePaymentIntent
};
