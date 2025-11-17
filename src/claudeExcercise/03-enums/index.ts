/**
 * ==========================================
 * ENUMS EN TYPESCRIPT
 * ==========================================
 *
 * Los Enums permiten definir un conjunto de constantes nombradas.
 * Son fundamentales para representar estados, opciones, y categorías.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Enum numérico: Valores numéricos auto-incrementales
 * - Enum de strings: Valores string explícitos
 * - Const enum: Optimizado, se elimina en compilación
 * - Enum como tipo: Limita valores posibles
 *
 * 🏢 USO EN BIG TECH:
 * Stripe, PayPal, Square usan enums para:
 * - Estados de pago (pending, succeeded, failed)
 * - Tipos de eventos (charge.created, payment.captured)
 * - Métodos de pago (card, bank_transfer, cash)
 * - Códigos de error (authentication_required, card_declined)
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Type safety: Solo valores válidos permitidos
 * - Autocompletado: IDE sugiere opciones válidas
 * - Refactoring seguro: Cambiar valor en un lugar
 * - Documentación: Nombres descriptivos vs strings/numbers mágicos
 * - Menos errores: No typos en strings
 */

// ============================================
// ENUM NUMÉRICO: Estados de Pago
// ============================================

/**
 * Enum numérico: Representa estados de un pago
 *
 * 🔑 CONCEPTO: Por defecto, el primer valor es 0 y se auto-incrementa
 *
 * Pending = 0
 * Processing = 1
 * Succeeded = 2
 * Failed = 3
 * Refunded = 4
 *
 * 🏢 BIG TECH: PayPal usa enums numéricos para estados en su base de datos
 * Los números ocupan menos espacio que strings y son más rápidos de comparar
 */
enum PaymentStatus {
  Pending, // 0 - Pago creado pero no procesado
  Processing, // 1 - En proceso de autorización
  Succeeded, // 2 - Pago completado exitosamente
  Failed, // 3 - Pago rechazado o fallido
  Refunded, // 4 - Pago reembolsado
}

/**
 * Interfaz: Representa un pago con estado enum
 */
interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus; // Usa el enum como tipo
  createdAt: number;
}

/**
 * Función: Crear un nuevo pago
 *
 * @param amount - Monto en centavos
 * @returns Pago con estado inicial Pending
 *
 * 🔑 CONCEPTO: El enum se usa como valor
 */
function createPayment(amount: number): Payment {
  return {
    id: `pay_${Date.now()}`,
    amount,
    currency: "USD",
    status: PaymentStatus.Pending, // Usar enum como valor
    createdAt: Date.now(),
  };
}

/**
 * Función: Procesar pago
 *
 * @param payment - Pago a procesar
 * @returns Pago actualizado
 *
 * 🏢 BIG TECH: Máquinas de estado para workflows de pago
 */
function processPayment(payment: Payment): Payment {
  // Validar que esté en estado correcto
  if (payment.status !== PaymentStatus.Pending) {
    throw new Error(
      `No se puede procesar pago en estado ${PaymentStatus[payment.status]}`
    );
  }

  // Cambiar a Processing
  payment.status = PaymentStatus.Processing;

  // Simular procesamiento
  const success = Math.random() > 0.2; // 80% de éxito

  // Actualizar estado según resultado
  if (success) {
    payment.status = PaymentStatus.Succeeded;
    console.log(`✅ Pago ${payment.id} completado`);
  } else {
    payment.status = PaymentStatus.Failed;
    console.log(`❌ Pago ${payment.id} rechazado`);
  }

  return payment;
}

/**
 * Función: Verificar si un pago está en estado final
 *
 * @param status - Estado del pago
 * @returns true si es estado final
 *
 * 🔑 CONCEPTO: Comparar enums como números
 */
function isFinalStatus(status: PaymentStatus): boolean {
  // Estados finales: Succeeded, Failed, Refunded
  // Estados no finales: Pending, Processing
  return (
    status === PaymentStatus.Succeeded ||
    status === PaymentStatus.Failed ||
    status === PaymentStatus.Refunded
  );
}

// ============================================
// ENUM DE STRINGS: Métodos de Pago
// ============================================

