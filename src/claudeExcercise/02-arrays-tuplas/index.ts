/**
 * ==========================================
 * ARRAYS Y TUPLAS EN TYPESCRIPT
 * ==========================================
 *
 * Arrays y tuplas son estructuras fundamentales para manejar colecciones de datos.
 * Este ejercicio demuestra cómo se usan en sistemas de billing y pagos.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Array: Colección de elementos del mismo tipo (homogéneo)
 * - Tupla: Array de longitud fija con tipos específicos en cada posición (heterogéneo)
 *
 * 🏢 USO EN BIG TECH:
 * Stripe, PayPal, Amazon Payments usan arrays y tuplas para:
 * - Listas de transacciones
 * - Históricos de pagos
 * - Coordenadas de tiempo y monto [timestamp, amount]
 * - Respuestas de APIs [status, data, error]
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * - Arrays: Manejan cantidades variables de datos (ej: lista de pagos)
 * - Tuplas: Representan datos estructurados con semántica (ej: [lat, lng])
 * - Type safety: Previenen errores al acceder elementos
 */

// ============================================
// ARRAYS: Colecciones homogéneas
// ============================================

/**
 * Interfaz para representar una transacción
 */
interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  timestamp: number;
}

/**
 * EJEMPLO 1: Array de transacciones
 *
 * 🔑 CONCEPTO: Array<T> o T[] representa una lista de elementos del mismo tipo
 *
 * 🏢 BIG TECH: Stripe usa arrays para representar listas de charges, refunds, etc.
 */

// Declaración de array - dos sintaxis equivalentes:
// Transaction[] - sintaxis corta (preferida)
// Array<Transaction> - sintaxis genérica

const transactions: Transaction[] = [
  {
    id: "txn_001",
    amount: 2999, // $29.99 en centavos
    currency: "USD",
    status: "completed",
    timestamp: Date.now() - 86400000, // 1 día atrás
  },
  {
    id: "txn_002",
    amount: 4999, // $49.99 en centavos
    currency: "USD",
    status: "pending",
    timestamp: Date.now() - 3600000, // 1 hora atrás
  },
  {
    id: "txn_003",
    amount: 9999, // $99.99 en centavos
    currency: "USD",
    status: "completed",
    timestamp: Date.now(),
  },
];

/**
 * Función: Calcular total de transacciones completadas
 *
 * @param transactions - Array de transacciones
 * @returns Total en centavos
 *
 * 🏢 USO REAL: Amazon calcula totales diarios de ventas así
 */
function calculateTotalCompleted(transactions: Transaction[]): number {
  // El parámetro 'transactions' es un array, podemos usar métodos de array
  // filter() - filtra elementos que cumplan una condición
  // reduce() - reduce el array a un único valor (suma en este caso)

  return transactions
    .filter((txn) => txn.status === "completed") // Solo transacciones completadas
    .reduce((total, txn) => total + txn.amount, 0); // Sumar amounts
}

/**
 * Función: Obtener IDs de transacciones pendientes
 *
 * @param transactions - Array de transacciones
 * @returns Array de IDs
 *
 * 🔑 CONCEPTO: Transformar un array de objetos a array de strings
 */
function getPendingTransactionIds(transactions: Transaction[]): string[] {
  // map() - transforma cada elemento del array
  // El tipo de retorno se infiere automáticamente como string[]
  return transactions.filter((txn) => txn.status === "pending").map((txn) => txn.id);
}

/**
 * Función: Ordenar transacciones por timestamp
 *
 * @param transactions - Array de transacciones
 * @returns Array ordenado (más recientes primero)
 *
 * 🏢 BIG TECH: PayPal ordena historial de transacciones así
 */
function sortByTimestamp(transactions: Transaction[]): Transaction[] {
  // Crear copia para no mutar el array original
  // spread operator [...array] crea una copia superficial
  const sorted = [...transactions];

  // sort() - ordena el array in-place
  // Comparador: a.timestamp - b.timestamp (ascendente)
  // Para descendente (más recientes primero): b.timestamp - a.timestamp
  sorted.sort((a, b) => b.timestamp - a.timestamp);

  return sorted;
}

// ============================================
// TUPLAS: Arrays de longitud y tipos fijos
// ============================================

/**
 * EJEMPLO 2: Tuplas para representar datos estructurados
 *
 * 🔑 CONCEPTO: Tupla = array con longitud fija y tipos específicos por posición
 *
 * Sintaxis: [Type1, Type2, Type3]
 *
 * 🏢 BIG TECH: Stripe usa tuplas para:
 * - Coordenadas de tiempo-serie: [timestamp, valor]
 * - Respuestas de APIs: [success, data, error]
 * - Pares clave-valor: [key, value]
 */

