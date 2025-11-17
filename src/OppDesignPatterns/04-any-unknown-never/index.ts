/**
 * ==========================================
 * ANY, UNKNOWN, NEVER EN TYPESCRIPT
 * ==========================================
 *
 * Estos son tipos especiales que manejan casos edge y situaciones complejas.
 * Son fundamentales para escribir código type-safe y robusto.
 *
 * 📚 CONCEPTOS CLAVE:
 * - any: "Apaga" el type checker (úsalo con cuidado)
 * - unknown: Tipo seguro para valores desconocidos
 * - never: Representa valores que nunca ocurren
 *
 * 🏢 USO EN BIG TECH:
 * Stripe, PayPal, Amazon usan estos tipos para:
 * - any: Migración gradual de JS a TS
 * - unknown: Datos de APIs externas, user input
 * - never: Exhaustive checking, throw functions
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - any: Flexibilidad vs seguridad
 * - unknown: Type-safe cuando no conoces el tipo
 * - never: Garantías del compilador sobre código inalcanzable
 */

// ============================================
// ANY: El tipo "escape hatch"
// ============================================

/**
 * 🔑 CONCEPTO: any
 *
 * - Permite cualquier valor
 * - Deshabilita el type checking
 * - Contagioso: propaga falta de tipos
 *
 * ⚠️ PELIGROS:
 * - Pierdes type safety
 * - No autocompletado
 * - Errores en runtime
 *
 * ✅ CUÁNDO USAR:
 * - Migración de JavaScript a TypeScript
 * - Integraciones con librerías sin tipos
 * - Prototipado rápido (temporal)
 * - Cuando literalmente CUALQUIER tipo es válido
 *
 * ❌ CUÁNDO NO USAR:
 * - Nuevo código TypeScript
 * - APIs públicas
 * - Código de producción (evitar)
 */

/**
 * EJEMPLO MALO: Uso incorrecto de any
 */
function processBadPayment(payment: any): any {
  // ❌ PROBLEMA: No tenemos type safety
  // El compilador no verifica nada
  // Cualquier typo pasa desapercibido

  // Estos errores NO son detectados en compilación:
  // console.log(payment.ammount); // typo: ammount vs amount
  // console.log(payment.processs()); // typo: processs vs process

  return payment.amount * 1.1; // ¿Está seguro de que amount existe?
}

/**
 * EJEMPLO: Uso legítimo de any (temporal)
 *
 * 🏢 BIG TECH: Durante migración de JS a TS
 */
interface LegacyPaymentResponse {
  // Durante migración, algunas partes aún son any
  // TODO: Tipar correctamente cuando tengamos la spec completa
  metadata: any; // Temporal - estructura desconocida de sistema legacy
}

/**
 * Función: Migración gradual
 *
 * @param response - Respuesta de sistema legacy
 *
 * 💡 PRÁCTICA: Marcar any con TODO para eventualmente tipar
 */
function handleLegacyPayment(response: LegacyPaymentResponse): void {
  // Tenemos que usar type assertion porque metadata es any
  const metadata = response.metadata as { customerId?: string };

  if (metadata.customerId) {
    console.log(`Customer: ${metadata.customerId}`);
  }
}

// ============================================
// UNKNOWN: El tipo seguro para desconocidos
// ============================================

/**
 * 🔑 CONCEPTO: unknown
 *
 * - Tipo top: puede contener cualquier valor
 * - Type-safe: requiere validación antes de usar
 * - Preferir sobre any
 *
 * ✅ VENTAJAS:
 * - Force type checking
 * - No permite operaciones sin validar
 * - Mejor que any en casi todos los casos
 *
 * 🏢 BIG TECH: Stripe usa unknown para webhook payloads
 */

/**
 * Función: Parsear respuesta de API externa
 *
 * @param response - Respuesta desconocida
 * @returns Datos parseados o null
 *
 * 💰 BILLING: APIs de procesadoras de pago (Stripe, PayPal, etc.)
 */
function parsePaymentResponse(response: unknown): {
  id: string;
  amount: number;
  status: string;
} | null {
  // unknown requiere validación ANTES de usar

  // Paso 1: Verificar que es un objeto
  if (typeof response !== "object" || response === null) {
    console.error("Respuesta inválida: no es un objeto");
    return null;
  }

  // Paso 2: Type guard para verificar estructura
  // Verificamos que tiene las propiedades necesarias
  if (
    !("id" in response) ||
    !("amount" in response) ||
    !("status" in response)
  ) {
    console.error("Respuesta inválida: faltan propiedades");
    return null;
  }

  // Paso 3: Verificar tipos de cada propiedad
  const candidate = response as Record<string, unknown>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.amount !== "number" ||
    typeof candidate.status !== "string"
  ) {
    console.error("Respuesta inválida: tipos incorrectos");
    return null;
  }

  // Ahora es seguro retornar
  return {
    id: candidate.id,
    amount: candidate.amount,
    status: candidate.status,
  };
}

