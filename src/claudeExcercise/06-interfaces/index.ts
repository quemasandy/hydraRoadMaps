/**
 * ==========================================
 * INTERFACES EN TYPESCRIPT
 * ==========================================
 *
 * Las interfaces definen contratos para la forma de los objetos.
 * Son fundamentales para diseñar APIs type-safe.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Interface: Contrato que describe la forma de un objeto
 * - Optional properties: Propiedades que pueden no existir (?)
 * - Readonly properties: Propiedades inmutables (readonly)
 * - Index signatures: Propiedades dinámicas [key: string]: Type
 *
 * 🏢 USO EN BIG TECH:
 * Stripe, PayPal, Square definen interfaces para:
 * - API request/response types
 * - Configuration objects
 * - Data models (Customer, Payment, Invoice)
 * - Plugin/extension contracts
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Contrato claro entre componentes
 * - Documentación automática
 * - Autocompletado y type checking
 * - Refactoring seguro
 * - Extensibilidad (implements, extends)
 */

// ============================================
// DECLARACIÓN BÁSICA DE INTERFACES
// ============================================

/**
 * 🔑 CONCEPTO: Interface básica
 *
 * Define la estructura de un objeto de pago
 */
interface Payment {
  // Propiedad required: Debe existir siempre
  id: string;

  // Propiedad required: Monto en centavos
  amount: number;

  // Propiedad required: Código de moneda ISO
  currency: string;

  // Propiedad required: Timestamp de creación
  createdAt: number;
}

/**
 * Función: Crear un pago
 *
 * @param amount - Monto en centavos
 * @param currency - Código de moneda
 * @returns Objeto Payment
 *
 * 🔑 CONCEPTO: La función DEBE retornar un objeto que cumpla con Payment
 */
function createPayment(amount: number, currency: string): Payment {
  return {
    id: `pay_${Date.now()}`,
    amount,
    currency,
    createdAt: Date.now(),
    // Si falta alguna propiedad required, TypeScript da error
  };
}

// ============================================
// PROPIEDADES OPCIONALES
// ============================================

/**
 * 🔑 CONCEPTO: Optional properties (?)
 *
 * Propiedades que pueden existir o no
 *
 * SINTAXIS: propertyName?: Type
 */
interface Customer {
  // Required properties
  id: string;
  email: string;
  createdAt: number;

  // Optional properties - pueden no existir
  name?: string; // Cliente puede no tener nombre
  phone?: string; // Cliente puede no tener teléfono
  address?: Address; // Cliente puede no tener dirección
  metadata?: Record<string, string>; // Metadata custom es opcional
}

/**
 * Interface: Dirección de cliente
 */
interface Address {
  line1: string;
  line2?: string; // Línea 2 es opcional
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Función: Crear cliente con datos mínimos
 *
 * @param email - Email del cliente (required)
 * @param name - Nombre del cliente (optional)
 * @returns Cliente creado
 *
 * 💰 BILLING: No todos los clientes proveen todos los datos
 */
function createCustomer(email: string, name?: string): Customer {
  return {
    id: `cus_${Date.now()}`,
    email,
    // name es opcional - solo incluir si se provee
    ...(name && { name }),
    createdAt: Date.now(),
    // phone, address, metadata son opcionales - no es necesario incluirlos
  };
}

/**
 * Función: Obtener nombre para mostrar
 *
 * @param customer - Cliente
 * @returns Nombre o email
 *
 * 🔑 CONCEPTO: Manejar propiedades opcionales con nullish coalescing
 */
function getDisplayName(customer: Customer): string {
  // name es opcional, puede ser undefined
  // Usar ?? para proveer fallback
  return customer.name ?? customer.email;
}

/**
 * Función: Actualizar dirección de cliente
 *
 * @param customer - Cliente
 * @param address - Nueva dirección
 *
 * 🔑 CONCEPTO: Asignar a propiedad opcional
 */
function updateCustomerAddress(customer: Customer, address: Address): void {
  // address es opcional en Customer, pero podemos asignarle
  customer.address = address;
}

// ============================================
// PROPIEDADES READONLY
// ============================================

/**
 * 🔑 CONCEPTO: readonly properties
 *
 * Propiedades que NO pueden ser modificadas después de creación
 *
 * SINTAXIS: readonly propertyName: Type
 *
 * 🏢 BIG TECH: Stripe usa readonly para IDs, timestamps de creación, etc.
 * Una vez creado un payment, su ID nunca cambia
 */
interface Transaction {
  // readonly: Estas propiedades no pueden ser modificadas
  readonly id: string; // ID inmutable
  readonly customerId: string; // Cliente inmutable
  readonly createdAt: number; // Timestamp de creación inmutable

