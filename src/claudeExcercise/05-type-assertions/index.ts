/**
 * ==========================================
 * TYPE ASSERTIONS EN TYPESCRIPT
 * ==========================================
 *
 * Type Assertions permiten "decirle" al compilador el tipo de un valor
 * cuando tú sabes más que el compilador.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Assertion: value as Type
 * - Angle bracket: <Type>value (evitar en JSX)
 * - Non-null assertion: value!
 * - Const assertion: as const
 *
 * 🏢 USO EN BIG TECH:
 * Stripe, PayPal, Amazon usan assertions para:
 * - DOM manipulation
 * - API responses con tipos conocidos
 * - Migración gradual de JavaScript
 * - Trabajar con tipos complejos
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - A veces sabes más que el compilador
 * - Útil con librerías externas
 * - Critical para migraciones
 * - PELIGRO: Puedes estar equivocado
 *
 * ⚠️ ADVERTENCIA CRÍTICA:
 * Type assertions NO validan en runtime
 * Solo "engañan" al compilador
 * Si te equivocas, tendrás errores en runtime
 */

// ============================================
// SINTAXIS: as vs angle bracket
// ============================================

/**
 * 🔑 CONCEPTO: Dos sintaxis para assertions
 *
 * 1. as Type (recomendada)
 * 2. <Type>value (evitar en .tsx files)
 */

/**
 * Ejemplo: Parsear JSON de API de pagos
 */
interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
}

/**
 * Función: Parsear respuesta de API
 *
 * @param jsonString - JSON string
 * @returns Respuesta parseada
 *
 * 💡 PRÁCTICA: JSON.parse() retorna 'any' (o 'unknown' con strict mode)
 */
function parsePaymentResponse(jsonString: string): PaymentResponse {
  // JSON.parse() retorna any/unknown
  // Usamos assertion porque SABEMOS la estructura
  const parsed = JSON.parse(jsonString);

  // Sintaxis 1: 'as Type' (RECOMENDADA)
  return parsed as PaymentResponse;

  // Sintaxis 2: '<Type>value' (evitar en .tsx)
  // return <PaymentResponse>parsed;
}

/**
 * ⚠️ PELIGRO: La assertion NO valida
 *
 * Si el JSON no tiene la estructura esperada,
 * NO habrá error de compilación pero SÍ error en runtime
 */

/**
 * MEJOR PRÁCTICA: Validar antes de assert
 */
function parsePaymentResponseSafe(jsonString: string): PaymentResponse | null {
  try {
    const parsed = JSON.parse(jsonString);

    // Validar estructura ANTES de assertion
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.id === "string" &&
      typeof parsed.amount === "number" &&
      typeof parsed.currency === "string" &&
      ["pending", "succeeded", "failed"].includes(parsed.status)
    ) {
      // Ahora es seguro hacer assertion
      return parsed as PaymentResponse;
    }

    return null;
  } catch {
    return null;
  }
}

// ============================================
// NON-NULL ASSERTION: !
// ============================================

/**
 * 🔑 CONCEPTO: Non-null assertion operator (!)
 *
 * Le dice al compilador: "Confía en mí, esto no es null/undefined"
 *
 * SINTAXIS: value!
 *
 * ⚠️ PELIGRO: Si te equivocas, runtime error garantizado
 */

/**
 * Ejemplo: Obtener elemento del DOM (en navegador)
 */
interface PaymentForm {
  amount: string;
  currency: string;
  method: string;
}

/**
 * Función: Obtener datos de formulario de pago
 *
 * @returns Datos del formulario
 *
 * 🏢 BIG TECH: Stripe Elements hace esto en su checkout
 */