/**
 * Enum de strings: Métodos de pago soportados
 *
 * 🔑 CONCEPTO: Valores string explícitos (no auto-incrementales)
 *
 * VENTAJAS:
 * - Legible en logs y debugging
 * - Serialización a JSON es clara
 * - Mejor para APIs públicas
 *
 * DESVENTAJAS:
 * - Ocupan más espacio que números
 * - Comparación ligeramente más lenta
 *
 * 🏢 BIG TECH: Stripe usa enums de strings para su API
 * Ejemplo: payment_method_types: ["card", "bank_transfer"]
 */
enum PaymentMethod {
  Card = "card", // Tarjeta de crédito/débito
  BankTransfer = "bank_transfer", // Transferencia bancaria
  Cash = "cash", // Efectivo
  Crypto = "crypto", // Criptomonedas
  Wallet = "wallet", // Wallets digitales (Apple Pay, Google Pay)
}

/**
 * Interfaz: Configuración de checkout
 */
interface CheckoutConfig {
  allowedMethods: PaymentMethod[]; // Array de enums
  preferredMethod: PaymentMethod; // Enum como tipo
  currency: string;
}

/**
 * Función: Crear configuración de checkout
 *
 * @param methods - Métodos permitidos
 * @param preferred - Método preferido
 * @returns Configuración
 *
 * 💰 BILLING: Diferentes negocios aceptan diferentes métodos
 */
function createCheckoutConfig(
  methods: PaymentMethod[],
  preferred: PaymentMethod
): CheckoutConfig {
  // Validar que el método preferido esté en la lista
  if (!methods.includes(preferred)) {
    throw new Error("El método preferido debe estar en la lista de permitidos");
  }

  return {
    allowedMethods: methods,
    preferredMethod: preferred,
    currency: "USD",
  };
}

/**
 * Función: Obtener fee según método de pago
 *
 * @param method - Método de pago
 * @param amount - Monto en centavos
 * @returns Fee en centavos
 *
 * 🏢 BIG TECH: Diferentes métodos tienen diferentes costos de procesamiento
 * Stripe: Card = 2.9% + $0.30, ACH = 0.8%, capped at $5
 */
function calculateProcessingFee(method: PaymentMethod, amount: number): number {
  // Switch sobre enum - TypeScript verifica que cubramos todos los casos
  switch (method) {
    case PaymentMethod.Card:
      // Tarjeta: 2.9% + $0.30
      return Math.round(amount * 0.029 + 30);

    case PaymentMethod.BankTransfer:
      // Transferencia: 0.8%, max $5
      const fee = Math.round(amount * 0.008);
      return Math.min(fee, 500); // Cap at $5 (500 centavos)

    case PaymentMethod.Cash:
      // Efectivo: sin fee
      return 0;

    case PaymentMethod.Crypto:
      // Crypto: 1%
      return Math.round(amount * 0.01);

    case PaymentMethod.Wallet:
      // Wallet: 2.5%
      return Math.round(amount * 0.025);

    // TypeScript verificará que cubrimos todos los casos
    // Si agregamos un nuevo PaymentMethod y olvidamos un case, tendremos error
    default:
      // Este código es inalcanzable si cubrimos todos los casos
      const exhaustiveCheck: never = method;
      throw new Error(`Método de pago no manejado: ${exhaustiveCheck}`);
  }
}

// ============================================
// ENUM DE STRINGS: Códigos de Error
// ============================================

/**
 * Enum de strings: Códigos de error de pago
 *
 * 🏢 BIG TECH: Stripe tiene +50 códigos de error diferentes
 * Esto es un subset simplificado
 *
 * 💡 VENTAJA: Códigos consistentes y documentados
 */
enum PaymentErrorCode {
  // Errores de tarjeta
  CardDeclined = "card_declined",
  InsufficientFunds = "insufficient_funds",
  ExpiredCard = "expired_card",
  IncorrectCVC = "incorrect_cvc",
  InvalidCardNumber = "invalid_card_number",

  // Errores de autenticación
  AuthenticationRequired = "authentication_required",
  InvalidApiKey = "invalid_api_key",

  // Errores de procesamiento
  ProcessingError = "processing_error",
  RateLimitExceeded = "rate_limit_exceeded",

  // Errores de negocio
  AmountTooLarge = "amount_too_large",
  AmountTooSmall = "amount_too_small",
  InvalidCurrency = "invalid_currency",
}

/**
 * Clase: Representa un error de pago
 */