/**
 * Función: Validar webhook de Stripe
 *
 * @param payload - Payload desconocido del webhook
 * @returns Evento validado o null
 *
 * 🏢 BIG TECH: Así maneja Stripe webhooks en su SDK
 */
interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      amount: number;
    };
  };
}

function validateWebhookPayload(payload: unknown): WebhookEvent | null {
  // unknown nos obliga a validar antes de usar

  // Validación básica de estructura
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const obj = payload as Record<string, unknown>;

  // Validar propiedades requeridas
  if (
    typeof obj.id !== "string" ||
    typeof obj.type !== "string" ||
    typeof obj.data !== "object" ||
    obj.data === null
  ) {
    return null;
  }

  const data = obj.data as Record<string, unknown>;
  if (typeof data.object !== "object" || data.object === null) {
    return null;
  }

  const eventObject = data.object as Record<string, unknown>;
  if (
    typeof eventObject.id !== "string" ||
    typeof eventObject.amount !== "number"
  ) {
    return null;
  }

  // Ahora podemos retornar con confianza
  return payload as WebhookEvent;
}

/**
 * Type Guard: Verificar si unknown es un error
 *
 * @param value - Valor desconocido
 * @returns true si es Error
 *
 * 🔑 CONCEPTO: Type guards con unknown
 */
function isError(value: unknown): value is Error {
  return (
    value instanceof Error ||
    (typeof value === "object" &&
      value !== null &&
      "message" in value &&
      typeof (value as Record<string, unknown>).message === "string")
  );
}

/**
 * Función: Manejar error desconocido
 *
 * @param error - Error de tipo unknown (catch block)
 *
 * 💡 PRÁCTICA: En catch blocks, el error es unknown (TS 4.4+)
 */
function handlePaymentError(error: unknown): string {
  // unknown en catch block - debemos validar tipo

  if (isError(error)) {
    // Ahora sabemos que es Error
    return `Payment error: ${error.message}`;
  }

  if (typeof error === "string") {
    // Es un string
    return `Payment error: ${error}`;
  }

  // Caso genérico
  return "Unknown payment error occurred";
}

/**
 * Ejemplo: try-catch con unknown
 */
function processPaymentSafely(amount: number): void {
  try {
    if (amount < 0) {
      throw new Error("Amount must be positive");
    }
    if (amount > 1000000) {
      throw "Amount too large"; // Throw string (mala práctica pero posible)
    }
    // Process payment...
  } catch (error: unknown) {
    // error es unknown - type-safe!
    const message = handlePaymentError(error);
    console.error(message);
  }
}

// ============================================
// NEVER: El tipo "imposible"
// ============================================

/**
 * 🔑 CONCEPTO: never
 *
 * - Tipo bottom: no tiene valores posibles
 * - Representa código que nunca retorna
 * - Útil para exhaustive checking
 *
 * CASOS DE USO:
 * - Funciones que siempre lanzan error
 * - Funciones con loops infinitos
 * - Exhaustive checking en switches
 * - Union types imposibles
 *
 * 🏢 BIG TECH: Usado para garantías del compilador
 */

/**
 * Función: Lanzar error (nunca retorna)
 *
 * @param message - Mensaje de error
 * @returns never - esta función nunca retorna normalmente
 *
 * 💡 PRÁCTICA: Funciones que siempre lanzan tienen tipo never
 */
function throwPaymentError(message: string): never {
  // never indica que esta función NUNCA retorna
  // Siempre lanza una excepción
  throw new Error(`Payment Error: ${message}`);
}

/**
 * Función: Loop infinito (nunca retorna)
 *
 * @returns never
 *
 * 🏢 BIG TECH: Workers que procesan colas infinitamente
 */
function processPaymentQueueForever(): never {
  // Loop infinito - nunca retorna
  while (true) {
    // Procesar cola...
    console.log("Processing payment queue...");
    // Esta función nunca termina
  }
}

/**
 * PATRÓN CRÍTICO: Exhaustive checking
 *
 * 🏢 BIG TECH: Garantizar que manejamos todos los casos
 */
enum PaymentMethod {
  Card = "card",
  BankTransfer = "bank_transfer",
  Cash = "cash",
}

/**
 * Función: Procesar pago según método (exhaustive)
 *
 * @param method - Método de pago
 * @returns Resultado
 *
 * 💡 PRÁCTICA: never garantiza que cubramos todos los casos
 */
