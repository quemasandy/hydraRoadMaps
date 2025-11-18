/**
 * ==========================================
 * SLI (SERVICE LEVEL INDICATORS) - DEFINICIÓN
 * ==========================================
 *
 * Un SLI es una métrica cuantitativa de algún aspecto del nivel de servicio.
 * Los SLIs son la base para definir SLOs (objetivos) y medir la confiabilidad.
 *
 * 📚 CONCEPTOS CLAVE:
 * - SLI: Métrica específica (ej: latencia p99 = 500ms)
 * - Debe ser medible y objetivo
 * - Base para SLOs
 * - User-centric (importa al usuario)
 *
 * 🏢 USO EN BIG TECH:
 * - Google SRE: Inventó el concepto de SLI/SLO
 * - Amazon: 99.99% availability SLA
 * - Todos los servicios tienen SLIs definidos
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Sin SLIs:
 * - No sabes si el servicio es "confiable"
 * - Debates subjetivos: "¿Es rápido?" vs "Latencia p99 < 500ms"
 * - No puedes medir mejoras
 * - No sabes cuándo alertar
 */

// ============================================
// TIPOS DE SLIs COMUNES
// ============================================

/**
 * 1. AVAILABILITY (Disponibilidad)
 * ¿El servicio está disponible cuando los usuarios lo necesitan?
 */
interface AvailabilitySLI {
  type: 'availability';
  measurement: 'request-based' | 'time-based';
  definition: string;
  calculation: string;
}

const availabilitySLI: AvailabilitySLI = {
  type: 'availability',
  measurement: 'request-based',
  definition: 'Porcentaje de requests exitosos (HTTP 200-299, 400-499)',
  calculation: '(successful_requests / total_requests) * 100',
};

/**
 * Ejemplo de cálculo
 */
function calculateAvailability(successfulRequests: number, totalRequests: number): number {
  return (successfulRequests / totalRequests) * 100;
}

// Ejemplo
console.log('\n=== AVAILABILITY SLI ===');
console.log('Definición:', availabilitySLI.definition);
console.log('Total requests: 10,000');
console.log('Successful: 9,950');
console.log('Availability:', calculateAvailability(9950, 10000).toFixed(3) + '%');
// Output: 99.500%

/**
 * 2. LATENCY (Latencia)
 * ¿Qué tan rápido responde el servicio?
 */
interface LatencySLI {
  type: 'latency';
  percentile: 'p50' | 'p90' | 'p95' | 'p99' | 'p99.9';
  threshold: number; // en ms
  definition: string;
}

const latencySLI: LatencySLI = {
  type: 'latency',
  percentile: 'p99',
  threshold: 500,
  definition: 'El 99% de requests deben completarse en menos de 500ms',
};

/**
 * Calcular percentil (simplified)
 */
function calculatePercentile(values: number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index];
}

// Ejemplo
const latencies = Array.from({ length: 1000 }, () => Math.random() * 600);
const p99 = calculatePercentile(latencies, 99);
console.log('\n=== LATENCY SLI ===');
console.log('Definición:', latencySLI.definition);
console.log('P99 actual:', p99.toFixed(2) + 'ms');
console.log('Threshold:', latencySLI.threshold + 'ms');
console.log('Status:', p99 < latencySLI.threshold ? '✅ PASS' : '❌ FAIL');

/**
 * 3. ERROR RATE (Tasa de error)
 * ¿Qué porcentaje de requests fallan?
 */
interface ErrorRateSLI {
  type: 'error-rate';
  threshold: number; // porcentaje
  definition: string;
  calculation: string;
}

const errorRateSLI: ErrorRateSLI = {
  type: 'error-rate',
  threshold: 1.0, // Máximo 1% de errores
  definition: 'Menos del 1% de requests deben resultar en error (5xx)',
  calculation: '(error_requests / total_requests) * 100',
};

function calculateErrorRate(errorRequests: number, totalRequests: number): number {
  return (errorRequests / totalRequests) * 100;
}

