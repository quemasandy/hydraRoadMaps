/**
 * ==========================================
 * GENÉRICOS EN TYPESCRIPT
 * ==========================================
 *
 * Los genéricos permiten crear componentes reutilizables que trabajan
 * con múltiples tipos manteniendo type safety.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Funciones genéricas: Funciones que trabajan con cualquier tipo
 * - Clases genéricas: Clases parametrizadas por tipo
 * - Constraints: Limitar qué tipos son aceptables
 * - Genéricos en interfaces: Interfaces reutilizables
 *
 * 🏢 USO EN BIG TECH:
 * Stripe SDK usa genéricos extensivamente:
 * - Response<T> para diferentes recursos
 * - List<T> para paginación de cualquier entidad
 * - Repository<T> para data access
 * - Result<T, E> para manejo de errores
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Reutilización: Escribir código una vez, usar con muchos tipos
 * - Type safety: Mantener tipos a través de transformaciones
 * - Inferencia: TypeScript infiere tipos automáticamente
 * - No más 'any': Código genérico sin perder tipos
 */

// ============================================
// PARTE 1: FUNCIONES GENÉRICAS
// ============================================

/**
 * 🔑 CONCEPTO: Funciones genéricas
 *
 * SINTAXIS:
 * function functionName<T>(param: T): T { }
 *
 * T es un "type parameter" - placeholder para un tipo
 *
 * 🏢 BIG TECH: Array.prototype.map<T, U> es genérica
 */

/**
 * EJEMPLO SIN GENÉRICOS (malo):
 * Necesitamos diferentes funciones para cada tipo
 */
function wrapStringInArray(value: string): string[] {
  return [value];
}

function wrapNumberInArray(value: number): number[] {
  return [value];
}

// Duplicación innecesaria...

/**
 * EJEMPLO CON GENÉRICOS (bueno):
 * Una función sirve para todos los tipos
 */
function wrapInArray<T>(value: T): T[] {
  // T es el tipo que se pasa
  // value tiene tipo T
  // Retornamos T[]
  return [value];
}

// Uso: TypeScript infiere el tipo
const strArray = wrapInArray("hello"); // string[]
const numArray = wrapInArray(42); // number[]
const objArray = wrapInArray({ id: "pay_123" }); // { id: string }[]

// También puedes especificar explícitamente
const explicitArray = wrapInArray<boolean>(true); // boolean[]

/**
 * EJEMPLO PRÁCTICO: Primera y última transacción
 *
 * 💰 BILLING: Obtener primera y última de cualquier lista
 */
function getFirstAndLast<T>(items: T[]): [T | undefined, T | undefined] {
  // T representa cualquier tipo
  // Funciona con arrays de cualquier cosa
  const first = items[0];
  const last = items[items.length - 1];
  return [first, last];
}

interface Transaction {
  id: string;
  amount: number;
}

interface Customer {
  id: string;
  email: string;
}

const transactions: Transaction[] = [
  { id: "txn_1", amount: 1000 },
  { id: "txn_2", amount: 2000 },
  { id: "txn_3", amount: 3000 },
];

// Type inference: TypeScript sabe que T = Transaction
const [firstTxn, lastTxn] = getFirstAndLast(transactions);
// firstTxn tiene tipo Transaction | undefined

const customers: Customer[] = [
  { id: "cus_1", email: "a@example.com" },
  { id: "cus_2", email: "b@example.com" },
];

// Type inference: T = Customer
const [firstCus, lastCus] = getFirstAndLast(customers);
// firstCus tiene tipo Customer | undefined

/**
 * EJEMPLO: Función con múltiples type parameters
 *
 * 🏢 BIG TECH: Map functions transforman tipos
 */
function map<Input, Output>(
  items: Input[],
  transform: (item: Input) => Output
): Output[] {
  // Input y Output son tipos diferentes
  const result: Output[] = [];

  for (const item of items) {
    result.push(transform(item));
  }

  return result;
}

// Uso: Transformar Transaction[] a string[]
const transactionIds = map(
  transactions,
  (txn) => txn.id // TypeScript infiere Input=Transaction, Output=string
);
// transactionIds tiene tipo string[]

// Transformar Transaction[] a number[]
const amounts = map(transactions, (txn) => txn.amount);
// amounts tiene tipo number[]

