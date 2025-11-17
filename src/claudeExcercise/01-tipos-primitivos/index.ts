/**
 * ==========================================
 * TIPOS PRIMITIVOS EN TYPESCRIPT
 * ==========================================
 *
 * Los tipos primitivos son los bloques fundamentales de TypeScript.
 * Este ejercicio demuestra cómo se usan en sistemas de pagos reales.
 *
 * 📚 CONCEPTOS CLAVE:
 * - string: Para texto como nombres, IDs, descripciones
 * - number: Para cantidades, precios, timestamps
 * - boolean: Para estados, flags, validaciones
 *
 * 🏢 USO EN BIG TECH:
 * Stripe, PayPal, Square usan tipos primitivos para:
 * - Validación de tipos en tiempo de compilación
 * - Prevención de errores de tipo en transacciones
 * - Documentación automática del código
 * - Autocompletado en IDEs
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Los errores de tipo en sistemas de pago pueden causar:
 * - Pérdidas financieras
 * - Fraude
 * - Problemas de compliance
 * - Mala experiencia de usuario
 *
 * TypeScript previene estos errores ANTES de que lleguen a producción.
 */

// ============================================
// EJEMPLO 1: Sistema de Procesamiento de Pagos
// ============================================

/**
 * Interfaz que representa un pago en un sistema como Stripe
 * Cada campo tiene un tipo específico para prevenir errores
 */
interface Payment {
  // string: ID único del pago (ej: "pay_1234567890")
  // Los IDs siempre son strings, nunca números, porque pueden contener caracteres especiales
  id: string;

  // number: Monto en centavos (ej: 1999 = $19.99)
  // 🔑 CONCEPTO CLAVE: Los sistemas de pago usan centavos (integers) en lugar de decimales
  // para evitar errores de redondeo de punto flotante
  amountInCents: number;

  // string: Código de moneda ISO 4217 (ej: "USD", "EUR", "MXN")
  currency: string;

  // boolean: Estado de procesamiento del pago
  // true = procesado exitosamente, false = pendiente o fallido
  isProcessed: boolean;

  // string: Descripción del cargo
  description: string;

  // number: Timestamp Unix en milisegundos
  // Los timestamps siempre son números para facilitar comparaciones y cálculos
  createdAt: number;
}

// ============================================
// FUNCIÓN: Crear un nuevo pago
// ============================================

/**
 * Crea un objeto de pago con validación de tipos
 *
 * @param amount - Monto en dólares (será convertido a centavos)
 * @param description - Descripción del pago
 * @returns Un objeto Payment completamente tipado
 *
 * 🏢 PATRÓN BIG TECH:
 * Esta función demuestra cómo Stripe, Adyen, etc. crean objetos de pago
 * con tipos estrictos para prevenir errores
 */
function createPayment(amount: number, description: string): Payment {
  // Generar un ID único usando timestamp y random
  // El tipo 'string' garantiza que siempre será tratado como texto
  const id: string = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Convertir dólares a centavos multiplicando por 100
  // El tipo 'number' permite operaciones matemáticas seguras
  const amountInCents: number = Math.round(amount * 100);

  // Moneda fija en USD para este ejemplo
  // El tipo 'string' garantiza que siempre será texto válido
  const currency: string = "USD";

  // Estado inicial: no procesado
  // El tipo 'boolean' garantiza que solo puede ser true o false
  const isProcessed: boolean = false;

  // Timestamp actual en milisegundos
  // El tipo 'number' permite comparaciones y cálculos de tiempo
  const createdAt: number = Date.now();

  // Retornar el objeto Payment con todos los tipos correctos
  return {
    id,
    amountInCents,
    currency,
    isProcessed,
    description,
    createdAt,
  };
}

// ============================================
// FUNCIÓN: Procesar un pago
// ============================================

/**
 * Simula el procesamiento de un pago
 *
 * @param payment - El pago a procesar
 * @returns El pago actualizado con isProcessed = true
 *
 * 🔑 CONCEPTO CLAVE:
 * TypeScript verifica que 'payment' tenga la estructura correcta
 * Si intentamos pasar algo que no es un Payment, obtendremos un error
 */
