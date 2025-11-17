/**
 * ==========================================
 * TYPE ALIASES, UNION Y INTERSECTION TYPES
 * ==========================================
 *
 * Type aliases permiten crear nombres para tipos complejos.
 * Unions e Intersections permiten combinar tipos.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Type alias: Dar nombre a cualquier tipo
 * - Union (|): "O" - valor puede ser uno de varios tipos
 * - Intersection (&): "Y" - valor debe cumplir múltiples tipos
 * - Literal types: Valores exactos como tipos
 * - Discriminated unions: Unions con campo discriminador
 *
 * 🏢 USO EN BIG TECH:
 * Stripe API usa extensivamente:
 * - Unions: PaymentMethod = Card | BankAccount | Wallet
 * - Intersections: Response extends Base & { data: T }
 * - Discriminated unions: Event types con "type" field
 * - Literal types: Status = "pending" | "succeeded" | "failed"
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Expresividad: Modelar dominios complejos
 * - Type safety: El compilador entiende las variantes
 * - Refactoring: Cambios centralizados
 * - Documentación: Los tipos explican el dominio
 */

// ============================================
// TYPE ALIASES: Nombrar tipos
// ============================================

/**
 * 🔑 CONCEPTO: Type alias
 *
 * Dar un nombre a un tipo (simple o complejo)
 *
 * SINTAXIS: type AliasName = Type
 */

// Alias para primitivos (menos común pero válido)
type CustomerId = string;
type Amount = number;
type Currency = string;

// Alias para objetos
type PaymentRequest = {
  amount: Amount;
  currency: Currency;
  customerId: CustomerId;
  description: string;
};

// Alias para funciones
type PaymentProcessor = (request: PaymentRequest) => Promise<PaymentResponse>;

// Alias para arrays
type TransactionList = Transaction[];

// Alias para tuplas
type Coordinates = [latitude: number, longitude: number];

/**
 * Función: Procesar pago usando type aliases
 */
async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simular procesamiento
  return {
    success: true,
    transactionId: `txn_${Date.now()}`,
    amount: request.amount,
  };
}

// ============================================
// LITERAL TYPES: Valores exactos como tipos
// ============================================

/**
 * 🔑 CONCEPTO: Literal types
 *
 * El tipo ES el valor exacto
 *
 * 🏢 BIG TECH: Stripe usa esto para estados, tipos de eventos, etc.
 */

// Literal type de string
type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded";

// Literal type de number
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;

// Literal type de boolean (menos útil)
type IsTrue = true;

/**
 * Interface con literal types
 */
interface Transaction {
  id: string;
  amount: number;
  status: PaymentStatus; // Solo puede ser uno de los valores del literal
  timestamp: number;
}

/**
 * Función: Actualizar estado de transacción
 *
 * @param transaction - Transacción
 * @param newStatus - Nuevo estado (type-safe)
 *
 * 🔑 CONCEPTO: El parámetro solo acepta valores válidos
 */
function updateTransactionStatus(
  transaction: Transaction,
  newStatus: PaymentStatus
): void {
  transaction.status = newStatus;
  // Solo puede asignar: "pending" | "processing" | "succeeded" | "failed" | "refunded"
  // Cualquier otro string da error
}

// Uso
const txn: Transaction = {
  id: "txn_123",
  amount: 2999,
  status: "pending", // ✅ Válido
  timestamp: Date.now(),
};

updateTransactionStatus(txn, "succeeded"); // ✅ Válido
// updateTransactionStatus(txn, "invalid"); // ❌ Error

// ============================================
// UNION TYPES: "O" lógico
// ============================================

/**
 * 🔑 CONCEPTO: Union types (|)
 *
 * Un valor puede ser uno de varios tipos
 *
 * SINTAXIS: Type1 | Type2 | Type3
 *
 * 🏢 BIG TECH: Modelar variantes (PayPal, Stripe, Cash)
 */

/**
 * EJEMPLO 1: Union de primitivos
 */
type PaymentAmount = number | "pending"; // Puede ser número o "pending"