/**
 * EJEMPLO: Función genérica con valor de retorno complejo
 *
 * 💰 BILLING: Paginar cualquier tipo de entidad
 */
interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  total: number;
}

function paginate<T>(
  allItems: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;

  const data = allItems.slice(startIndex, endIndex);
  const hasMore = endIndex < allItems.length;

  return {
    data,
    hasMore,
    total: allItems.length,
  };
}

// Paginar transacciones
const txnPage = paginate(transactions, 0, 2);
// txnPage tiene tipo PaginatedResponse<Transaction>
// txnPage.data tiene tipo Transaction[]

// Paginar customers
const cusPage = paginate(customers, 0, 1);
// cusPage tiene tipo PaginatedResponse<Customer>
// cusPage.data tiene tipo Customer[]

// ============================================
// PARTE 2: CLASES GENÉRICAS
// ============================================

/**
 * 🔑 CONCEPTO: Clases genéricas
 *
 * SINTAXIS:
 * class ClassName<T> {
 *   property: T;
 *   method(param: T): T { }
 * }
 *
 * 🏢 BIG TECH: Repository<T>, Cache<T>, Queue<T>
 */

/**
 * Clase genérica: API Response wrapper
 *
 * 💰 BILLING: Stripe wraps all API responses
 */
class ApiResponse<T> {
  constructor(
    public readonly data: T,
    public readonly statusCode: number,
    public readonly timestamp: number = Date.now()
  ) {}

  isSuccess(): boolean {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  getData(): T {
    if (!this.isSuccess()) {
      throw new Error(`API call failed with status ${this.statusCode}`);
    }
    return this.data;
  }
}

// Uso con diferentes tipos
interface Payment {
  id: string;
  amount: number;
  status: string;
}

const paymentResponse = new ApiResponse<Payment>(
  { id: "pay_123", amount: 5000, status: "succeeded" },
  200
);

// paymentResponse.data tiene tipo Payment
const payment = paymentResponse.getData(); // Payment
console.log(payment.amount); // ✅ Type-safe

const customersResponse = new ApiResponse<Customer[]>(
  [{ id: "cus_1", email: "test@example.com" }],
  200
);

// customersResponse.data tiene tipo Customer[]
const customersList = customersResponse.getData(); // Customer[]

/**
 * Clase genérica: Repository pattern
 *
 * 🏢 BIG TECH: Data access layer genérico
 */
class Repository<T extends { id: string }> {
  // T debe tener propiedad 'id' (constraint)
  private items: Map<string, T> = new Map();

  save(item: T): void {
    this.items.set(item.id, item);
    console.log(`Saved ${item.id}`);
  }

  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return Array.from(this.items.values());
  }

  delete(id: string): boolean {
    const existed = this.items.has(id);
    this.items.delete(id);
    return existed;
  }

  count(): number {
    return this.items.size;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;

    const updated = { ...item, ...updates };
    this.items.set(id, updated);
    return updated;
  }
}

// Usar Repository con diferentes tipos
const paymentRepo = new Repository<Payment>();
paymentRepo.save({ id: "pay_1", amount: 1000, status: "pending" });
paymentRepo.save({ id: "pay_2", amount: 2000, status: "succeeded" });

const foundPayment = paymentRepo.findById("pay_1");
// foundPayment tiene tipo Payment | undefined

const allPayments = paymentRepo.findAll();
// allPayments tiene tipo Payment[]

const customerRepo = new Repository<Customer>();
customerRepo.save({ id: "cus_1", email: "john@example.com" });

const foundCustomer = customerRepo.findById("cus_1");
// foundCustomer tiene tipo Customer | undefined

/**
 * Clase genérica: Result type para manejo de errores
 *
 * 🏢 BIG TECH: Rust-style error handling sin exceptions
 */
class Result<T, E = Error> {
  private constructor(
    private readonly value?: T,
    private readonly error?: E,
    private readonly success: boolean = true
  ) {}