/**
 * Tupla: Representa un punto en gráfica de ingresos
 * [timestamp, amount]
 *
 * Posición 0: timestamp (number) - momento en el tiempo
 * Posición 1: amount (number) - ingreso en ese momento
 */
type RevenuePoint = [number, number];

/**
 * Función: Generar datos de ingresos por día
 *
 * @param days - Número de días hacia atrás
 * @returns Array de tuplas [timestamp, amount]
 *
 * 🏢 USO REAL: Stripe Dashboard muestra gráficas de ingresos usando este patrón
 */
function generateRevenueData(days: number): RevenuePoint[] {
  // Array que contendrá tuplas RevenuePoint
  const data: RevenuePoint[] = [];

  // Generar datos para cada día
  for (let i = 0; i < days; i++) {
    // Calcular timestamp del día (medianoche)
    const daysAgo = days - i - 1;
    const timestamp = Date.now() - daysAgo * 86400000; // 86400000 ms = 1 día

    // Simular ingreso aleatorio entre $100 y $1000
    const amount = Math.floor(Math.random() * 90000) + 10000; // 10000-100000 centavos

    // Crear tupla: [timestamp, amount]
    // TypeScript verifica que el orden y tipos sean correctos
    const point: RevenuePoint = [timestamp, amount];

    // Agregar al array
    data.push(point);
  }

  return data;
}

/**
 * Tupla: Respuesta de API [success, data, error]
 *
 * Posición 0: success (boolean) - si la operación fue exitosa
 * Posición 1: data (T | null) - datos si success=true, null si no
 * Posición 2: error (string | null) - mensaje de error si success=false, null si no
 *
 * 🏢 USO REAL: APIs internas de Google usan este patrón para respuestas consistentes
 */
type ApiResponse<T> = [boolean, T | null, string | null];

/**
 * Función: Procesar pago y retornar respuesta estructurada
 *
 * @param amount - Monto a procesar
 * @returns Tupla [success, data, error]
 *
 * 🔑 CONCEPTO: Tuplas para retornos múltiples con semántica clara
 */
function processPaymentV2(amount: number): ApiResponse<Transaction> {
  // Validar monto
  if (amount <= 0) {
    // Retornar tupla de error
    // Posición 0: false (no exitoso)
    // Posición 1: null (no hay datos)
    // Posición 2: mensaje de error
    return [false, null, "El monto debe ser mayor a 0"];
  }

  // Simular procesamiento exitoso
  const transaction: Transaction = {
    id: `txn_${Date.now()}`,
    amount,
    currency: "USD",
    status: "completed",
    timestamp: Date.now(),
  };

  // Retornar tupla de éxito
  // Posición 0: true (exitoso)
  // Posición 1: datos de la transacción
  // Posición 2: null (no hay error)
  return [true, transaction, null];
}

/**
 * Tupla: Coordenadas geográficas [latitud, longitud]
 *
 * 🏢 USO REAL: Uber, DoorDash usan tuplas para coordenadas
 */
type Coordinates = [number, number];

/**
 * Función: Verificar si una transacción es de una región permitida
 *
 * @param location - Tupla [lat, lng]
 * @param allowedRegions - Array de tuplas de regiones permitidas
 * @returns boolean
 *
 * 💰 BILLING: Algunas procesadoras bloquean pagos de ciertas regiones
 */
function isLocationAllowed(
  location: Coordinates,
  allowedRegions: Coordinates[]
): boolean {
  // Destructuring de tupla: extraer valores por posición
  const [lat, lng] = location;

  // Verificar si está en alguna región permitida (simplificado)
  return allowedRegions.some(([regionLat, regionLng]) => {
    // Calcular distancia simple (en un sistema real usarías fórmula de Haversine)
    const distance = Math.sqrt(
      Math.pow(lat - regionLat, 2) + Math.pow(lng - regionLng, 2)
    );
    return distance < 10; // Dentro de 10 grados (muy simplificado)
  });
}

// ============================================
// TUPLAS CON NOMBRES (Named Tuples) - TypeScript 4.0+
// ============================================

/**
 * EJEMPLO 3: Tuplas con nombres para mejor legibilidad
 *
 * 🔑 CONCEPTO: Puedes dar nombres a las posiciones de una tupla
 * Esto mejora la documentación sin afectar el runtime
 */

/**
 * Tupla nombrada: Rango de fechas
 * [startDate, endDate]
 */
type DateRange = [startDate: number, endDate: number];

/**
 * Función: Filtrar transacciones por rango de fechas
 *
 * @param transactions - Array de transacciones
 * @param range - Tupla [startDate, endDate]
 * @returns Transacciones en el rango
 *
 * 💰 BILLING: Reportes financieros por período
 */