function displayAmount(amount: PaymentAmount): string {
  // Type narrowing con typeof
  if (typeof amount === "number") {
    // Aquí TypeScript sabe que amount es number
    return `$${(amount / 100).toFixed(2)}`;
  } else {
    // Aquí TypeScript sabe que amount es "pending"
    return "Amount pending";
  }
}

/**
 * EJEMPLO 2: Union de interfaces
 *
 * 💰 BILLING: Diferentes métodos de pago tienen diferentes estructuras
 */
interface CardPayment {
  type: "card";
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
}

interface BankTransferPayment {
  type: "bank_transfer";
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
}

interface WalletPayment {
  type: "wallet";
  walletProvider: "apple_pay" | "google_pay" | "paypal";
  walletToken: string;
}

// Union type: Puede ser cualquiera de los tres
type PaymentMethod = CardPayment | BankTransferPayment | WalletPayment;

/**
 * Función: Procesar diferentes métodos de pago
 *
 * @param method - Método de pago (union type)
 *
 * 🔑 CONCEPTO: Type narrowing con discriminated union
 */
function processPaymentMethod(method: PaymentMethod): void {
  // Discriminated union: usamos 'type' para distinguir
  switch (method.type) {
    case "card":
      // Aquí TypeScript sabe que method es CardPayment
      console.log(`Processing card ending in ${method.cardNumber.slice(-4)}`);
      // Solo podemos acceder a propiedades de CardPayment
      break;

    case "bank_transfer":
      // Aquí TypeScript sabe que method es BankTransferPayment
      console.log(`Processing transfer for ${method.accountHolderName}`);
      break;

    case "wallet":
      // Aquí TypeScript sabe que method es WalletPayment
      console.log(`Processing ${method.walletProvider} payment`);
      break;

    default:
      // Exhaustive check
      const _exhaustive: never = method;
      throw new Error(`Unhandled payment method: ${_exhaustive}`);
  }
}

/**
 * EJEMPLO 3: Union para retorno de funciones
 *
 * 🏢 BIG TECH: APIs pueden retornar success o error
 */
type PaymentResponse =
  | { success: true; transactionId: string; amount: number }
  | { success: false; errorCode: string; errorMessage: string };

async function attemptPayment(amount: number): Promise<PaymentResponse> {
  // Simular procesamiento
  const success = Math.random() > 0.3;

  if (success) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      amount,
    };
  } else {
    return {
      success: false,
      errorCode: "card_declined",
      errorMessage: "Card was declined",
    };
  }
}

/**
 * Función: Manejar respuesta
 */
async function handlePaymentResponse(): Promise<void> {
  const response = await attemptPayment(2999);

  // Type narrowing con 'success' discriminator
  if (response.success) {
    // Aquí response tiene transactionId y amount
    console.log(`✅ Payment successful: ${response.transactionId}`);
    console.log(`Amount: $${response.amount / 100}`);
  } else {
    // Aquí response tiene errorCode y errorMessage
    console.log(`❌ Payment failed: ${response.errorMessage}`);
    console.log(`Error code: ${response.errorCode}`);
  }
}

// ============================================
// INTERSECTION TYPES: "Y" lógico
// ============================================

/**
 * 🔑 CONCEPTO: Intersection types (&)
 *
 * Un valor debe cumplir TODOS los tipos
 *
 * SINTAXIS: Type1 & Type2 & Type3
 *
 * 🏢 BIG TECH: Combinar capacidades (mixins, composition)
 */

/**
 * EJEMPLO 1: Intersección de tipos simples
 */
interface Identifiable {
  id: string;
}

interface Timestamped {
  createdAt: number;
  updatedAt: number;
}

interface Deletable {
  deleted: boolean;
  deletedAt?: number;
}

// Intersection: Debe cumplir los tres tipos
type Entity = Identifiable & Timestamped & Deletable;

const user: Entity = {
  // Debe tener TODAS las propiedades
  id: "user_123",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deleted: false,
  // deletedAt es opcional
};

/**
 * EJEMPLO 2: Intersection para extender
 *
 * 💰 BILLING: Agregar metadata a entidades base
 */
type WithMetadata<T> = T & {
  metadata: Record<string, string | number>;
};

interface BasePayment {
  id: string;
  amount: number;
  currency: string;
}

// Payment con metadata
type PaymentWithMetadata = WithMetadata<BasePayment>;