function processPaymentByMethod(method: PaymentMethod): string {
  switch (method) {
    case PaymentMethod.Card:
      return "Processing card payment";

    case PaymentMethod.BankTransfer:
      return "Processing bank transfer";

    case PaymentMethod.Cash:
      return "Processing cash payment";

    default:
      // Si llegamos aquí, olvidamos un caso
      // never nos obliga a manejar TODOS los valores del enum
      const exhaustiveCheck: never = method;
      return throwPaymentError(`Unhandled payment method: ${exhaustiveCheck}`);
  }
}

/**
 * EJEMPLO: Qué pasa si agregamos un nuevo método
 *
 * Si agregamos: Crypto = "crypto" al enum,
 * el switch anterior dará ERROR de compilación
 * porque method ya no puede ser asignado a never
 *
 * Esto GARANTIZA que actualicemos el código
 */

/**
 * Type helper: Extraer tipo never de union
 */
type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * EJEMPLO: never en conditional types
 */
type PaymentResult =
  | { success: true; transactionId: string }
  | { success: false; error: string };

// Extraer solo los casos exitosos
type SuccessResult = Extract<PaymentResult, { success: true }>;

// Excluir casos fallidos
type OnlySuccess<T> = T extends { success: false } ? never : T;

/**
 * Función: Asegurar pago exitoso
 *
 * @param result - Resultado del pago
 * @returns ID de transacción o lanza error
 */
function assertPaymentSuccess(result: PaymentResult): string {
  if (!result.success) {
    // Lanzar error (tipo never)
    throwPaymentError(result.error);
  }
  // TypeScript sabe que aquí result.success === true
  return result.transactionId;
}

// ============================================
// COMPARACIÓN: any vs unknown vs never
// ============================================

/**
 * TABLA COMPARATIVA:
 *
 * | Tipo    | Valores         | Asignable a otros | Requiere validación |
 * |---------|-----------------|-------------------|---------------------|
 * | any     | Cualquiera      | Sí (todos)        | No                  |
 * | unknown | Cualquiera      | Solo unknown/any  | Sí                  |
 * | never   | Ninguno         | Sí (todos)        | N/A                 |
 *
 * JERARQUÍA:
 * never ⊆ [todos los tipos] ⊆ unknown ⊆ any
 *
 * any: "Top loose" - acepta todo, se asigna a todo (inseguro)
 * unknown: "Top safe" - acepta todo, requiere validación
 * never: "Bottom" - no acepta nada, se asigna a todo
 */

// ============================================
// DEMOSTRACIÓN: Uso práctico
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: any, unknown, never");
console.log("=".repeat(60));

// UNKNOWN: Parsear respuesta de API
console.log("\n🔍 UNKNOWN - Validación segura:");
const mockResponse: unknown = {
  id: "pay_123",
  amount: 2999,
  status: "succeeded",
};

const parsed = parsePaymentResponse(mockResponse);
if (parsed) {
  console.log(`✅ Respuesta válida: ${parsed.id} - $${parsed.amount / 100}`);
} else {
  console.log("❌ Respuesta inválida");
}

// UNKNOWN: Webhook validation
console.log("\n🔗 UNKNOWN - Validación de webhook:");
const webhookPayload: unknown = {
  id: "evt_123",
  type: "payment.succeeded",
  data: {
    object: {
      id: "pay_456",
      amount: 5000,
    },
  },
};

const event = validateWebhookPayload(webhookPayload);
if (event) {
  console.log(`✅ Webhook válido: ${event.type}`);
} else {
  console.log("❌ Webhook inválido");
}

// UNKNOWN: Error handling
console.log("\n⚠️ UNKNOWN - Manejo de errores:");
processPaymentSafely(-100); // Lanza Error
processPaymentSafely(2000000); // Lanza string

// NEVER: Exhaustive checking
console.log("\n✔️ NEVER - Exhaustive checking:");
const methods: PaymentMethod[] = [
  PaymentMethod.Card,
  PaymentMethod.BankTransfer,
  PaymentMethod.Cash,
];

methods.forEach((method) => {
  console.log(`  ${method}: ${processPaymentByMethod(method)}`);
});