function getPaymentFormData(): PaymentForm {
  // getElementById retorna HTMLElement | null
  // Usamos ! porque SABEMOS que el elemento existe

  // ❌ SIN assertion: error de compilación
  // const amountInput = document.getElementById("amount");
  // const value = amountInput.value; // Error: amountInput puede ser null

  // ✅ CON assertion: le decimos que no es null
  const amountInput = document.getElementById("amount")! as HTMLInputElement;
  const currencyInput = document.getElementById("currency")! as HTMLInputElement;
  const methodInput = document.getElementById("method")! as HTMLInputElement;

  return {
    amount: amountInput.value,
    currency: currencyInput.value,
    method: methodInput.value,
  };
}

/**
 * MEJOR PRÁCTICA: Validar en vez de assert
 */
function getPaymentFormDataSafe(): PaymentForm | null {
  // Obtener elementos SIN assertion
  const amountInput = document.getElementById("amount");
  const currencyInput = document.getElementById("currency");
  const methodInput = document.getElementById("method");

  // Validar que existen
  if (!amountInput || !currencyInput || !methodInput) {
    console.error("Formulario incompleto");
    return null;
  }

  // Ahora es seguro hacer assertion
  return {
    amount: (amountInput as HTMLInputElement).value,
    currency: (currencyInput as HTMLInputElement).value,
    method: (methodInput as HTMLInputElement).value,
  };
}

// ============================================
// CONST ASSERTION: as const
// ============================================

/**
 * 🔑 CONCEPTO: const assertion
 *
 * Hace que:
 * - Propiedades sean readonly
 * - Arrays sean tuplas readonly
 * - Literals sean tipos exactos (no widening)
 *
 * SINTAXIS: value as const
 *
 * 🏢 BIG TECH: Configuraciones, constantes, lookup tables
 */

/**
 * EJEMPLO 1: Array normal vs as const
 */

// Array normal: tipo string[]
const paymentMethods = ["card", "bank_transfer", "cash"];
// paymentMethods[0] tiene tipo 'string'
// Puede mutar: paymentMethods.push("crypto")

// Array con as const: tupla readonly de literals
const paymentMethodsConst = ["card", "bank_transfer", "cash"] as const;
// paymentMethodsConst[0] tiene tipo 'card'
// NO puede mutar: paymentMethodsConst.push() // Error

/**
 * EJEMPLO 2: Objeto normal vs as const
 */

// Objeto normal
const config = {
  apiKey: "pk_test_123",
  apiVersion: "2023-10-16",
  maxRetries: 3,
};
// config.apiKey tiene tipo 'string'
// Puede mutar: config.apiKey = "nueva_key"

// Objeto con as const
const configConst = {
  apiKey: "pk_test_123",
  apiVersion: "2023-10-16",
  maxRetries: 3,
} as const;
// configConst.apiKey tiene tipo 'pk_test_123' (literal)
// NO puede mutar: configConst.apiKey = "x" // Error

/**
 * USO PRÁCTICO: Configuración de procesadoras de pago
 *
 * 💰 BILLING: Diferentes configs para dev/staging/prod
 */
const STRIPE_CONFIG = {
  development: {
    publishableKey: "pk_test_123",
    secretKey: "sk_test_456",
    webhookSecret: "whsec_test_789",
  },
  production: {
    publishableKey: "pk_live_abc",
    secretKey: "sk_live_def",
    webhookSecret: "whsec_live_ghi",
  },
} as const;

// Tipo exacto: configConst.development.publishableKey es "pk_test_123"
// No puede ser modificado accidentalmente

/**
 * USO PRÁCTICO: Lookup tables
 *
 * 🏢 BIG TECH: Mapear códigos de error a mensajes
 */
const ERROR_MESSAGES = {
  card_declined: "Tu tarjeta fue rechazada",
  insufficient_funds: "Fondos insuficientes",
  expired_card: "Tarjeta vencida",
  invalid_cvc: "CVC incorrecto",
} as const;

// Tipo inferido: Record<"card_declined" | "insufficient_funds" | ..., string>

/**
 * Función: Obtener mensaje de error
 *
 * @param code - Código de error
 * @returns Mensaje
 */