const payment: PaymentWithMetadata = {
  id: "pay_123",
  amount: 2999,
  currency: "USD",
  metadata: {
    orderId: "ord_456",
    customField: "value",
  },
};

/**
 * EJEMPLO 3: Intersection de funciones
 *
 * 🏢 BIG TECH: Mixins pattern
 */
type Logger = {
  log(message: string): void;
};

type Validator = {
  validate(): boolean;
};

type Processor = {
  process(): void;
};

// Intersection: Debe implementar los tres
type PaymentService = Logger & Validator & Processor;

const service: PaymentService = {
  log(message: string): void {
    console.log(`[PaymentService] ${message}`);
  },
  validate(): boolean {
    return true;
  },
  process(): void {
    this.log("Processing payment");
    if (this.validate()) {
      this.log("Payment processed");
    }
  },
};

// ============================================
// UNION vs INTERSECTION: Diferencias clave
// ============================================

/**
 * 🔑 CONCEPTO CRÍTICO: Union vs Intersection
 *
 * UNION (|): "O"
 * - Valor puede ser UNO de los tipos
 * - Más flexible, menos restrictivo
 * - Solo puedes acceder a propiedades comunes (sin narrowing)
 *
 * INTERSECTION (&): "Y"
 * - Valor debe ser TODOS los tipos
 * - Más restrictivo, más completo
 * - Puedes acceder a todas las propiedades
 */

interface Cat {
  meow(): void;
  purr(): void;
}

interface Dog {
  bark(): void;
  wagTail(): void;
}

// Union: Puede ser Cat O Dog
type Pet = Cat | Dog;

function handlePet(pet: Pet): void {
  // Solo puedes acceder a propiedades comunes
  // pet.meow(); // ❌ Error - Dog no tiene meow
  // pet.bark(); // ❌ Error - Cat no tiene bark

  // Necesitas narrowing
  if ("meow" in pet) {
    pet.meow(); // ✅ OK - sabemos que es Cat
    pet.purr();
  } else {
    pet.bark(); // ✅ OK - sabemos que es Dog
    pet.wagTail();
  }
}

// Intersection: Debe ser Cat Y Dog
type Chimera = Cat & Dog;

function handleChimera(chimera: Chimera): void {
  // Puedes acceder a TODAS las propiedades
  chimera.meow(); // ✅ OK
  chimera.bark(); // ✅ OK
  chimera.purr(); // ✅ OK
  chimera.wagTail(); // ✅ OK
}

// ============================================
// ADVANCED: Conditional Types con Unions
// ============================================

/**
 * 🔑 CONCEPTO: Extract y Exclude con unions
 *
 * 🏢 BIG TECH: Filtrar tipos de unions grandes
 */

type AllPaymentMethods = CardPayment | BankTransferPayment | WalletPayment;

// Extract: Obtener solo wallets
type OnlyWallets = Extract<AllPaymentMethods, { type: "wallet" }>;
// Resultado: WalletPayment

// Exclude: Remover wallets
type NoWallets = Exclude<AllPaymentMethods, { type: "wallet" }>;
// Resultado: CardPayment | BankTransferPayment

/**
 * EJEMPLO: Procesar solo ciertos tipos
 */
function processOnlyCards(
  method: Extract<AllPaymentMethods, { type: "card" }>
): void {
  // method es garantizado CardPayment
  console.log(`Card: ${method.cardNumber}`);
  // No necesitamos narrowing
}

// ============================================
// ADVANCED: Mapped Types con Intersections
// ============================================

/**
 * 🔑 CONCEPTO: Agregar propiedades a todos los tipos
 */

// Hacer todas las propiedades opcionales
type PartialPayment = Partial<BasePayment>;

// Hacer todas las propiedades required
type RequiredPayment = Required<PartialPayment>;

// Hacer todas las propiedades readonly
type ReadonlyPayment = Readonly<BasePayment>;

// Pick: Seleccionar propiedades
type PaymentIdAndAmount = Pick<BasePayment, "id" | "amount">;

// Omit: Excluir propiedades
type PaymentWithoutCurrency = Omit<BasePayment, "currency">;

