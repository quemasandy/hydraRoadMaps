/**
 * ==========================================
 * LOS 3 PILARES DE LA OBSERVABILIDAD
 * ==========================================
 *
 * La observabilidad se basa en tres tipos fundamentales de datos:
 * 1. LOGS - Eventos discretos con timestamp
 * 2. METRICS - Valores numéricos agregados en el tiempo
 * 3. TRACES - Representación del flujo de requests en sistemas distribuidos
 *
 * 📚 CONCEPTOS CLAVE:
 * - Cada pilar responde preguntas diferentes
 * - Combinados dan visibilidad completa del sistema
 * - Necesitas los 3 para debugging efectivo
 *
 * 🏢 USO EN PRODUCCIÓN:
 * - Google usa los 3 pilares para todos sus servicios
 * - Netflix implementa observabilidad desde día 1
 * - Amazon requiere métricas y traces para todos los servicios
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Sin observabilidad:
 * - Debugging toma horas/días
 * - No sabes si el sistema está saludable
 * - Usuarios reportan problemas antes que tú
 * - Imposible hacer root cause analysis
 */

// ============================================
// PILAR 1: LOGS
// ============================================

/**
 * LOGS: Eventos discretos inmutables con timestamp
 *
 * ✅ Responde: "¿QUÉ pasó exactamente?"
 *
 * Ejemplos:
 * - "Usuario juan@example.com hizo login a las 10:30:45"
 * - "Request falló con error: Database connection timeout"
 * - "Order ID abc-123 fue creado con monto $99.99"
 */

interface LogEvent {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context?: Record<string, unknown>;
}

class SimpleLogger {
  log(level: LogEvent['level'], message: string, context?: Record<string, unknown>): void {
    const logEvent: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    // En producción: enviar a CloudWatch, Datadog, etc.
    console.log(JSON.stringify(logEvent));
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('INFO', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('ERROR', message, context);
  }
}

// Ejemplo de uso
const logger = new SimpleLogger();

logger.info('User logged in', {
  userId: 'user-123',
  email: 'juan@example.com',
  ipAddress: '192.168.1.1',
});

logger.error('Payment processing failed', {
  orderId: 'order-abc',
  errorCode: 'PAYMENT_DECLINED',
  amount: 99.99,
});

/**
 * 💡 CUÁNDO USAR LOGS:
 * ✅ Debugging específico: "¿Qué pasó en este request exactamente?"
 * ✅ Auditoría: "¿Quién hizo qué y cuándo?"
 * ✅ Análisis forense: Investigar incidentes pasados
 * ✅ Business events: "Usuario completó checkout"
 *
 * ❌ NO USAR LOGS PARA:
 * - Contar cosas (usa METRICS)
 * - Performance monitoring (usa METRICS y TRACES)
 * - Seguir request entre servicios (usa TRACES)
 */

// ============================================
// PILAR 2: METRICS
// ============================================

/**
 * METRICS: Valores numéricos agregados en el tiempo
 *
 * ✅ Responde: "¿CUÁNTO/CUÁNTOS y CÓMO EVOLUCIONA?"
 *
 * Tipos de métricas:
 * - Counter: Solo incrementa (ej: requests totales)
 * - Gauge: Sube y baja (ej: conexiones activas)
 * - Histogram: Distribución de valores (ej: latencias)
 */

class SimpleMetrics {
  private metrics: Map<string, number> = new Map();

  // Counter: solo incrementa
  incrementCounter(name: string, value: number = 1): void {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + value);
  }

  // Gauge: valor actual
  setGauge(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  // En producción: publicar a CloudWatch, Prometheus, etc.
  publishMetrics(): void {
    console.log('Publishing metrics:', Object.fromEntries(this.metrics));
  }
}

// Ejemplo de uso
const metrics = new SimpleMetrics();

// Contar requests
metrics.incrementCounter('api.requests.total');
metrics.incrementCounter('api.requests.total');
metrics.incrementCounter('api.requests.success');

// Estado actual del sistema
metrics.setGauge('api.connections.active', 42);
metrics.setGauge('database.connection_pool.available', 8);

// Contador de errores
metrics.incrementCounter('api.errors.total');

console.log('\n=== METRICS ===');
console.log('Total requests:', metrics.getMetric('api.requests.total')); // 2
console.log('Success requests:', metrics.getMetric('api.requests.success')); // 1
console.log('Active connections:', metrics.getMetric('api.connections.active')); // 42

/**
 * 💡 CUÁNDO USAR METRICS:
 * ✅ Monitoreo de salud del sistema: "¿CPU al 80%?"
 * ✅ Business KPIs: "¿Cuántos usuarios activos?"
 * ✅ SLOs/SLAs: "¿Latencia p99 < 500ms?"
 * ✅ Alerting: "¿Error rate > 1%?"
 * ✅ Dashboards: Gráficas de tendencias
 *
 * ❌ NO USAR METRICS PARA:
 * - Debugging específico (usa LOGS)
 * - Seguir flujo de requests (usa TRACES)
 */

// ============================================
// PILAR 3: TRACES (DISTRIBUTED TRACING)
// ============================================

/**
 * TRACES: Representación del flujo end-to-end de un request
 *
 * ✅ Responde: "¿POR DÓNDE pasó el request y CUÁNTO tardó cada paso?"
 *
 * Conceptos:
 * - Trace: Flujo completo de un request
 * - Span: Una operación dentro del trace (ej: llamada a DB)
 * - Parent-child: Relaciones entre spans
 */

interface Span {
  traceId: string; // ID único del trace completo
  spanId: string; // ID único de este span
  parentSpanId?: string; // ID del span padre
  name: string; // Nombre de la operación
  startTime: number;
  endTime?: number;
  duration?: number;
  attributes?: Record<string, unknown>;
}

class SimpleTracer {
  private spans: Span[] = [];