  static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined, true);
  }

  static err<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error, false);
  }

  isOk(): this is Result<T, never> {
    return this.success;
  }

  isErr(): this is Result<never, E> {
    return !this.success;
  }

  unwrap(): T {
    if (!this.success) {
      throw new Error("Called unwrap on an Err value");
    }
    return this.value!;
  }

  unwrapOr(defaultValue: T): T {
    return this.success ? this.value! : defaultValue;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (!this.success) {
      return Result.err<U, E>(this.error!);
    }
    return Result.ok<U, E>(fn(this.value!));
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    if (this.success) {
      return Result.ok<T, F>(this.value!);
    }
    return Result.err<T, F>(fn(this.error!));
  }

  match<U>(onOk: (value: T) => U, onErr: (error: E) => U): U {
    return this.success ? onOk(this.value!) : onErr(this.error!);
  }
}

// Uso de Result
function processPayment(amount: number): Result<Payment, string> {
  if (amount <= 0) {
    return Result.err("Amount must be positive");
  }

  if (amount > 1000000) {
    return Result.err("Amount too large");
  }

  // Simular procesamiento
  const payment: Payment = {
    id: `pay_${Date.now()}`,
    amount,
    status: "succeeded",
  };

  return Result.ok(payment);
}

const result1 = processPayment(5000);
if (result1.isOk()) {
  const payment = result1.unwrap();
  console.log(`Payment processed: ${payment.id}`);
} else {
  console.error("Payment failed");
}

const result2 = processPayment(-100);
const finalAmount = result2.unwrapOr({ id: "default", amount: 0, status: "failed" });

// Transformar con map
const result3 = processPayment(3000);
const idResult = result3.map((payment) => payment.id);
// idResult tiene tipo Result<string, string>

// ============================================
// PARTE 3: CONSTRAINTS EN GENÉRICOS
// ============================================

/**
 * 🔑 CONCEPTO: Generic constraints
 *
 * Limitar qué tipos puede ser T
 *
 * SINTAXIS:
 * function fn<T extends Constraint>(param: T): T { }
 *
 * 🏢 BIG TECH: Garantizar que T tiene ciertas propiedades
 */

/**
 * Constraint: T debe tener propiedad 'id'
 */
interface Identifiable {
  id: string;
}

function logId<T extends Identifiable>(item: T): void {
  // Sabemos que T tiene 'id' porque extends Identifiable
  console.log(`ID: ${item.id}`);
}

// ✅ OK: Payment tiene 'id'
logId({ id: "pay_123", amount: 5000, status: "pending" });

// ✅ OK: Customer tiene 'id'
logId({ id: "cus_123", email: "test@example.com" });

// ❌ ERROR: No tiene 'id'
// logId({ amount: 5000 }); // Error de compilación

/**
 * Constraint: T debe ser array
 */
function getLength<T extends any[]>(arr: T): number {
  return arr.length;
}

const len1 = getLength([1, 2, 3]); // ✅ OK
const len2 = getLength(["a", "b"]); // ✅ OK
// const len3 = getLength(123); // ❌ ERROR: number no es array

/**
 * Constraint: T debe tener método
 */
interface Processable {
  process(): void;
}

function processAll<T extends Processable>(items: T[]): void {
  items.forEach((item) => item.process());
}

/**
 * Constraint múltiple: T debe cumplir múltiples interfaces
 */
interface Timestamped {
  createdAt: number;
  updatedAt: number;
}

interface Deletable {
  deleted: boolean;
}

function softDelete<T extends Timestamped & Deletable>(item: T): T {
  // T tiene createdAt, updatedAt (Timestamped)
  // T tiene deleted (Deletable)
  return {
    ...item,
    deleted: true,
    updatedAt: Date.now(),
  };
}

/**
 * Constraint: keyof para propiedades
 *
 * 🏢 BIG TECH: Type-safe property access
 */
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  // K debe ser una clave válida de T
  // Retorna el tipo de esa propiedad
  return obj[key];
}

const payment2: Payment = { id: "pay_456", amount: 7500, status: "pending" };

const id = getProperty(payment2, "id"); // string
const amount = getProperty(payment2, "amount"); // number
const status = getProperty(payment2, "status"); // string

// ❌ ERROR: "invalid" no es clave de Payment
// const invalid = getProperty(payment2, "invalid"); // Error

/**
 * EJEMPLO PRÁCTICO: Pluck - extraer propiedad de array
 *
 * 💰 BILLING: Extraer IDs de lista de pagos
 */
function pluck<T, K extends keyof T>(items: T[], key: K): Array<T[K]> {
  return items.map((item) => item[key]);
}

const payments: Payment[] = [
  { id: "pay_1", amount: 1000, status: "succeeded" },
  { id: "pay_2", amount: 2000, status: "pending" },
];