/**
 * EJEMPLO PRÁCTICO: Update DTO
 *
 * 💰 BILLING: Partial para updates (no todas las propiedades requeridas)
 */
interface Payment {
  readonly id: string;
  amount: number;
  currency: string;
  description: string;
  status: PaymentStatus;
}

// Para crear: Omitir id (se genera), status (se asigna)
type CreatePaymentDTO = Omit<Payment, "id" | "status">;

// Para actualizar: Todo opcional excepto id
type UpdatePaymentDTO = Partial<Omit<Payment, "id">> & Pick<Payment, "id">;

function updatePayment(dto: UpdatePaymentDTO): void {
  // dto.id es required
  // dto.amount, currency, description, status son opcionales
  console.log(`Updating payment ${dto.id}`);
  if (dto.amount !== undefined) {
    console.log(`New amount: ${dto.amount}`);
  }
}

// ============================================
// DEMOSTRACIÓN: Uso práctico
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Type Aliases, Unions, Intersections");
console.log("=".repeat(60));

// LITERAL TYPES
console.log("\n📝 LITERAL TYPES - Estados válidos:");
const transaction: Transaction = {
  id: "txn_001",
  amount: 2999,
  status: "pending",
  timestamp: Date.now(),
};
console.log(`Transaction: ${transaction.id} - ${transaction.status}`);
updateTransactionStatus(transaction, "succeeded");
console.log(`Updated status: ${transaction.status}`);

// UNION TYPES
console.log("\n🔀 UNION TYPES - Diferentes métodos de pago:");
const cardMethod: PaymentMethod = {
  type: "card",
  cardNumber: "4242424242424242",
  expiryMonth: 12,
  expiryYear: 2025,
  cvc: "123",
};
processPaymentMethod(cardMethod);

const walletMethod: PaymentMethod = {
  type: "wallet",
  walletProvider: "apple_pay",
  walletToken: "tok_abc123",
};
processPaymentMethod(walletMethod);

// DISCRIMINATED UNIONS
console.log("\n✅ DISCRIMINATED UNIONS - Respuestas tipo-seguras:");
handlePaymentResponse();

// INTERSECTION TYPES
console.log("\n🔗 INTERSECTION TYPES - Combinar capacidades:");
console.log(`Entity ID: ${user.id}`);
console.log(`Created: ${new Date(user.createdAt).toLocaleString()}`);
console.log(`Deleted: ${user.deleted}`);