  startSpan(name: string, traceId: string, parentSpanId?: string): Span {
    const span: Span = {
      traceId,
      spanId: this.generateId(),
      parentSpanId,
      name,
      startTime: Date.now(),
    };

    this.spans.push(span);
    return span;
  }

  endSpan(span: Span): void {
    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
  }

  getSpans(): Span[] {
    return this.spans;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(7);
  }
}

// Ejemplo: Simular trace de un request
async function simulateDistributedRequest(): Promise<void> {
  const tracer = new SimpleTracer();
  const traceId = 'trace-' + Math.random().toString(36).substring(7);

  // 1. Root span: Request completo
  const rootSpan = tracer.startSpan('POST /api/orders', traceId);
  rootSpan.attributes = { httpMethod: 'POST', path: '/api/orders' };

  // 2. Child span: Autenticación
  const authSpan = tracer.startSpan('authenticateUser', traceId, rootSpan.spanId);
  await new Promise((resolve) => setTimeout(resolve, 20)); // Simular 20ms
  tracer.endSpan(authSpan);

  // 3. Child span: Validar datos
  const validateSpan = tracer.startSpan('validateOrderData', traceId, rootSpan.spanId);
  await new Promise((resolve) => setTimeout(resolve, 10)); // Simular 10ms
  tracer.endSpan(validateSpan);

  // 4. Child span: Query a base de datos
  const dbSpan = tracer.startSpan('DynamoDB.PutItem', traceId, rootSpan.spanId);
  dbSpan.attributes = { tableName: 'Orders', operation: 'PutItem' };
  await new Promise((resolve) => setTimeout(resolve, 50)); // Simular 50ms
  tracer.endSpan(dbSpan);

  // 5. Child span: Publicar evento
  const eventSpan = tracer.startSpan('EventBridge.PutEvents', traceId, rootSpan.spanId);
  await new Promise((resolve) => setTimeout(resolve, 15)); // Simular 15ms
  tracer.endSpan(eventSpan);

  tracer.endSpan(rootSpan);

  // Visualizar trace
  console.log('\n=== DISTRIBUTED TRACE ===');
  console.log(`Trace ID: ${traceId}`);
  tracer.getSpans().forEach((span) => {
    const indent = span.parentSpanId ? '  ' : '';
    console.log(
      `${indent}${span.name}: ${span.duration}ms ${span.attributes ? JSON.stringify(span.attributes) : ''}`,
    );
  });

  console.log(`\nTotal request time: ${rootSpan.duration}ms`);
}

/**
 * 💡 CUÁNDO USAR TRACES:
 * ✅ Debugging de latencia: "¿Dónde está lento el request?"
 * ✅ Sistemas distribuidos: "¿Qué servicio causó el error?"
 * ✅ Dependency mapping: "¿Qué servicios se llaman entre sí?"
 * ✅ Bottleneck identification: "¿Qué operación toma más tiempo?"
 *
 * ❌ NO USAR TRACES PARA:
 * - Debugging de lógica (usa LOGS)
 * - Agregaciones numéricas (usa METRICS)
 */

// ============================================
// COMBINANDO LOS 3 PILARES
// ============================================

/**
 * EJEMPLO REAL: Request que falla
 *
 * Escenario: API lenta, usuarios se quejan
 */

interface OrderRequest {
  orderId: string;
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
}

async function processOrderWithObservability(request: OrderRequest): Promise<void> {
  const logger = new SimpleLogger();
  const metrics = new SimpleMetrics();
  const tracer = new SimpleTracer();

  const traceId = `trace-${request.orderId}`;
  const rootSpan = tracer.startSpan('processOrder', traceId);

  try {
    // 1. LOG: Registrar request recibido
    logger.info('Processing order request', {
      orderId: request.orderId,
      userId: request.userId,
      itemCount: request.items.length,
      traceId, // ← Correlacionar logs con traces
    });

    // 2. METRIC: Incrementar contador
    metrics.incrementCounter('orders.requests.total');

    // 3. TRACE: Validación
    const validateSpan = tracer.startSpan('validateOrder', traceId, rootSpan.spanId);
    await new Promise((resolve) => setTimeout(resolve, 30));
    tracer.endSpan(validateSpan);

    // 4. TRACE: Guardar en DB (lento!)
    const dbSpan = tracer.startSpan('saveOrderToDatabase', traceId, rootSpan.spanId);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // ❌ 2 segundos!
    tracer.endSpan(dbSpan);

    // 5. METRIC: Success
    metrics.incrementCounter('orders.requests.success');

    // 6. LOG: Success
    logger.info('Order processed successfully', {
      orderId: request.orderId,
      processingTime: rootSpan.duration,
      traceId,
    });
  } catch (error) {
    // ERROR HANDLING CON OBSERVABILIDAD

    // 1. LOG: Error detallado
    logger.error('Order processing failed', {
      orderId: request.orderId,
      error: error instanceof Error ? error.message : 'Unknown error',
      traceId,
    });

    // 2. METRIC: Error counter
    metrics.incrementCounter('orders.requests.errors');

    // 3. TRACE: Marcar como error
    rootSpan.attributes = {
      ...rootSpan.attributes,
      error: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown',
    };
  } finally {
    tracer.endSpan(rootSpan);

    // Publicar métricas
    metrics.publishMetrics();

    // Analizar trace
    console.log('\n=== ANÁLISIS DE OBSERVABILIDAD ===');
    console.log('TRACE:');
    tracer.getSpans().forEach((span) => {
      const indent = span.parentSpanId ? '  ' : '';
      console.log(`${indent}${span.name}: ${span.duration}ms`);
    });

    // Identificar bottleneck
    const slowestSpan = tracer
      .getSpans()
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))[0];
    console.log(`\n🔥 BOTTLENECK: ${slowestSpan.name} (${slowestSpan.duration}ms)`);
  }
}