class PaymentError extends Error {
  // Propiedad: Código de error (enum)
  public readonly code: PaymentErrorCode;

  // Propiedad: Detalles adicionales
  public readonly details?: Record<string, unknown>;

  constructor(code: PaymentErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "PaymentError";
  }

  /**
   * Método: Obtener mensaje amigable para el usuario
   *
   * 🏢 BIG TECH: Mapear códigos técnicos a mensajes amigables
   */
  getUserFriendlyMessage(): string {
    switch (this.code) {
      case PaymentErrorCode.CardDeclined:
        return "Tu tarjeta fue rechazada. Intenta con otra tarjeta.";

      case PaymentErrorCode.InsufficientFunds:
        return "Fondos insuficientes. Verifica tu saldo.";

      case PaymentErrorCode.ExpiredCard:
        return "Tu tarjeta está vencida. Actualiza tu método de pago.";

      case PaymentErrorCode.IncorrectCVC:
        return "El código de seguridad (CVC) es incorrecto.";

      case PaymentErrorCode.InvalidCardNumber:
        return "El número de tarjeta es inválido.";

      case PaymentErrorCode.AuthenticationRequired:
        return "Se requiere autenticación adicional. Verifica tu email.";

      case PaymentErrorCode.ProcessingError:
        return "Error al procesar el pago. Intenta nuevamente.";

      case PaymentErrorCode.AmountTooLarge:
        return "El monto excede el límite permitido.";

      case PaymentErrorCode.AmountTooSmall:
        return "El monto es menor al mínimo requerido.";

      default:
        return "Ocurrió un error. Contacta a soporte.";
    }
  }
}

// ============================================
// CONST ENUM: Optimización
// ============================================

/**
 * Const Enum: Niveles de log
 *
 * 🔑 CONCEPTO: const enum se "inline" en compilación
 * El código compilado NO contiene el objeto enum, solo los valores
 *
 * VENTAJAS:
 * - Cero overhead en runtime
 * - Código JavaScript más pequeño
 *
 * DESVENTAJAS:
 * - No puedes iterar sobre el enum
 * - No puedes hacer reverse mapping
 *
 * 🏢 BIG TECH: Usado para logs, flags, constantes de configuración
 */
const enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR",
  Critical = "CRITICAL",
}

/**
 * Función: Loggear evento de pago
 *
 * @param level - Nivel de log
 * @param message - Mensaje
 *
 * 🔑 CONCEPTO: const enum se reemplaza por su valor en compilación
 */
function logPaymentEvent(level: LogLevel, message: string): void {
  // En JavaScript compilado, LogLevel.Info se reemplaza por "INFO"
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

// ============================================
// ENUM CON MÉTODOS: Pattern avanzado
// ============================================

/**
 * Enum con namespace: Agregar métodos a un enum
 *
 * 🔑 CONCEPTO: Combinar enum con namespace del mismo nombre
 *
 * 🏢 BIG TECH: Pattern usado en SDKs complejos
 */
enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  MXN = "MXN",
  JPY = "JPY",
}

// Namespace con el mismo nombre agrega métodos al enum
namespace Currency {
  /**
   * Obtener símbolo de moneda
   */
  export function getSymbol(currency: Currency): string {
    switch (currency) {
      case Currency.USD:
        return "$";
      case Currency.EUR:
        return "€";
      case Currency.GBP:
        return "£";
      case Currency.MXN:
        return "$";
      case Currency.JPY:
        return "¥";
    }
  }

  /**
   * Obtener número de decimales
   */
  export function getDecimals(currency: Currency): number {
    switch (currency) {
      case Currency.JPY:
        return 0; // Yen no usa decimales
      default:
        return 2; // La mayoría usan 2 decimales
    }
  }

  /**
   * Formatear monto
   */
  export function format(amount: number, currency: Currency): string {
    const decimals = getDecimals(currency);
    const value = (amount / Math.pow(10, decimals)).toFixed(decimals);
    const symbol = getSymbol(currency);
    return `${symbol}${value} ${currency}`;
  }
}

// ============================================
// DEMOSTRACIÓN: Uso práctico
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Enums en Sistemas de Pago");
console.log("=".repeat(60));

// ENUM NUMÉRICO: Estados de pago
console.log("\n📊 ENUM NUMÉRICO - Estados de Pago:");
const payment1 = createPayment(2999);
console.log(`Pago creado: ${payment1.id}`);
console.log(`Estado inicial: ${PaymentStatus[payment1.status]} (${payment1.status})`);