const ids = pluck(payments, "id"); // string[]
const amounts2 = pluck(payments, "amount"); // number[]
const statuses = pluck(payments, "status"); // string[]

// Type-safe: No puedes pluck propiedad que no existe
// const invalid = pluck(payments, "invalid"); // Error

/**
 * Constraint: T extends U (tipo debe ser subtipo)
 */
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge(
  { id: "pay_123", amount: 5000 },
  { currency: "USD", status: "pending" }
);
// merged tiene tipo { id: string; amount: number } & { currency: string; status: string }

// ============================================
// PARTE 4: GENÉRICOS EN INTERFACES
// ============================================

/**
 * 🔑 CONCEPTO: Generic interfaces
 *
 * Interfaces parametrizadas por tipo
 *
 * 🏢 BIG TECH: API contracts, DTOs, responses
 */

/**
 * Interface genérica: API List response
 *
 * 💰 BILLING: Stripe List<T> para paginación
 */
interface List<T> {
  data: T[];
  hasMore: boolean;
  url: string;
  count: number;
}

// Uso con diferentes tipos
const paymentList: List<Payment> = {
  data: [
    { id: "pay_1", amount: 1000, status: "succeeded" },
    { id: "pay_2", amount: 2000, status: "pending" },
  ],
  hasMore: true,
  url: "/v1/payments",
  count: 2,
};

const customerList: List<Customer> = {
  data: [{ id: "cus_1", email: "test@example.com" }],
  hasMore: false,
  url: "/v1/customers",
  count: 1,
};

/**
 * Interface genérica: CRUD operations
 */
interface CrudRepository<T, ID> {
  create(item: Omit<T, "id">): T;
  read(id: ID): T | undefined;
  update(id: ID, updates: Partial<T>): T | undefined;
  delete(id: ID): boolean;
  list(): T[];
}

/**
 * Implementación de interface genérica
 */
class PaymentRepository implements CrudRepository<Payment, string> {
  private payments = new Map<string, Payment>();

  create(item: Omit<Payment, "id">): Payment {
    const payment: Payment = {
      id: `pay_${Date.now()}`,
      ...item,
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  read(id: string): Payment | undefined {
    return this.payments.get(id);
  }

  update(id: string, updates: Partial<Payment>): Payment | undefined {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const updated = { ...payment, ...updates };
    this.payments.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.payments.delete(id);
  }

  list(): Payment[] {
    return Array.from(this.payments.values());
  }
}

/**
 * Interface genérica con múltiples type parameters
 */
interface KeyValueStore<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  keys(): K[];
  values(): V[];
  entries(): Array<[K, V]>;
}

/**
 * Implementación genérica
 */
class InMemoryStore<K, V> implements KeyValueStore<K, V> {
  private store = new Map<K, V>();

  get(key: K): V | undefined {
    return this.store.get(key);
  }

  set(key: K, value: V): void {
    this.store.set(key, value);
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }

  keys(): K[] {
    return Array.from(this.store.keys());
  }

  values(): V[] {
    return Array.from(this.store.values());
  }

  entries(): Array<[K, V]> {
    return Array.from(this.store.entries());
  }
}

// Uso con diferentes tipos de K y V
const paymentStore = new InMemoryStore<string, Payment>();
paymentStore.set("pay_1", { id: "pay_1", amount: 1000, status: "succeeded" });

const numberCache = new InMemoryStore<number, string>();
numberCache.set(1, "one");
numberCache.set(2, "two");

/**
 * Interface genérica: Event emitter
 *
 * 🏢 BIG TECH: Type-safe event handling
 */
interface EventMap {
  [event: string]: any;
}

interface EventEmitter<Events extends EventMap> {
  on<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): void;
  emit<E extends keyof Events>(event: E, payload: Events[E]): void;
  off<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): void;
}

// Definir eventos específicos para pagos
interface PaymentEvents {
  "payment.created": Payment;
  "payment.succeeded": { paymentId: string; amount: number };
  "payment.failed": { paymentId: string; error: string };
}

class PaymentEventEmitter implements EventEmitter<PaymentEvents> {
  private handlers = new Map<keyof PaymentEvents, Array<(payload: any) => void>>();