function filterByDateRange(
  transactions: Transaction[],
  range: DateRange
): Transaction[] {
  // Destructuring con nombres descriptivos
  const [startDate, endDate] = range;

  return transactions.filter(
    (txn) => txn.timestamp >= startDate && txn.timestamp <= endDate
  );
}

/**
 * Tupla nombrada: Estadísticas de pagos
 * [count, total, average]
 */
type PaymentStats = [count: number, totalAmount: number, averageAmount: number];

/**
 * Función: Calcular estadísticas de un array de transacciones
 *
 * @param transactions - Array de transacciones
 * @returns Tupla [count, total, average]
 *
 * 🏢 BIG TECH: Dashboards analíticos calculan estas métricas
 */
function calculateStats(transactions: Transaction[]): PaymentStats {
  // Filtrar solo completadas
  const completed = transactions.filter((txn) => txn.status === "completed");

  // Calcular count
  const count = completed.length;

  // Calcular total
  const totalAmount = completed.reduce((sum, txn) => sum + txn.amount, 0);

  // Calcular promedio
  const averageAmount = count > 0 ? totalAmount / count : 0;

  // Retornar tupla con valores calculados
  return [count, totalAmount, averageAmount];
}

// ============================================
// DEMOSTRACIÓN: Uso práctico
// ============================================

console.log("=".repeat(60));
console.log("🎯 DEMOSTRACIÓN: Arrays y Tuplas en Sistemas de Pago");
console.log("=".repeat(60));

// ARRAYS: Trabajar con lista de transacciones
console.log("\n📊 ARRAYS - Lista de Transacciones:");
console.log(`Total de transacciones: ${transactions.length}`);

const totalCompleted = calculateTotalCompleted(transactions);
console.log(`Total completado: $${(totalCompleted / 100).toFixed(2)}`);

const pendingIds = getPendingTransactionIds(transactions);
console.log(`Transacciones pendientes: ${pendingIds.join(", ")}`);

const sorted = sortByTimestamp(transactions);
console.log(`Más reciente: ${sorted[0].id} - $${(sorted[0].amount / 100).toFixed(2)}`);

// TUPLAS: Datos de ingresos
console.log("\n📈 TUPLAS - Datos de Ingresos (últimos 7 días):");
const revenueData = generateRevenueData(7);
revenueData.forEach(([timestamp, amount]) => {
  const date = new Date(timestamp).toLocaleDateString();
  console.log(`  ${date}: $${(amount / 100).toFixed(2)}`);
});

// TUPLAS: Respuesta de API
console.log("\n🔄 TUPLAS - Respuesta de API:");
const [success, data, error] = processPaymentV2(5999);
if (success && data) {
  console.log(`✅ Pago exitoso: ${data.id} - $${(data.amount / 100).toFixed(2)}`);
} else {
  console.log(`❌ Error: ${error}`);
}

// TUPLAS: Coordenadas geográficas
console.log("\n🌍 TUPLAS - Verificación de Ubicación:");
const userLocation: Coordinates = [40.7128, -74.006]; // Nueva York
const allowedRegions: Coordinates[] = [
  [40.7128, -74.006], // Nueva York
  [34.0522, -118.2437], // Los Angeles
  [41.8781, -87.6298], // Chicago
];
const allowed = isLocationAllowed(userLocation, allowedRegions);
console.log(`¿Ubicación permitida? ${allowed ? "✅ Sí" : "❌ No"}`);

// TUPLAS NOMBRADAS: Estadísticas
console.log("\n📊 TUPLAS NOMBRADAS - Estadísticas:");
const [count, total, average] = calculateStats(transactions);
console.log(`  Transacciones: ${count}`);
console.log(`  Total: $${(total / 100).toFixed(2)}`);
console.log(`  Promedio: $${(average / 100).toFixed(2)}`);

// ============================================
// CASOS DE USO EN BILLING & PAYMENTS
// ============================================

/**
 * 💰 APLICACIONES EN SISTEMAS DE BILLING:
 *
 * 1. HISTORIAL DE PAGOS (Arrays):
 *    - Transaction[] - lista de todas las transacciones
 *    - Invoice[] - lista de facturas
 *    - Refund[] - lista de reembolsos
 *
 * 2. BATCH PROCESSING (Arrays):
 *    - PaymentBatch[] - procesar múltiples pagos a la vez
 *    - Useful para payroll, subscriptions mensuales
 *
 * 3. TIME SERIES DATA (Tuplas):
 *    - [timestamp, amount][] - ingresos por tiempo
 *    - [date, revenue, costs][] - métricas financieras
 *
 * 4. API RESPONSES (Tuplas):
 *    - [success, data, error] - respuestas consistentes
 *    - [statusCode, body, headers] - HTTP responses
 *
 * 5. GEOLOCATION (Tuplas):
 *    - [lat, lng] - ubicación de transacciones
 *    - Útil para detección de fraude y compliance
 *
 * 6. MULTI-CURRENCY (Arrays + Tuplas):
 *    - [currency, amount][] - múltiples monedas
 *    - Ejemplo: [["USD", 100], ["EUR", 85], ["GBP", 73]]
 *
 * 7. REPORTES FINANCIEROS (Arrays de Tuplas):
 *    - [period, revenue, expenses, profit][]
 *    - Dashboard analytics
 */