function processPayment(payment: Payment): Payment {
  // Validar que el monto sea positivo
  // number permite comparaciones matemáticas
  if (payment.amountInCents <= 0) {
    // string permite concatenación y mensajes descriptivos
    throw new Error(`Monto inválido: ${payment.amountInCents}`);
  }

  // Validar que el pago no esté ya procesado
  // boolean permite verificaciones lógicas claras
  if (payment.isProcessed) {
    throw new Error(`El pago ${payment.id} ya fue procesado`);
  }

  // Simular procesamiento (en realidad llamaría a una API de pago)
  console.log(`💳 Procesando pago ${payment.id} por $${payment.amountInCents / 100}`);

  // Retornar el pago actualizado
  // Usamos spread operator para mantener inmutabilidad
  return {
    ...payment,
    isProcessed: true, // Cambiar el estado a procesado
  };
}

// ============================================
// FUNCIÓN: Formatear monto para mostrar
// ============================================

/**
 * Convierte centavos a formato de moneda legible
 *
 * @param amountInCents - Monto en centavos
 * @param currency - Código de moneda
 * @returns String formateado (ej: "$19.99 USD")
 *
 * 🏢 USO EN BIG TECH:
 * Stripe, PayPal siempre almacenan en centavos pero muestran en formato legible
 */
function formatAmount(amountInCents: number, currency: string): string {
  // Dividir por 100 para obtener dólares
  // number permite operaciones matemáticas precisas
  const dollars: number = amountInCents / 100;

  // Formatear a 2 decimales
  // string permite concatenación y formato
  const formatted: string = `$${dollars.toFixed(2)} ${currency}`;

  return formatted;
}

// ============================================
// FUNCIÓN: Verificar si el pago está vencido
// ============================================

/**
 * Verifica si un pago no procesado tiene más de 24 horas
 *
 * @param payment - El pago a verificar
 * @returns true si está vencido, false si no
 *
 * 🔑 CONCEPTO CLAVE:
 * boolean es perfecto para respuestas sí/no
 * number permite cálculos de tiempo precisos
 */
function isPaymentExpired(payment: Payment): boolean {
  // Si ya está procesado, no puede estar vencido
  if (payment.isProcessed) {
    return false;
  }

  // Calcular tiempo transcurrido en milisegundos
  // number permite operaciones matemáticas
  const now: number = Date.now();
  const elapsed: number = now - payment.createdAt;

  // 24 horas en milisegundos
  const twentyFourHours: number = 24 * 60 * 60 * 1000;

  // Retornar true si ha pasado más de 24 horas
  // boolean es perfecto para expresar esta condición
  return elapsed > twentyFourHours;
}

// ============================================
// DEMOSTRACIÓN: Uso práctico
// ============================================

console.log("=".repeat(50));
console.log("🎯 DEMOSTRACIÓN: Sistema de Pagos con Tipos Primitivos");
console.log("=".repeat(50));

// Crear un pago
const payment1: Payment = createPayment(29.99, "Suscripción mensual Premium");
console.log("\n✅ Pago creado:");
console.log(`   ID: ${payment1.id}`);
console.log(`   Monto: ${formatAmount(payment1.amountInCents, payment1.currency)}`);
console.log(`   Descripción: ${payment1.description}`);
console.log(`   Procesado: ${payment1.isProcessed}`);

// Procesar el pago
const processedPayment: Payment = processPayment(payment1);
console.log("\n✅ Pago procesado:");
console.log(`   ID: ${processedPayment.id}`);
console.log(`   Procesado: ${processedPayment.isProcessed}`);