  on<E extends keyof PaymentEvents>(
    event: E,
    handler: (payload: PaymentEvents[E]) => void
  ): void {
    const eventHandlers = this.handlers.get(event) || [];
    eventHandlers.push(handler);
    this.handlers.set(event, eventHandlers);
  }

  emit<E extends keyof PaymentEvents>(event: E, payload: PaymentEvents[E]): void {
    const eventHandlers = this.handlers.get(event) || [];
    eventHandlers.forEach((handler) => handler(payload));
  }

  off<E extends keyof PaymentEvents>(
    event: E,
    handler: (payload: PaymentEvents[E]) => void
  ): void {
    const eventHandlers = this.handlers.get(event) || [];
    const index = eventHandlers.indexOf(handler);
    if (index > -1) {
      eventHandlers.splice(index, 1);
    }
  }
}

// Uso type-safe
const emitter = new PaymentEventEmitter();

emitter.on("payment.created", (payment) => {
  // payment tiene tipo Payment
  console.log(`Payment created: ${payment.id}`);
});

emitter.on("payment.succeeded", (data) => {
  // data tiene tipo { paymentId: string; amount: number }
  console.log(`Payment ${data.paymentId} succeeded: ${data.amount}`);
});

emitter.emit("payment.created", { id: "pay_123", amount: 5000, status: "pending" });
emitter.emit("payment.succeeded", { paymentId: "pay_123", amount: 5000 });

// ❌ ERROR: Payload incorrecto
// emitter.emit("payment.created", { invalid: "data" }); // Error

// ============================================
// DEMOSTRACIÓN COMPLETA
// ============================================

console.log("\n" + "=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Genéricos en TypeScript");
console.log("=".repeat(60));

// 1. Funciones genéricas
console.log("\n1️⃣ FUNCIONES GENÉRICAS:");
const wrapped = wrapInArray(42);
console.log(`Wrapped: ${wrapped}`);

const [first, last] = getFirstAndLast([1, 2, 3, 4, 5]);
console.log(`First: ${first}, Last: ${last}`);

// 2. Clases genéricas
console.log("\n2️⃣ CLASES GENÉRICAS:");
const response = new ApiResponse({ id: "pay_999", amount: 9999, status: "succeeded" }, 200);
console.log(`Response data: ${response.getData().id}`);

const repo = new Repository<Payment>();
repo.save({ id: "pay_100", amount: 10000, status: "pending" });
console.log(`Repository count: ${repo.count()}`);

// 3. Constraints
console.log("\n3️⃣ CONSTRAINTS:");
const paymentIds = pluck(
  [
    { id: "pay_1", amount: 1000, status: "succeeded" },
    { id: "pay_2", amount: 2000, status: "pending" },
  ],
  "id"
);
console.log(`Payment IDs: ${paymentIds.join(", ")}`);