// ============================================
// DEMOSTRACIÓN
// ============================================

console.log('='.repeat(60));
console.log('🔍 LOS 3 PILARES DE LA OBSERVABILIDAD');
console.log('='.repeat(60));

// Ejecutar ejemplos
(async () => {
  console.log('\n--- PILAR 1: LOGS ---');
  // Ya ejecutado arriba

  console.log('\n--- PILAR 2: METRICS ---');
  // Ya ejecutado arriba

  console.log('\n--- PILAR 3: TRACES ---');
  await simulateDistributedRequest();

  console.log('\n--- COMBINANDO LOS 3 PILARES ---');
  await processOrderWithObservability({
    orderId: 'order-123',
    userId: 'user-456',
    items: [
      { productId: 'prod-1', quantity: 2 },
      { productId: 'prod-2', quantity: 1 },
    ],
  });

  console.log('\n=== CONCLUSIÓN ===');
  console.log('✅ LOGS: Te dicen QUÉ pasó exactamente');
  console.log('✅ METRICS: Te dicen CUÁNTO/CUÁNTOS y tendencias');
  console.log('✅ TRACES: Te dicen POR DÓNDE pasó el request y dónde está lento');
  console.log('\n💡 Los 3 pilares combinados = Sistema completamente observable');
})();

/**
 * ============================================
 * MEJORES PRÁCTICAS
 * ============================================
 *
 * 1. CORRELACIÓN:
 *    - Usa un Trace ID único para correlacionar logs, metrics y traces
 *    - Propaga el Trace ID en headers HTTP
 *
 * 2. STRUCTURED DATA:
 *    - Logs en JSON (no strings)
 *    - Métricas con dimensions/tags
 *    - Traces con attributes/metadata
 *
 * 3. SAMPLING:
 *    - No traces de TODO (costoso)
 *    - Samplea % de requests normales
 *    - Siempre captura errors
 *
 * 4. CARDINALIDAD:
 *    - No crear métricas por user ID (alta cardinalidad)
 *    - Agrupa por dimensiones razonables (región, tipo de request)
 *
 * 5. RETENTION:
 *    - Logs: 7-30 días
 *    - Metrics: 1-2 años (agregadas)
 *    - Traces: 7-30 días
 */

/**
 * ============================================
 * PREGUNTAS PARA REFLEXIONAR
 * ============================================
 *
 * 1. ¿Cuándo usarías LOGS vs METRICS para contar errores?
 *    Pista: Error rate = METRIC, Error details = LOGS
 *
 * 2. ¿Por qué es importante correlacionar los 3 pilares?
 *    Pista: Metric muestra spike → Logs muestran qué → Traces muestran dónde
 *
 * 3. ¿Qué pilar usarías para responder "¿Por qué la API es lenta?"
 *    Pista: TRACES muestran qué operación toma más tiempo
 *
 * 4. ¿Cómo detectarías un aumento de errores del 1% al 5%?
 *    Pista: METRICS con alerting
 *
 * 5. ¿Cómo investigarías por qué falló un request específico?
 *    Pista: LOGS con correlation ID + TRACES
 */

export {
  LogEvent,
  SimpleLogger,
  SimpleMetrics,
  Span,
  SimpleTracer,
  processOrderWithObservability,
};