// Ejemplo
console.log('\n=== ERROR RATE SLI ===');
console.log('Definición:', errorRateSLI.definition);
const totalReqs = 100000;
const errorReqs = 500;
const errorRate = calculateErrorRate(errorReqs, totalReqs);
console.log(`Error Rate: ${errorRate.toFixed(3)}% (${errorReqs}/${totalReqs})`);
console.log('Threshold:', errorRateSLI.threshold + '%');
console.log('Status:', errorRate < errorRateSLI.threshold ? '✅ PASS' : '❌ FAIL');

/**
 * 4. THROUGHPUT (Capacidad)
 * ¿Cuántos requests puede manejar el servicio?
 */
interface ThroughputSLI {
  type: 'throughput';
  threshold: number; // requests per second
  definition: string;
}

const throughputSLI: ThroughputSLI = {
  type: 'throughput',
  threshold: 1000,
  definition: 'El servicio debe soportar al menos 1,000 requests/segundo',
};

// ============================================
// SLI SPECIFICATION (Especificación Completa)
// ============================================

/**
 * Definición completa de un SLI
 */
interface SLISpecification {
  name: string;
  description: string;
  type: 'availability' | 'latency' | 'error-rate' | 'throughput';
  measurement: {
    metric: string; // Métrica específica
    aggregation: 'avg' | 'sum' | 'count' | 'percentile';
    window: string; // Ventana de tiempo (1m, 5m, 1h, 1d)
  };
  threshold: number;
  unit: string;
  goodEvents: string; // Qué considera "bueno"
  totalEvents: string; // Total de eventos
}

// Ejemplo: API Availability SLI
const apiAvailabilitySLI: SLISpecification = {
  name: 'API Availability',
  description: 'Porcentaje de requests HTTP exitosos',
  type: 'availability',
  measurement: {
    metric: 'http_requests_total',
    aggregation: 'count',
    window: '1d', // Ventana de 1 día
  },
  threshold: 99.9, // 99.9% availability
  unit: '%',
  goodEvents: 'http_requests_total{status=~"2..|3..|4.."}', // 2xx, 3xx, 4xx
  totalEvents: 'http_requests_total', // Todos los requests
};

// Ejemplo: API Latency SLI
const apiLatencySLI: SLISpecification = {
  name: 'API Latency P99',
  description: '99% de requests completados en menos de 500ms',
  type: 'latency',
  measurement: {
    metric: 'http_request_duration_ms',
    aggregation: 'percentile',
    window: '1d',
  },
  threshold: 500,
  unit: 'ms',
  goodEvents: 'http_request_duration_ms < 500', // Requests < 500ms
  totalEvents: 'http_requests_total', // Todos los requests
};

console.log('\n=== SLI SPECIFICATIONS ===');
console.log('\n1. API Availability SLI:');
console.log(JSON.stringify(apiAvailabilitySLI, null, 2));
console.log('\n2. API Latency SLI:');
console.log(JSON.stringify(apiLatencySLI, null, 2));

// ============================================
// IMPLEMENTACIÓN: SLI TRACKER
// ============================================

/**
 * Sistema para trackear SLIs en tiempo real
 */
class SLITracker {
  private goodEvents: number = 0;
  private totalEvents: number = 0;

  constructor(private sli: SLISpecification) {}

  // Registrar un evento
  recordEvent(isGood: boolean): void {
    this.totalEvents++;
    if (isGood) {
      this.goodEvents++;
    }
  }

  // Calcular SLI actual
  calculateSLI(): number {
    if (this.totalEvents === 0) return 100;
    return (this.goodEvents / this.totalEvents) * 100;
  }

  // Verificar si cumple el threshold
  meetsThreshold(): boolean {
    return this.calculateSLI() >= this.sli.threshold;
  }

  // Reporte
  getReport(): {
    sliName: string;
    currentValue: number;
    threshold: number;
    status: 'PASS' | 'FAIL';
    goodEvents: number;
    totalEvents: number;
  } {
    const currentValue = this.calculateSLI();
    return {
      sliName: this.sli.name,
      currentValue,
      threshold: this.sli.threshold,
      status: this.meetsThreshold() ? 'PASS' : 'FAIL',
      goodEvents: this.goodEvents,
      totalEvents: this.totalEvents,
    };
  }