// 4. Interfaces genéricas
console.log("\n4️⃣ INTERFACES GENÉRICAS:");
const kvStore = new InMemoryStore<string, number>();
kvStore.set("count", 42);
console.log(`Stored value: ${kvStore.get("count")}`);

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. API RESPONSES:
 *    interface Response<T> { data: T }
 *    - Reutilizar para Payment, Customer, Invoice
 *    - Type-safe data access
 *
 * 2. PAGINATION:
 *    interface List<T> { data: T[]; hasMore: boolean }
 *    - Lista de cualquier entidad
 *    - Stripe usa esto
 *
 * 3. REPOSITORIES:
 *    class Repository<T extends Identifiable>
 *    - Data access genérico
 *    - CRUD operations type-safe
 *
 * 4. RESULT TYPE:
 *    class Result<T, E>
 *    - Error handling sin exceptions
 *    - Composable con map, flatMap
 *
 * 5. CACHING:
 *    class Cache<K, V>
 *    - Cache genérico para cualquier dato
 *    - Session cache, API cache
 *
 * 6. EVENT EMITTERS:
 *    interface EventEmitter<Events>
 *    - Type-safe event handling
 *    - Webhooks, internal events
 *
 * 7. VALIDATION:
 *    interface Validator<T>
 *    - Validadores reutilizables
 *    - Schema validation
 */

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS");
console.log("=".repeat(60));

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. USA NOMBRES DESCRIPTIVOS:
 *    ✅ <TEntity, TKey> - descriptivo
 *    ⚠️ <T, U> - OK para funciones simples
 *    ❌ <A, B, C> - confuso
 *
 * 2. APROVECHA TYPE INFERENCE:
 *    ✅ const result = wrap(42) - infiere
 *    ⚠️ const result = wrap<number>(42) - explícito si necesario
 *
 * 3. USA CONSTRAINTS CUANDO SEA POSIBLE:
 *    ✅ <T extends Identifiable>
 *    - Más seguro que T sin constraint
 *
 * 4. DEFAULT TYPE PARAMETERS:
 *    ✅ class Result<T, E = Error>
 *    - E defaults a Error si no se especifica
 *
 * 5. EVITA OVER-ENGINEERING:
 *    ❌ Genéricos innecesarios
 *    ✅ Usar solo cuando necesites reutilización
 *
 * 6. DOCUMENTA TYPE PARAMETERS:
 *    /**
 *     * @template T - Type of entity
 *     * @template ID - Type of entity ID
 *     */
 *
 * 7. UTILITY TYPES BUILT-IN:
 *    - Partial<T>, Required<T>
 *    - Pick<T, K>, Omit<T, K>
 *    - Record<K, V>
 *    - ReturnType<F>
 *    - etc.
 *
 * ⚠️ ERRORES COMUNES:
 *
 * 1. DEMASIADOS TYPE PARAMETERS:
 *    ❌ <T, U, V, W, X, Y, Z>
 *    ✅ Máximo 3-4
 *
 * 2. NO USAR CONSTRAINTS:
 *    ❌ function fn<T>(obj: T)
 *    ✅ function fn<T extends object>(obj: T)
 *
 * 3. GENÉRICOS INNECESARIOS:
 *    ❌ function add<T extends number>(a: T, b: T)
 *    ✅ function add(a: number, b: number)
 *
 * 4. OLVIDAR RETURN TYPE:
 *    ❌ function fn<T>(x: T) { return x; } // infiere any
 *    ✅ function fn<T>(x: T): T { return x; }
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre genéricos y 'any'?
 *    Pista: any pierde tipo, genéricos lo preservan
 *
 * 2. ¿Cuándo usar genéricos vs union types?
 *    Pista: Genéricos para reutilización, unions para alternativas
 *
 * 3. ¿Cómo funcionan los genéricos en runtime?
 *    Pista: Type erasure - desaparecen en JavaScript
 *
 * 4. ¿Qué son higher-kinded types y TypeScript los soporta?
 *    Pista: No nativamente, pero hay workarounds
 *
 * 5. ¿Cómo hacer un genérico que acepte solo ciertos tipos?
 *    Pista: Constraints con extends
 *
 * 6. ¿Qué es variance y cómo afecta a genéricos?
 *    Pista: Covariance, contravariance, invariance
 *
 * 7. ¿Puedes tener genéricos recursivos?
 *    Pista: Sí, útil para árboles y estructuras recursivas
 *
 * 8. ¿Cómo inferir tipos de retorno de funciones genéricas?
 *    Pista: ReturnType<typeof fn>
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea función genérica groupBy<T, K>:
 *    - Agrupa array por propiedad
 *    - Input: T[], keySelector: (item: T) => K
 *    - Output: Map<K, T[]>
 *
 * 2. INTERMEDIO:
 *    Implementa clase Cache<K, V> con:
 *    - TTL (time to live)
 *    - Max size
 *    - LRU eviction
 *    - Type-safe get/set
 *
 * 3. AVANZADO:
 *    Crea sistema de Query Builder:
 *    - class QueryBuilder<T>
 *    - Métodos: where, orderBy, limit, select
 *    - Type-safe field selection
 *    - Fluent API
 *
 * 4. EXPERTO:
 *    Implementa Option/Maybe monad:
 *    - class Option<T>
 *    - Some(value) y None
 *    - Métodos: map, flatMap, filter, match
 *    - Type-safe unwrapping
 *    - Composición de operaciones
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Domina los genéricos!");
console.log("=".repeat(60));

export {
  wrapInArray,
  getFirstAndLast,
  map,
  paginate,
  ApiResponse,
  Repository,
  Result,
  getProperty,
  pluck,
  merge,
  List,
  CrudRepository,
  PaymentRepository,
  KeyValueStore,
  InMemoryStore,
  EventEmitter,
  PaymentEventEmitter,
};