type ErrorCode = keyof typeof ERROR_MESSAGES;

function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code];
}

// Type-safe: solo acepta claves válidas
// getErrorMessage("card_declined") // ✅
// getErrorMessage("invalid_code") // ❌ Error de compilación

// ============================================
// DOUBLE ASSERTION: Caso extremo
// ============================================

/**
 * 🔑 CONCEPTO: Double assertion
 *
 * A veces TypeScript no permite assertion directa
 * Necesitas pasar por 'unknown' primero
 *
 * SINTAXIS: value as unknown as TargetType
 *
 * ⚠️ MUY PELIGROSO: Solo en casos extremos
 */

/**
 * Ejemplo: Legacy code con tipos incompatibles
 */
interface LegacyPayment {
  payment_id: string;
  payment_amount: number;
}

interface ModernPayment {
  id: string;
  amount: number;
}

/**
 * Función: Migrar de formato legacy
 *
 * @param legacy - Pago en formato antiguo
 * @returns Pago en formato nuevo
 */
function migrateLegacyPayment(legacy: LegacyPayment): ModernPayment {
  // ❌ Assertion directa no funciona (tipos incompatibles)
  // return legacy as ModernPayment; // Error

  // ⚠️ Double assertion (escapatoria extrema)
  // return legacy as unknown as ModernPayment; // Compila pero INCORRECTO

  // ✅ CORRECTO: Transformar los datos
  return {
    id: legacy.payment_id,
    amount: legacy.payment_amount,
  };
}

/**
 * CUÁNDO USAR DOUBLE ASSERTION:
 * - Migración de código legacy (temporal)
 * - Interop con código JS sin tipos
 * - Testing (mock objects)
 *
 * ⚠️ SIEMPRE CONSIDERA: ¿Hay una mejor alternativa?
 */

// ============================================
// TYPE GUARDS vs ASSERTIONS
// ============================================

/**
 * 🔑 CONCEPTO: Type guards son mejores que assertions
 *
 * Type guards: Runtime checking + Type narrowing
 * Assertions: Solo compile-time, no runtime checking
 */

/**
 * OPCIÓN 1: Type Assertion (menos seguro)
 */
function processPaymentAssertion(data: unknown): void {
  // Asumimos que es PaymentResponse
  const payment = data as PaymentResponse;

  // Si 'data' no es realmente PaymentResponse: RUNTIME ERROR
  console.log(`Processing payment: ${payment.id}`);
}

/**
 * OPCIÓN 2: Type Guard (más seguro)
 */
function isPaymentResponse(data: unknown): data is PaymentResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "amount" in data &&
    "currency" in data &&
    "status" in data
  );
}

function processPaymentGuard(data: unknown): void {
  // Validar con type guard
  if (isPaymentResponse(data)) {
    // TypeScript sabe que data es PaymentResponse aquí
    console.log(`Processing payment: ${data.id}`);
  } else {
    console.error("Invalid payment data");
  }
}

// ============================================
// ASSERTIONS EN ARRAYS Y GENERICS
// ============================================

/**
 * Ejemplo: Assert array de tipos específicos
 */

/**
 * Función: Obtener transacciones de localStorage
 *
 * @returns Array de transacciones
 *
 * 🏢 BIG TECH: Cachear datos en browser
 */
interface Transaction {
  id: string;
  amount: number;
  timestamp: number;
}

function getStoredTransactions(): Transaction[] {
  const stored = localStorage.getItem("transactions");

  if (!stored) {
    return [];
  }

  try {
    // JSON.parse retorna any/unknown
    const parsed = JSON.parse(stored);

    // Assert que es array
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Assert que cada elemento es Transaction
    // ⚠️ Esto NO valida realmente cada elemento
    return parsed as Transaction[];

    // ✅ MEJOR: Validar cada elemento
    // return parsed.filter(isTransaction);
  } catch {
    return [];
  }
}

/**
 * MEJOR PRÁCTICA: Validar elementos de array
 */