// MIXINS
console.log("\n🎭 MIXINS - Múltiples capacidades:");
service.process();

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. PAYMENT METHODS (Union):
 *    type PaymentMethod = Card | BankAccount | Wallet | Crypto
 *    - Discriminated union con "type" field
 *    - Type-safe processing según método
 *
 * 2. API RESPONSES (Union):
 *    type Result<T> = Success<T> | Error
 *    - Pattern Result para manejar success/failure
 *    - No usar exceptions para control de flujo
 *
 * 3. EVENT TYPES (Discriminated Union):
 *    type WebhookEvent = PaymentSucceeded | PaymentFailed | RefundCreated
 *    - Stripe usa esto extensivamente
 *    - Type-safe event handlers
 *
 * 4. ENTITY COMPOSITION (Intersection):
 *    type AuditedEntity = Entity & Timestamped & Deletable
 *    - Combinar concerns (audit, soft delete, etc.)
 *    - Mixins pattern
 *
 * 5. DTOs (Mapped Types):
 *    type CreateDTO = Omit<Entity, "id" | "createdAt">
 *    type UpdateDTO = Partial<Entity> & Pick<Entity, "id">
 *    - Diferentes shapes para diferentes operaciones
 *
 * 6. STATUS LITERALS (Literal Types):
 *    type InvoiceStatus = "draft" | "open" | "paid" | "void"
 *    - Exhaustive checking
 *    - No magic strings
 *
 * 7. METADATA (Intersection):
 *    type WithMetadata<T> = T & { metadata: Record<string, any> }
 *    - Agregar metadata custom a entidades
 */

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS");
console.log("=".repeat(60));

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. USA DISCRIMINATED UNIONS:
 *    ✅ Agrega campo "type" o "kind"
 *    - Permite exhaustive checking
 *    - Type narrowing automático
 *
 * 2. PREFIERE UNION PARA VARIANTES:
 *    ✅ type PaymentMethod = Card | Bank | Wallet
 *    - Representa "puede ser uno de estos"
 *
 * 3. USA INTERSECTION PARA COMPOSICIÓN:
 *    ✅ type Entity = Base & Timestamped & Deletable
 *    - Representa "debe tener todas estas propiedades"
 *
 * 4. LITERAL TYPES PARA ESTADOS:
 *    ✅ type Status = "pending" | "completed"
 *    ❌ status: string
 *
 * 5. UTILITY TYPES PARA DTOs:
 *    ✅ Partial, Pick, Omit
 *    - No duplicar definiciones
 *
 * 6. DOCUMENTA DISCRIMINATORS:
 *    // "type" field distinguishes payment methods
 *    type PaymentMethod = ...
 *
 * 7. EXHAUSTIVE CHECKING:
 *    default: const _: never = value
 *    - Garantiza manejar todos los casos
 *
 * ⚠️ ERRORES COMUNES:
 *
 * 1. CONFUNDIR UNION CON INTERSECTION:
 *    ❌ Cat & Dog (debe ser ambos - imposible)
 *    ✅ Cat | Dog (puede ser uno)
 *
 * 2. NO USAR DISCRIMINATED UNIONS:
 *    ❌ Unions sin campo discriminador
 *    ✅ Agregar "type" o "kind" field
 *
 * 3. INTERSECTION DE TIPOS INCOMPATIBLES:
 *    ❌ { x: string } & { x: number } = never
 *
 * 4. DEMASIADOS MEMBERS EN UNION:
 *    ❌ type Big = A | B | C | ... | Z (20+ types)
 *    ✅ Agrupar lógicamente
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Qué es el resultado de { x: string } & { x: number }?
 *    Pista: never (incompatible)
 *
 * 2. ¿Cuándo usarías type vs interface?
 *    Pista: Próximo ejercicio :)
 *
 * 3. ¿Cómo funcionan los utility types internamente?
 *    Pista: Mapped types y conditional types
 *
 * 4. ¿Qué es distributive conditional types?
 *    Pista: T extends U ? X : Y cuando T es union
 *
 * 5. ¿Puedes crear un union type de todos los values de un objeto?
 *    Pista: type Values = typeof obj[keyof typeof obj]
 *
 * 6. ¿Cómo harías exhaustive checking type-safe?
 *    Pista: default case con never
 *
 * 7. ¿Qué es branded types y cómo se relaciona con intersections?
 *    Pista: T & { __brand: "BrandName" }
 *
 * 8. ¿Puedes tener intersection de functions?
 *    Pista: Sí, resulta en overload
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea un discriminated union para diferentes tipos de notificaciones:
 *    - Email (to, subject, body)
 *    - SMS (phone, message)
 *    - Push (deviceId, title, body)
 *    Función que envíe según tipo
 *
 * 2. INTERMEDIO:
 *    Diseña un sistema de Result type:
 *    type Result<T, E> = Success<T> | Failure<E>
 *    Implementa funciones: map, flatMap, match
 *    Usa para operaciones que pueden fallar
 *
 * 3. AVANZADO:
 *    Crea un state machine con literal types:
 *    - Estados de un pedido
 *    - Transiciones válidas (no todas posibles)
 *    - Función transition type-safe
 *    - Exhaustive checking
 *
 * 4. EXPERTO:
 *    Implementa un sistema de permisos con branded types:
 *    - Brand different ID types (UserId, OrderId, etc.)
 *    - Prevent mixing IDs
 *    - Generic functions que preserven brands
 *    - Helper para crear branded values
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Domina unions e intersections!");
console.log("=".repeat(60));

export type {
  CustomerId,
  Amount,
  Currency,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  Transaction,
  PaymentAmount,
  CardPayment,
  BankTransferPayment,
  WalletPayment,
  PaymentMethod,
  Entity,
  PaymentWithMetadata,
  CreatePaymentDTO,
  UpdatePaymentDTO,
};

export {
  processPayment,
  updateTransactionStatus,
  displayAmount,
  processPaymentMethod,
  attemptPayment,
  handlePaymentResponse,
  updatePayment,
};