  // Mutable: Estas propiedades SÍ pueden cambiar
  amount: number; // Monto puede ajustarse
  description: string; // Descripción puede actualizarse
  status: "pending" | "completed" | "failed"; // Estado cambia durante lifecycle
}

/**
 * Función: Crear transacción
 *
 * @param customerId - ID del cliente
 * @param amount - Monto
 * @returns Transacción creada
 */
function createTransaction(customerId: string, amount: number): Transaction {
  return {
    id: `txn_${Date.now()}`,
    customerId,
    amount,
    description: "",
    status: "pending",
    createdAt: Date.now(),
  };
}

/**
 * Función: Actualizar transacción
 *
 * @param transaction - Transacción a actualizar
 * @param amount - Nuevo monto
 * @param description - Nueva descripción
 *
 * 🔑 CONCEPTO: readonly previene modificación accidental
 */
function updateTransaction(
  transaction: Transaction,
  amount: number,
  description: string
): void {
  // ✅ OK: amount y description son mutables
  transaction.amount = amount;
  transaction.description = description;

  // ❌ ERROR: id, customerId, createdAt son readonly
  // transaction.id = "new_id"; // Error de compilación
  // transaction.customerId = "new_customer"; // Error de compilación
  // transaction.createdAt = Date.now(); // Error de compilación
}

/**
 * 🔑 CONCEPTO: readonly es shallow, no deep
 */
interface PaymentMethod {
  readonly id: string;
  readonly type: "card" | "bank_account";
  // readonly no afecta objetos anidados
  readonly card: {
    brand: string; // Esta propiedad SÍ es mutable
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

function demonstrateReadonlyShallow(pm: PaymentMethod): void {
  // ❌ No puedo reasignar card (readonly)
  // pm.card = { ... }; // Error

  // ✅ PERO puedo modificar propiedades de card
  pm.card.brand = "mastercard"; // OK - readonly es shallow
}

// ============================================
// READONLY DEEP: Utility Type
// ============================================

/**
 * 🔑 CONCEPTO: Readonly<T> utility type
 *
 * Hace todas las propiedades de primer nivel readonly
 */
type ReadonlyPayment = Readonly<Payment>;

// Equivalente a:
// interface ReadonlyPayment {
//   readonly id: string;
//   readonly amount: number;
//   readonly currency: string;
//   readonly createdAt: number;
// }

/**
 * Para readonly profundo, necesitamos type recursivo
 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type DeepReadonlyPaymentMethod = DeepReadonly<PaymentMethod>;
// Ahora card.brand también es readonly

// ============================================
// INDEX SIGNATURES: Propiedades dinámicas
// ============================================

/**
 * 🔑 CONCEPTO: Index signatures
 *
 * Permiten propiedades con nombres dinámicos
 *
 * SINTAXIS: [key: string]: Type
 *
 * 🏢 BIG TECH: Stripe usa esto para metadata custom
 */
interface PaymentMetadata {
  // Index signature: Acepta cualquier string key
  [key: string]: string | number | boolean;

  // También podemos tener propiedades específicas
  orderId: string; // Esta es required
  // Otras keys son opcionales y dinámicas
}

/**
 * Función: Crear pago con metadata custom
 *
 * @param amount - Monto
 * @param metadata - Metadata custom
 * @returns Pago con metadata
 *
 * 💰 BILLING: Metadata permite asociar datos custom a pagos
 */
function createPaymentWithMetadata(
  amount: number,
  metadata: PaymentMetadata
): Payment & { metadata: PaymentMetadata } {
  return {
    id: `pay_${Date.now()}`,
    amount,
    currency: "USD",
    createdAt: Date.now(),
    metadata,
  };
}

// Usar con propiedades dinámicas
const payment1 = createPaymentWithMetadata(2999, {
  orderId: "ord_123", // Required
  campaignId: "camp_456", // Dinámico
  source: "mobile_app", // Dinámico
  userId: 12345, // Dinámico - number también es válido
  isFirstPurchase: true, // Dinámico - boolean también es válido
});

// ============================================
// EXTENDING INTERFACES
// ============================================

/**
 * 🔑 CONCEPTO: Interface extension
 *
 * Una interface puede extender otra
 *
 * SINTAXIS: interface Child extends Parent
 *
 * 🏢 BIG TECH: Reutilizar definiciones, crear jerarquías
 */

/**
 * Interface base: Entidad con timestamp
 */
interface Timestamped {
  readonly createdAt: number;
  updatedAt: number;
}

/**
 * Interface: Invoice extiende Timestamped
 */
interface Invoice extends Timestamped {
  readonly id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: "draft" | "open" | "paid" | "void";
  // Hereda: createdAt, updatedAt
}

/**
 * Función: Crear invoice
 */
function createInvoice(customerId: string, amount: number): Invoice {
  const now = Date.now();
  return {
    id: `inv_${now}`,
    customerId,
    amount,
    currency: "USD",
    status: "draft",
    createdAt: now, // De Timestamped
    updatedAt: now, // De Timestamped
  };
}

/**
 * Interface: Subscription extiende Timestamped
 */
interface Subscription extends Timestamped {
  readonly id: string;
  customerId: string;
  planId: string;
  status: "active" | "canceled" | "past_due";
  currentPeriodStart: number;
  currentPeriodEnd: number;
  // Hereda: createdAt, updatedAt
}

// ============================================
// MÚLTIPLE EXTENSION
// ============================================

/**
 * 🔑 CONCEPTO: Extender múltiples interfaces
 *
 * Una interface puede extender varias a la vez
 */
interface Identifiable {
  readonly id: string;
}

interface Deletable {
  deleted: boolean;
  deletedAt?: number;
}

/**
 * Interface: Producto extiende múltiples interfaces
 */
interface Product extends Identifiable, Timestamped, Deletable {
  name: string;
  description: string;
  price: number;
  currency: string;
  active: boolean;
  // Hereda: id, createdAt, updatedAt, deleted, deletedAt
}

/**
 * Función: Soft delete de producto
 *
 * @param product - Producto a eliminar
 *
 * 💰 BILLING: Soft deletes mantienen historial
 */
function softDeleteProduct(product: Product): void {
  product.deleted = true;
  product.deletedAt = Date.now();
  product.active = false;
  product.updatedAt = Date.now();
}

// ============================================
// FUNCTION TYPES EN INTERFACES
// ============================================

/**
 * 🔑 CONCEPTO: Interfaces pueden definir métodos
 *
 * Dos sintaxis:
 * 1. Method signature: methodName(): Type
 * 2. Property signature: methodName: () => Type
 */
interface PaymentProcessor {
  // Required properties
  readonly name: string;
  readonly apiKey: string;

  // Optional property
  webhookSecret?: string;

  // Method signature (sintaxis 1)
  processPayment(amount: number, currency: string): Promise<Transaction>;

  // Property signature (sintaxis 2)
  refund: (transactionId: string, amount?: number) => Promise<Transaction>;

  // Método con propiedades opcionales
  createCustomer(email: string, name?: string): Promise<Customer>;
}

/**
 * Clase: Implementación de Stripe processor
 *
 * 🏢 BIG TECH: Adapter pattern para múltiples procesadores
 */
class StripeProcessor implements PaymentProcessor {
  readonly name = "Stripe";
  readonly apiKey: string;
  webhookSecret?: string;

  constructor(apiKey: string, webhookSecret?: string) {
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
  }

  async processPayment(amount: number, currency: string): Promise<Transaction> {
    // Simular llamada a Stripe API
    console.log(`[Stripe] Processing ${amount} ${currency}`);
    return createTransaction("cus_123", amount);
  }

  refund = async (
    transactionId: string,
    amount?: number
  ): Promise<Transaction> => {
    // Simular refund
    console.log(`[Stripe] Refunding ${transactionId}`);
    return createTransaction("cus_123", amount ?? 0);
  };

  async createCustomer(email: string, name?: string): Promise<Customer> {
    console.log(`[Stripe] Creating customer: ${email}`);
    return createCustomer(email, name);
  }
}

// ============================================
// DEMOSTRACIÓN: Uso práctico
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Interfaces en TypeScript");
console.log("=".repeat(60));

// BÁSICO: Interface con propiedades required
console.log("\n📝 BÁSICO - Interface con propiedades required:");
const payment = createPayment(2999, "USD");
console.log(`Pago: ${payment.id} - $${payment.amount / 100}`);

// OPCIONAL: Propiedades opcionales
console.log("\n❓ OPCIONAL - Propiedades opcionales:");
const customer1 = createCustomer("john@example.com", "John Doe");
const customer2 = createCustomer("jane@example.com");
console.log(`Cliente 1: ${getDisplayName(customer1)}`);
console.log(`Cliente 2: ${getDisplayName(customer2)}`);

// READONLY: Propiedades inmutables
console.log("\n🔒 READONLY - Propiedades inmutables:");
const txn = createTransaction("cus_123", 5000);
console.log(`Transacción: ${txn.id} - Status: ${txn.status}`);
updateTransaction(txn, 6000, "Updated amount");
console.log(`Actualizado: $${txn.amount / 100} - ${txn.description}`);

// INDEX SIGNATURES: Metadata dinámica
console.log("\n🔑 INDEX SIGNATURES - Metadata dinámica:");
console.log(`Metadata orderId: ${payment1.metadata.orderId}`);
console.log(`Metadata campaignId: ${payment1.metadata.campaignId}`);

// EXTENDING: Herencia de interfaces
console.log("\n⬆️ EXTENDING - Herencia de interfaces:");
const invoice = createInvoice("cus_123", 10000);
console.log(`Invoice: ${invoice.id} - Status: ${invoice.status}`);
console.log(`Created: ${new Date(invoice.createdAt).toLocaleString()}`);

// IMPLEMENTING: Clase que implementa interface
console.log("\n✅ IMPLEMENTING - Clase implementa interface:");
const processor = new StripeProcessor("sk_test_123", "whsec_456");
processor.processPayment(7500, "USD");
processor.createCustomer("test@example.com", "Test User");

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. API CONTRACTS:
 *    - Request/Response interfaces
 *    - Garantiza comunicación consistente entre servicios
 *    - Ejemplo: interface CreatePaymentRequest, interface PaymentResponse
 *
 * 2. DATA MODELS:
 *    - Customer, Payment, Invoice, Subscription
 *    - Readonly para IDs y timestamps de creación
 *    - Optional para campos no siempre requeridos
 *
 * 3. CONFIGURATION:
 *    - Stripe config, PayPal config
 *    - Readonly para API keys
 *    - Optional para webhooks secrets
 *
 * 4. PLUGINS/ADAPTERS:
 *    - PaymentProcessor interface
 *    - Múltiples implementaciones (Stripe, PayPal, Square)
 *    - Strategy pattern
 *
 * 5. METADATA:
 *    - Index signatures para datos custom
 *    - Asociar información de negocio a entidades
 *
 * 6. AUDIT TRAIL:
 *    - Timestamped interface
 *    - Readonly createdAt
 *    - Mutable updatedAt
 *    - Soft deletes con deletedAt
 *
 * 7. HIERARCHIES:
 *    - Base interfaces compartidas
 *    - Extensión para especialización
 *    - DRY principle
 */

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS");
console.log("=".repeat(60));

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. USA readonly PARA INMUTABILIDAD:
 *    ✅ readonly id: string
 *    - IDs nunca cambian
 *    - Timestamps de creación inmutables
 *
 * 2. USA ? PARA OPCIONALES:
 *    ✅ name?: string
 *    - No todos los datos siempre disponibles
 *    - Mejor que name: string | undefined
 *
 * 3. NOMBRES DESCRIPTIVOS:
 *    ✅ interface PaymentRequest
 *    ❌ interface PR
 *
 * 4. SINGLE RESPONSIBILITY:
 *    ✅ interface Payment (solo datos de pago)
 *    ❌ interface PaymentAndCustomerAndInvoice
 *
 * 5. EXTEND EN VEZ DE DUPLICAR:
 *    ✅ interface Invoice extends Timestamped
 *    ❌ Repetir createdAt/updatedAt en cada interface
 *
 * 6. DOCUMENTA CON JSDOC:
 *    /** * Interface para datos de pago * /
 *    interface Payment { ... }
 *
 * 7. USA UTILITY TYPES:
 *    - Readonly<T> para inmutabilidad
 *    - Partial<T> para opcionales
 *    - Required<T> para requeridos
 *    - Pick<T, K> para subset
 *    - Omit<T, K> para exclusión
 *
 * ⚠️ ERRORES COMUNES:
 *
 * 1. TODO OPCIONAL:
 *    ❌ interface Payment { amount?: number }
 *    ✅ Hacer required lo que siempre se necesita
 *
 * 2. OLVIDAR readonly:
 *    ❌ id: string // mutable
 *    ✅ readonly id: string
 *
 * 3. INDEX SIGNATURE MUY AMPLIA:
 *    ❌ [key: string]: any
 *    ✅ [key: string]: string | number
 *
 * 4. INTERFACES DEMASIADO GRANDES:
 *    ❌ interface God { ... 50 propiedades }
 *    ✅ Dividir en interfaces más pequeñas
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre interface y type?
 *    Pista: Veremos esto en el próximo ejercicio
 *
 * 2. ¿Por qué readonly es shallow y no deep?
 *    Pista: Performance vs seguridad
 *
 * 3. ¿Cómo harías una propiedad required condicionalmente?
 *    Pista: Conditional types, discriminated unions
 *
 * 4. ¿Puedes hacer una interface con propiedades computadas?
 *    Pista: Solo types pueden, interfaces no
 *
 * 5. ¿Cómo validarías que un objeto cumple una interface en runtime?
 *    Pista: Interfaces desaparecen en compilación
 *
 * 6. ¿Qué es declaration merging y cuándo es útil?
 *    Pista: Interfaces con mismo nombre se fusionan
 *
 * 7. ¿Cómo representarías una API que retorna diferentes tipos según input?
 *    Pista: Function overloads, conditional types
 *
 * 8. ¿Cuándo usarías index signature vs Record<K, V>?
 *    Pista: Ambos son válidos, Record es más explícito
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea interfaces para un sistema de subscripciones:
 *    - Plan (id, name, price, interval)
 *    - Subscription (id, customerId, planId, status, timestamps)
 *    - Usa readonly, optional, extends apropiadamente
 *
 * 2. INTERMEDIO:
 *    Diseña un payment gateway abstraction:
 *    - Interface PaymentGateway con métodos comunes
 *    - Implementaciones para Stripe, PayPal, Square
 *    - Cada uno con configuración específica
 *
 * 3. AVANZADO:
 *    Crea un sistema de eventos tipo Stripe:
 *    - Interface base Event<T>
 *    - Eventos específicos que extienden Event
 *    - Type-safe event data según tipo de evento
 *    - Webhook payload validation
 *
 * 4. EXPERTO:
 *    Implementa un sistema de permisos granular:
 *    - Interface Permission con recursos y acciones
 *    - Role que agrupa permissions
 *    - User con roles
 *    - Función hasPermission type-safe
 *    - Readonly/optional donde corresponda
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Domina las interfaces!");
console.log("=".repeat(60));

export {
  Payment,
  Customer,
  Address,
  Transaction,
  PaymentMethod,
  PaymentMetadata,
  Invoice,
  Subscription,
  Product,
  PaymentProcessor,
  StripeProcessor,
  createPayment,
  createCustomer,
  getDisplayName,
  createTransaction,
  updateTransaction,
  createInvoice,
  softDeleteProduct,
};