const processed = processPayment(payment1);
console.log(`Estado final: ${PaymentStatus[processed.status]} (${processed.status})`);
console.log(`¿Estado final? ${isFinalStatus(processed.status)}`);

// ENUM DE STRINGS: Métodos de pago
console.log("\n💳 ENUM DE STRINGS - Métodos de Pago:");
const config = createCheckoutConfig(
  [PaymentMethod.Card, PaymentMethod.BankTransfer, PaymentMethod.Wallet],
  PaymentMethod.Card
);
console.log(`Métodos permitidos: ${config.allowedMethods.join(", ")}`);
console.log(`Método preferido: ${config.preferredMethod}`);

console.log("\n💰 Fees de procesamiento para $100:");
console.log(`  Card: $${(calculateProcessingFee(PaymentMethod.Card, 10000) / 100).toFixed(2)}`);
console.log(
  `  Bank Transfer: $${(calculateProcessingFee(PaymentMethod.BankTransfer, 10000) / 100).toFixed(2)}`
);
console.log(`  Cash: $${(calculateProcessingFee(PaymentMethod.Cash, 10000) / 100).toFixed(2)}`);

// ENUM DE STRINGS: Códigos de error
console.log("\n❌ ENUM DE STRINGS - Códigos de Error:");
const error = new PaymentError(PaymentErrorCode.CardDeclined, "Card was declined by issuer", {
  declineCode: "insufficient_funds",
});
console.log(`Código técnico: ${error.code}`);
console.log(`Mensaje técnico: ${error.message}`);
console.log(`Mensaje amigable: ${error.getUserFriendlyMessage()}`);

// CONST ENUM: Logging
console.log("\n📝 CONST ENUM - Logging:");
logPaymentEvent(LogLevel.Info, "Pago iniciado");
logPaymentEvent(LogLevel.Error, "Pago rechazado");
logPaymentEvent(LogLevel.Critical, "Sistema de pagos caído");

// ENUM CON MÉTODOS: Monedas
console.log("\n🌍 ENUM CON MÉTODOS - Monedas:");
console.log(`USD: ${Currency.format(299900, Currency.USD)}`);
console.log(`EUR: ${Currency.format(299900, Currency.EUR)}`);
console.log(`JPY: ${Currency.format(29990, Currency.JPY)}`);

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. ESTADOS DE FACTURA:
 *    enum InvoiceStatus { Draft, Sent, Paid, Overdue, Cancelled }
 *    - Workflow de facturación
 *    - Notificaciones automáticas según estado
 *
 * 2. INTERVALOS DE SUSCRIPCIÓN:
 *    enum BillingInterval { Daily, Weekly, Monthly, Yearly }
 *    - Planes de suscripción
 *    - Cálculo de próximos cargos
 *
 * 3. TIPOS DE CARGO:
 *    enum ChargeType { Subscription, OneTime, Usage, Fee }
 *    - Clasificación de cargos
 *    - Reportes financieros
 *
 * 4. PRIORIDAD DE WEBHOOK:
 *    enum WebhookPriority { Low, Normal, High, Critical }
 *    - Procesamiento de eventos
 *    - Rate limiting diferenciado
 *
 * 5. MÉTODOS DE AUTENTICACIÓN:
 *    enum AuthMethod { Password, SMS, Email, Biometric, Hardware }
 *    - 3D Secure, PSD2 compliance
 *    - Multi-factor authentication
 *
 * 6. RAZONES DE DISPUTA:
 *    enum DisputeReason { Fraudulent, Duplicate, NotReceived, Defective }
 *    - Chargebacks
 *    - Gestión de disputas
 *
 * 7. TIPOS DE REEMBOLSO:
 *    enum RefundType { Full, Partial, Reversal }
 *    - Procesamiento de refunds
 *    - Contabilidad
 */

console.log("\n" + "=".repeat(60));
console.log("💡 MEJORES PRÁCTICAS CON ENUMS");
console.log("=".repeat(60));