function getStoredTransactionsSafe(): Transaction[] {
  const stored = localStorage.getItem("transactions");

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Filtrar solo elementos válidos
    return parsed.filter((item): item is Transaction => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.amount === "number" &&
        typeof item.timestamp === "number"
      );
    });
  } catch {
    return [];
  }
}

// ============================================
// DEMOSTRACIÓN: Uso práctico
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Type Assertions");
console.log("=".repeat(60));

// BÁSICO: as assertion
console.log("\n📝 BÁSICO - as assertion:");
const jsonString = JSON.stringify({
  id: "pay_123",
  amount: 2999,
  currency: "USD",
  status: "succeeded",
});

const payment1 = parsePaymentResponse(jsonString);
console.log(`Pago parseado: ${payment1.id} - $${payment1.amount / 100}`);

// SEGURO: Validación antes de assertion
console.log("\n✅ SEGURO - Validación:");
const safePayment = parsePaymentResponseSafe(jsonString);
if (safePayment) {
  console.log(`Pago validado: ${safePayment.id}`);
}

// CONST ASSERTION: Configuración inmutable
console.log("\n🔒 CONST ASSERTION - Inmutabilidad:");
console.log(`API Key (dev): ${STRIPE_CONFIG.development.publishableKey}`);
console.log(`API Key (prod): ${STRIPE_CONFIG.production.publishableKey}`);

// ERROR MESSAGES: Lookup table
console.log("\n❌ LOOKUP TABLE - Mensajes de error:");
const errorCode: ErrorCode = "card_declined";
console.log(`Código: ${errorCode}`);
console.log(`Mensaje: ${getErrorMessage(errorCode)}`);

// TYPE GUARD vs ASSERTION
console.log("\n🛡️ TYPE GUARD vs ASSERTION:");
const unknownData: unknown = {
  id: "pay_456",
  amount: 5000,
  currency: "USD",
  status: "pending",
};

console.log("Con assertion:");
processPaymentAssertion(unknownData);