// Verificar si está vencido
const expired: boolean = isPaymentExpired(processedPayment);
console.log(`\n⏰ ¿Pago vencido? ${expired}`);

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. FACTURACIÓN AUTOMÁTICA:
 *    - string para invoice_id, customer_id
 *    - number para amounts, due_dates (timestamps)
 *    - boolean para is_paid, is_overdue
 *
 * 2. PROCESAMIENTO DE TARJETAS:
 *    - string para card_number (encrypted), card_brand
 *    - number para expiry_month, expiry_year, cvv
 *    - boolean para is_valid, is_expired
 *
 * 3. RECONCILIACIÓN BANCARIA:
 *    - string para transaction_id, reference_number
 *    - number para amounts, timestamps
 *    - boolean para is_reconciled, needs_review
 *
 * 4. DETECCIÓN DE FRAUDE:
 *    - string para user_ip, device_id
 *    - number para risk_score (0-100), attempt_count
 *    - boolean para is_suspicious, requires_verification
 *
 * 5. REPORTES FINANCIEROS:
 *    - string para report_id, period_description
 *    - number para total_revenue, total_refunds
 *    - boolean para is_final, needs_audit
 */

console.log("\n" + "=".repeat(50));
console.log("💡 VENTAJAS DE USAR TIPOS PRIMITIVOS EXPLÍCITOS");
console.log("=".repeat(50));

/**
 * ✅ VENTAJAS:
 *
 * 1. PREVENCIÓN DE ERRORES:
 *    - No puedes asignar un string donde se espera un number
 *    - No puedes asignar null/undefined accidentalmente
 *
 * 2. MEJOR TOOLING:
 *    - Autocompletado en IDEs
 *    - Refactoring seguro
 *    - Detección de errores en tiempo real
 *
 * 3. DOCUMENTACIÓN AUTOMÁTICA:
 *    - Los tipos son documentación viva
 *    - Más fácil entender el código
 *
 * 4. CONFIANZA EN REFACTORING:
 *    - Puedes cambiar código con seguridad
 *    - El compilador te avisa de errores
 *
 * ⚠️ ERRORES COMUNES SIN TIPOS:
 *
 * En JavaScript sin tipos:
 * - payment.amount = "29.99" // Oops! string en vez de number
 * - payment.isProcessed = "true" // Oops! string en vez de boolean
 * - payment.id = 123 // Oops! number en vez de string
 *
 * TypeScript previene TODOS estos errores en tiempo de compilación
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Por qué los sistemas de pago usan centavos (integers) en lugar de decimales?
 *    Pista: Investiga "floating point precision errors"
 *
 * 2. ¿Cuándo usarías 'number' vs 'bigint' para montos?
 *    Pista: ¿Qué pasa con transacciones muy grandes?
 *
 * 3. ¿Por qué los IDs son strings y no numbers?
 *    Pista: Piensa en UUIDs y en sistemas distribuidos
 *
 * 4. ¿Qué pasa si necesitas representar ausencia de valor?
 *    Pista: Investiga 'null' vs 'undefined' vs 'optional properties'
 *
 * 5. ¿Cómo manejarías múltiples monedas con tipos seguros?
 *    Pista: Investiga 'union types' y 'enums'
 *
 * 6. ¿Qué problemas podrían surgir al serializar estos tipos a JSON?
 *    Pista: JSON no tiene tipos, todo es string/number/boolean/null
 *
 * 7. ¿Cómo validarías que un string realmente sea un email válido?
 *    Pista: Los tipos solo verifican la forma, no el contenido
 *
 * 8. ¿Deberías usar number o string para timestamps?
 *    Pista: Investiga Date vs Unix timestamp vs ISO 8601
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea una función que calcule el fee de procesamiento (2.9% + $0.30)
 *    Input: amount (number)
 *    Output: fee (number)
 *
 * 2. INTERMEDIO:
 *    Crea una función que verifique si un número de tarjeta es válido (algoritmo de Luhn)
 *    Input: cardNumber (string)
 *    Output: isValid (boolean)
 *
 * 3. AVANZADO:
 *    Crea un sistema de refunds que:
 *    - Valide que el pago esté procesado
 *    - Calcule refund parcial o total
 *    - Actualice el estado del pago
 *
 * 4. EXPERTO:
 *    Implementa un sistema de multi-currency que:
 *    - Convierta entre monedas
 *    - Maneje tasas de cambio
 *    - Prevenga errores de redondeo
 */

console.log("\n" + "=".repeat(50));
console.log("✨ Fin del ejercicio - ¡Practica creando tus propios ejemplos!");
console.log("=".repeat(50));

export { Payment, createPayment, processPayment, formatAmount, isPaymentExpired };