console.log("\n" + "=".repeat(60));
console.log("💡 ARRAYS vs TUPLAS - ¿Cuándo usar cada uno?");
console.log("=".repeat(60));

/**
 * 🤔 ARRAYS vs TUPLAS:
 *
 * USAR ARRAYS cuando:
 * ✅ Cantidad de elementos es variable/desconocida
 * ✅ Todos los elementos tienen el mismo tipo y significado
 * ✅ Necesitas iterar sobre todos los elementos
 * ✅ El orden no tiene semántica especial
 * Ejemplo: lista de transacciones, lista de usuarios
 *
 * USAR TUPLAS cuando:
 * ✅ Cantidad de elementos es fija y conocida
 * ✅ Cada posición tiene un tipo y significado diferente
 * ✅ El orden tiene semántica (posición 0 = X, posición 1 = Y)
 * ✅ Quieres retornar múltiples valores de una función
 * Ejemplo: coordenadas [lat, lng], respuestas [success, data, error]
 *
 * ERRORES COMUNES:
 * ❌ Usar tuplas cuando necesitas agregar/quitar elementos dinámicamente
 * ❌ Usar arrays cuando cada posición tiene significado diferente
 * ❌ Confundir tuplas con objetos (usa objetos si necesitas nombres de propiedades)
 */

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Cuándo usarías un array vs un Set para almacenar IDs de transacciones?
 *    Pista: Piensa en duplicados y performance de búsqueda
 *
 * 2. ¿Cómo manejarías un array muy grande de transacciones sin consumir mucha memoria?
 *    Pista: Investiga iteradores, generators, y paginación
 *
 * 3. ¿Por qué las tuplas no son tan comunes en JavaScript pero sí en otros lenguajes?
 *    Pista: Piensa en objetos vs tuplas para datos estructurados
 *
 * 4. ¿Cuándo preferirías [success, data, error] vs un objeto {success, data, error}?
 *    Pista: Performance vs legibilidad
 *
 * 5. ¿Cómo harías una tupla de más de 10 elementos mantenible?
 *    Pista: Quizás una tupla no es la mejor opción...
 *
 * 6. ¿Qué pasa si intentas mutar una tupla en TypeScript?
 *    Pista: Investiga readonly tuplas
 *
 * 7. ¿Cómo representarías una matriz (2D array) de forma type-safe?
 *    Pista: number[][] vs tuplas de tuplas
 *
 * 8. ¿Qué problemas de performance pueden surgir con arrays grandes?
 *    Pista: Time complexity de operaciones como filter, map, sort
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Crea una función que reciba un array de amounts y retorne [min, max, avg]
 *    Input: numbers[]
 *    Output: [number, number, number]
 *
 * 2. INTERMEDIO:
 *    Implementa una función de paginación para transacciones
 *    Input: transactions[], pageSize, pageNumber
 *    Output: [items[], hasNext, hasPrev, totalPages]
 *
 * 3. AVANZADO:
 *    Crea un sistema de batch processing que agrupe transacciones
 *    - Por fecha (mismo día)
 *    - Calcule totales por grupo
 *    - Retorne Map<date, [count, total]>
 *
 * 4. EXPERTO:
 *    Implementa un sistema de time-series aggregation:
 *    - Input: [timestamp, amount][] (granularidad por minuto)
 *    - Output: [timestamp, amount][] (granularidad por hora/día)
 *    - Maneja múltiples estrategias de agregación (sum, avg, max)
 */

console.log("\n" + "=".repeat(60));
console.log("✨ Fin del ejercicio - ¡Experimenta con arrays y tuplas!");
console.log("=".repeat(60));

export {
  Transaction,
  RevenuePoint,
  ApiResponse,
  Coordinates,
  DateRange,
  PaymentStats,
  calculateTotalCompleted,
  getPendingTransactionIds,
  sortByTimestamp,
  generateRevenueData,
  processPaymentV2,
  isLocationAllowed,
  filterByDateRange,
  calculateStats,
};