  reset(): void {
    this.goodEvents = 0;
    this.totalEvents = 0;
  }
}

// Ejemplo de uso
console.log('\n=== SLI TRACKING EXAMPLE ===');

const availabilityTracker = new SLITracker(apiAvailabilitySLI);

// Simular requests
for (let i = 0; i < 10000; i++) {
  const statusCode = Math.random() < 0.995 ? 200 : 500; // 99.5% success
  const isGood = statusCode >= 200 && statusCode < 500;
  availabilityTracker.recordEvent(isGood);
}

const report = availabilityTracker.getReport();
console.log('\nAvailability Report:');
console.log(`  SLI: ${report.sliName}`);
console.log(`  Current: ${report.currentValue.toFixed(3)}%`);
console.log(`  Threshold: ${report.threshold}%`);
console.log(`  Status: ${report.status}`);
console.log(`  Good/Total: ${report.goodEvents}/${report.totalEvents}`);

// ============================================
// MEJORES PRÁCTICAS
// ============================================

/**
 * ✅ CÓMO DEFINIR BUENOS SLIs:
 *
 * 1. USER-CENTRIC:
 *    - Enfócate en lo que importa al usuario
 *    - "Latencia" importa, "CPU usage" no tanto
 *
 * 2. MEDIBLE OBJETIVAMENTE:
 *    - No: "El servicio es rápido"
 *    - Sí: "P99 latency < 500ms"
 *
 * 3. ESPECÍFICO Y CUANTIFICABLE:
 *    - No: "Alta disponibilidad"
 *    - Sí: "99.9% availability"
 *
 * 4. ACTIONABLE:
 *    - Cuando el SLI falla, sabes qué arreglar
 *
 * 5. POCOS SLIs:
 *    - 3-5 SLIs por servicio
 *    - Más es difícil de mantener
 *
 * ❌ ANTI-PATTERNS:
 *
 * 1. INTERNAL METRICS COMO SLIs:
 *    - CPU, memoria, disk I/O
 *    - No impactan directamente al usuario
 *
 * 2. SLIs DEMASIADO AMBICIOSOS:
 *    - 100% availability → Imposible
 *    - P100 latency → Un outlier arruina todo
 *
 * 3. SLIs NO MEDIBLES:
 *    - "Buena UX"
 *    - "Servicio estable"
 */

// ============================================
// SLI DASHBOARD (CONCEPTUAL)
// ============================================

const sliDashboardExample = {
  service: 'Orders API',
  slis: [
    {
      name: 'Availability',
      current: 99.95,
      threshold: 99.9,
      status: 'PASS',
      trend: 'stable',
    },
    {
      name: 'Latency P99',
      current: 320,
      threshold: 500,
      unit: 'ms',
      status: 'PASS',
      trend: 'improving',
    },
    {
      name: 'Error Rate',
      current: 0.3,
      threshold: 1.0,
      unit: '%',
      status: 'PASS',
      trend: 'stable',
    },
  ],
  errorBudget: {
    remaining: 43.2, // minutos de downtime permitido este mes
    total: 43.8,
    consumed: 1.4, // % consumido
  },
};

console.log('\n=== SLI DASHBOARD ===');
console.log(JSON.stringify(sliDashboardExample, null, 2));

/**
 * ============================================
 * SIGUIENTES PASOS
 * ============================================
 *
 * 1. Define 3-5 SLIs para tu servicio
 * 2. Implementa tracking de SLIs
 * 3. Crea dashboards
 * 4. Define SLOs basados en SLIs (siguiente ejercicio)
 * 5. Calcula error budgets
 */

export {
  SLISpecification,
  SLITracker,
  availabilitySLI,
  latencySLI,
  errorRateSLI,
  throughputSLI,
  apiAvailabilitySLI,
  apiLatencySLI,
};