// NEVER: Assert success
console.log("\n✅ NEVER - Assert success:");
const successResult: PaymentResult = {
  success: true,
  transactionId: "txn_789",
};
const txnId = assertPaymentSuccess(successResult);
console.log(`Transaction ID: ${txnId}`);

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. UNKNOWN - APIs EXTERNAS:
 *    - Webhooks de procesadoras (Stripe, PayPal)
 *    - Respuestas de gateways de pago
 *    - User input (formularios)
 *    - Datos de third-party integrations
 *
 * 2. UNKNOWN - VALIDACIÓN DE DATOS:
 *    - JSON.parse() retorna unknown
 *    - Request bodies en APIs
 *    - Environment variables
 *    - Config files
 *
 * 3. NEVER - EXHAUSTIVE CHECKING:
 *    - Payment methods (asegurar cubrir todos)
 *    - Invoice statuses (garantizar transiciones válidas)
 *    - Refund types (manejar todos los casos)
 *
 * 4. NEVER - ERROR HANDLING:
 *    - Funciones que siempre fallan
 *    - Validaciones críticas
 *    - Circuit breakers
 *
 * 5. ANY - MIGRACIÓN (TEMPORAL):
 *    - Legacy code migration
 *    - Third-party libs sin tipos
 *    - Prototipado rápido
 */

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS");
console.log("=".repeat(60));

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. PREFERIR unknown SOBRE any:
 *    ✅ function parse(input: unknown)
 *    ❌ function parse(input: any)
 *
 * 2. VALIDAR unknown ANTES DE USAR:
 *    - Type guards
 *    - Type assertions solo después de validar
 *    - Librerías de validación (zod, io-ts)
 *
 * 3. USAR never PARA EXHAUSTIVE CHECKING:
 *    - En switch statements
 *    - Garantiza que cubrimos todos los casos
 *
 * 4. MARCAR any CON TODO:
 *    // TODO: Tipar correctamente
 *    metadata: any
 *
 * 5. ENABLE strict FLAGS:
 *    - strictNullChecks
 *    - noImplicitAny
 *    - useUnknownInCatchVariables
 *
 * 6. DOCUMENTAR POR QUÉ USAS any:
 *    // any: Legacy system - estructura desconocida
 *    // any: Third-party lib sin tipos
 *
 * ⚠️ ERRORES COMUNES:
 *
 * 1. USAR any POR DEFAULT:
 *    ❌ "No sé el tipo, uso any"
 *    ✅ "No sé el tipo, uso unknown y valido"
 *
 * 2. NO VALIDAR unknown:
 *    ❌ const x = value as MyType // sin validar
 *    ✅ Validar primero, assert después
 *
 * 3. OLVIDAR default EN SWITCH:
 *    ❌ switch sin default
 *    ✅ default con never para exhaustive check
 *
 * 4. TYPE ASSERTION SIN VALIDACIÓN:
 *    ❌ const x = unknownValue as MyType
 *    ✅ Validar primero con type guards
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Por qué unknown es más seguro que any?
 *    Pista: ¿Qué operaciones permite cada uno?
 *
 * 2. ¿Cuándo es legítimo usar any?
 *    Pista: Migración, libs sin tipos, casos extremos
 *
 * 3. ¿Cómo se comporta never en unions?
 *    Pista: string | never = ?
 *
 * 4. ¿Qué pasa si una función tiene tipo de retorno never pero retorna algo?
 *    Pista: Error de compilación
 *
 * 5. ¿Cómo validarías un objeto complejo de tipo unknown?
 *    Pista: Librerías como zod, io-ts, class-validator
 *
 * 6. ¿Qué es el "type narrowing" con unknown?
 *    Pista: Type guards y control flow analysis
 *
 * 7. ¿Cuál es la diferencia entre void y never?
 *    Pista: void retorna (undefined), never NO retorna
 *
 * 8. ¿Cómo usarías never para crear tipos imposibles?
 *    Pista: Conditional types, branded types
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea una función type guard que valide si unknown es un Payment
 *    isPayment(value: unknown): value is Payment
 *
 * 2. INTERMEDIO:
 *    Implementa un parser robusto para webhook payloads:
 *    - Valida estructura completa
 *    - Maneja errores descriptivos
 *    - Usa unknown como input
 *
 * 3. AVANZADO:
 *    Crea un sistema de validación genérico:
 *    - Schema definition
 *    - Runtime validation de unknown
 *    - Type inference
 *    - Mensajes de error útiles
 *
 * 4. EXPERTO:
 *    Implementa un type-safe event system:
 *    - Eventos tipados
 *    - Payloads validados (unknown -> tipo)
 *    - Exhaustive checking en handlers
 *    - Type inference para listeners
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Domina estos tipos especiales!");
console.log("=".repeat(60));

export {
  parsePaymentResponse,
  validateWebhookPayload,
  isError,
  handlePaymentError,
  processPaymentSafely,
  throwPaymentError,
  processPaymentByMethod,
  assertPaymentSuccess,
  PaymentMethod,
  WebhookEvent,
  PaymentResult,
};