/**
 * ✅ MEJORES PRÁCTICAS:
 *
 * 1. USA STRING ENUMS PARA APIs PÚBLICAS:
 *    - Más legibles en JSON
 *    - Versionado más fácil
 *    - Debugging más simple
 *
 * 2. USA NUMERIC ENUMS PARA STORAGE:
 *    - Menos espacio en DB
 *    - Comparaciones más rápidas
 *    - Ideal para flags/bitmasks
 *
 * 3. USA CONST ENUMS PARA CONSTANTES INTERNAS:
 *    - Zero overhead
 *    - Solo si no necesitas iterar
 *
 * 4. NOMBRA ENUMS EN SINGULAR:
 *    - PaymentStatus (no PaymentStatuses)
 *    - Currency (no Currencies)
 *
 * 5. USA PascalCase PARA NOMBRES:
 *    - enum PaymentMethod { Card, BankTransfer }
 *    - No: enum payment_method { card, bank_transfer }
 *
 * 6. MANEJA CASOS DEFAULT EN SWITCH:
 *    - Siempre incluye default
 *    - Usa pattern exhaustiveCheck para safety
 *
 * 7. DOCUMENTA CADA VALOR:
 *    - Especialmente cuando el nombre no es obvio
 *    - Incluye cuándo y por qué se usa
 *
 * ⚠️ ERRORES COMUNES:
 *
 * 1. MEZCLAR TIPOS:
 *    ❌ enum Mixed { A, B = "b", C = 2 }
 *    ✅ enum StringEnum { A = "a", B = "b" }
 *
 * 2. NO MANEJAR TODOS LOS CASOS:
 *    ❌ switch sin default
 *    ✅ switch con default y exhaustiveCheck
 *
 * 3. USAR MAGIC NUMBERS/STRINGS:
 *    ❌ if (status === "pending")
 *    ✅ if (status === PaymentStatus.Pending)
 *
 * 4. NO CONSIDERAR EXPANSIÓN:
 *    - Al agregar valores, verifica impacto
 *    - Usa default en switches defensivamente
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuándo usarías un enum vs una union de string literals?
 *    Pista: type Status = "pending" | "completed" vs enum Status
 *
 * 2. ¿Cómo implementarías enums con valores calculados?
 *    Pista: enum Permissions { Read = 1 << 0, Write = 1 << 1 }
 *
 * 3. ¿Qué pasa con los enums al compilar a JavaScript?
 *    Pista: Inspecciona el código generado
 *
 * 4. ¿Cómo iterarías sobre todos los valores de un enum?
 *    Pista: Object.values() y reverse mapping
 *
 * 5. ¿Puedes usar enums en runtime reflection?
 *    Pista: const enums no, regular enums sí
 *
 * 6. ¿Cómo validarías que un string es un valor válido del enum?
 *    Pista: Type guards y Object.values()
 *
 * 7. ¿Qué problemas pueden surgir con enums en APIs versioned?
 *    Pista: Agregar/deprecar valores, backward compatibility
 *
 * 8. ¿Cuándo preferirías un Map vs un enum?
 *    Pista: Dynamic values, runtime configuration
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea un enum para días de la semana y una función que determine
 *    si es fin de semana
 *    enum DayOfWeek { Monday, Tuesday, ... }
 *    isWeekend(day: DayOfWeek): boolean
 *
 * 2. INTERMEDIO:
 *    Implementa un sistema de permisos con enums y bitwise operations
 *    enum Permission { Read = 1, Write = 2, Delete = 4 }
 *    hasPermission(user: number, permission: Permission): boolean
 *
 * 3. AVANZADO:
 *    Crea un estado machine para pedidos usando enums:
 *    - Estados: Created, Paid, Shipped, Delivered, Cancelled
 *    - Transiciones válidas (no todas son posibles)
 *    - Validación de transiciones
 *
 * 4. EXPERTO:
 *    Implementa un sistema de eventos con prioridades usando enums:
 *    - enum EventType con múltiples tipos de eventos
 *    - enum Priority con niveles de prioridad
 *    - EventQueue que procese según prioridad
 *    - Rate limiting diferente por tipo
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Explora el poder de los enums!");
console.log("=".repeat(60));

export {
  PaymentStatus,
  PaymentMethod,
  PaymentErrorCode,
  LogLevel,
  Currency,
  Payment,
  CheckoutConfig,
  PaymentError,
  createPayment,
  processPayment,
  isFinalStatus,
  createCheckoutConfig,
  calculateProcessingFee,
  logPaymentEvent,
};