console.log("Con type guard:");
processPaymentGuard(unknownData);

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. API RESPONSES:
 *    - Parsear JSON de Stripe, PayPal APIs
 *    - Assert tipos conocidos después de validar
 *    - Ejemplo: const charge = response.data as Charge
 *
 * 2. DOM MANIPULATION:
 *    - Formularios de pago
 *    - Stripe Elements
 *    - Ejemplo: const input = el as HTMLInputElement
 *
 * 3. CONFIGURACIONES:
 *    - API keys (as const para inmutabilidad)
 *    - Fee structures
 *    - Currency configs
 *
 * 4. LOOKUP TABLES:
 *    - Error codes -> mensajes
 *    - Country codes -> currency
 *    - Payment methods -> fees
 *
 * 5. MIGRATIONS:
 *    - Legacy data formats
 *    - API version changes
 *    - Database schema updates
 *
 * 6. TYPE NARROWING:
 *    - Union types (Card | BankAccount | Wallet)
 *    - Discriminated unions
 *    - Ejemplo: payment.type === "card" && payment as CardPayment
 *
 * 7. TESTING:
 *    - Mock objects
 *    - Test data
 *    - Ejemplo: const mockPayment = { ... } as Payment
 */

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS");
console.log("=".repeat(60));

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. VALIDAR ANTES DE ASSERT:
 *    ✅ if (isType(value)) { use value }
 *    ❌ const x = value as Type // sin validar
 *
 * 2. PREFERIR TYPE GUARDS SOBRE ASSERTIONS:
 *    ✅ Type guards: runtime safety
 *    ❌ Assertions: solo compile-time
 *
 * 3. USAR as const PARA CONFIGURACIONES:
 *    ✅ const CONFIG = { ... } as const
 *    - Inmutabilidad
 *    - Tipos exactos
 *
 * 4. DOCUMENTAR POR QUÉ HACES ASSERTION:
 *    // Assert: API siempre retorna esta estructura
 *    const data = response as ApiResponse
 *
 * 5. EVITAR NON-NULL ASSERTION (!):
 *    ✅ if (value) { use value }
 *    ❌ value! // puede ser null
 *
 * 6. NUNCA DOUBLE ASSERTION SIN RAZÓN MUY VÁLIDA:
 *    ⚠️ value as unknown as Type
 *    Solo en migraciones/casos extremos
 *
 * 7. EN DUDA, NO ASSERT:
 *    Si no estás 100% seguro del tipo,
 *    usa unknown y valida
 *
 * ⚠️ ERRORES COMUNES:
 *
 * 1. ASSERTION SIN VALIDACIÓN:
 *    ❌ const data = JSON.parse(str) as MyType
 *    ✅ Validar primero
 *
 * 2. ABUSO DE NON-NULL ASSERTION:
 *    ❌ value!.property!.method!()
 *    ✅ Encadenar con optional chaining: value?.property?.method()
 *
 * 3. CONFIAR EN DATOS EXTERNOS:
 *    ❌ const user = apiResponse as User
 *    ✅ Validar con type guard o schema validator
 *
 * 4. USAR as any COMO SOLUCIÓN:
 *    ❌ (value as any).whatever
 *    ✅ Resolver el problema de tipos correctamente
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuál es la diferencia entre assertion y casting en otros lenguajes?
 *    Pista: TypeScript no hace conversión en runtime
 *
 * 2. ¿Qué pasa con las assertions cuando compilas a JavaScript?
 *    Pista: Desaparecen completamente
 *
 * 3. ¿Cuándo es seguro usar non-null assertion (!)?
 *    Pista: Solo cuando GARANTIZAS que no es null
 *
 * 4. ¿Cómo afecta as const a la inferencia de tipos?
 *    Pista: Narrowing máximo, readonly, literals
 *
 * 5. ¿Por qué double assertion es peligroso?
 *    Pista: Bypasses type system completamente
 *
 * 6. ¿Cuál es mejor: type guard o assertion?
 *    Pista: Type guard casi siempre
 *
 * 7. ¿Cómo validarías objetos complejos en runtime?
 *    Pista: Librerías como zod, yup, io-ts
 *
 * 8. ¿Qué son branded types y cómo se relacionan con assertions?
 *    Pista: Tipos nominales en TypeScript estructural
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea una función que parsee y valide un webhook payload:
 *    - Input: string (JSON)
 *    - Output: WebhookEvent | null
 *    - Validar estructura completa antes de assertion
 *
 * 2. INTERMEDIO:
 *    Implementa un sistema de config type-safe:
 *    - Múltiples environments (dev, staging, prod)
 *    - Usar as const
 *    - Helper para obtener config del environment actual
 *    - Type inference completo
 *
 * 3. AVANZADO:
 *    Crea un assertion helper genérico:
 *    function assertType<T>(value: unknown, guard: (v: unknown) => v is T): T
 *    - Lanza error si validación falla
 *    - Retorna valor con tipo correcto
 *    - Útil para cases donde DEBE ser válido
 *
 * 4. EXPERTO:
 *    Implementa un schema validator con type inference:
 *    - Define schemas para objetos complejos
 *    - Runtime validation
 *    - Type inference del schema al tipo TypeScript
 *    - Mensajes de error descriptivos
 *    - Similar a zod pero simplificado
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Usa assertions con responsabilidad!");
console.log("=".repeat(60));

export {
  PaymentResponse,
  PaymentForm,
  Transaction,
  ErrorCode,
  parsePaymentResponse,
  parsePaymentResponseSafe,
  getPaymentFormDataSafe,
  getErrorMessage,
  migrateLegacyPayment,
  isPaymentResponse,
  processPaymentGuard,
  getStoredTransactionsSafe,
  STRIPE_CONFIG,
  ERROR_MESSAGES,
};
