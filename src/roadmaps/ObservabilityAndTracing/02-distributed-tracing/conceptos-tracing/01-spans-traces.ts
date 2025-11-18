/**
 * ==========================================
 * SPANS Y TRACES - DISTRIBUTED TRACING
 * ==========================================
 *
 * En sistemas distribuidos (microservicios, serverless), un request puede
 * pasar por 10+ servicios. Distributed tracing te permite seguir el flujo
 * completo y ver dónde está lento o falla.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Trace: El viaje completo de un request
 * - Span: Una operación específica dentro del trace
 * - Parent-Child: Relaciones jerárquicas entre spans
 * - Context Propagation: Pasar trace context entre servicios
 *
 * 🏢 USO EN PRODUCCIÓN:
 * - Google Dapper: Sistema interno de Google (paper original de 2010)
 * - AWS X-Ray: Tracing para servicios AWS
 * - Datadog APM: Tracing enterprise
 * - OpenTelemetry: Estándar vendor-neutral
 *
 * 💡 POR QUÉ ES CRÍTICO:
 * Sin tracing:
 * - "Este endpoint es lento" → ¿Pero dónde exactamente?
 * - "Error 500" → ¿Qué servicio falló?
 * - Debugging toma horas revisando logs de múltiples servicios
 *
 * Con tracing:
 * - Ves EXACTAMENTE qué operación toma 2 segundos
 * - Ves el flujo completo: API → Lambda → DynamoDB → S3
 * - Debugging en minutos
 */

// ============================================
// CONCEPTOS FUNDAMENTALES
// ============================================

/**
 * SPAN: Una operación específica con start y end time
 */
interface Span {
  // Identificadores
  traceId: string; // ID del trace completo (mismo para todos los spans)
  spanId: string; // ID único de este span
  parentSpanId?: string; // ID del span padre (si existe)

  // Información de la operación
  name: string; // Nombre descriptivo (ej: "GET /api/users")
  kind: 'SERVER' | 'CLIENT' | 'PRODUCER' | 'CONSUMER' | 'INTERNAL';

  // Timing
  startTime: number; // Timestamp en ms
  endTime?: number; // Timestamp en ms
  duration?: number; // Duración en ms (endTime - startTime)

  // Metadata
  attributes?: Record<string, unknown>; // Metadata key-value
  events?: SpanEvent[]; // Eventos que ocurrieron durante el span
  status?: SpanStatus; // Status del span
}

interface SpanEvent {
  name: string;
  timestamp: number;
  attributes?: Record<string, unknown>;
}

interface SpanStatus {
  code: 'OK' | 'ERROR' | 'UNSET';
  message?: string;
}

/**
 * TRACE: Colección de spans relacionados
 */
interface Trace {
  traceId: string;
  spans: Span[];
  rootSpan: Span; // Primer span (request inicial)
}

// ============================================
// IMPLEMENTACIÓN SIMPLE DE TRACER
// ============================================

class SimpleTracer {
  private spans: Map<string, Span> = new Map();
  private currentSpan: Span | null = null;

  /**
   * Iniciar un nuevo span
   */
  startSpan(
    name: string,
    options?: {
      traceId?: string;
      parentSpanId?: string;
      kind?: Span['kind'];
      attributes?: Record<string, unknown>;
    },
  ): Span {
    const span: Span = {
      traceId: options?.traceId || this.generateTraceId(),
      spanId: this.generateSpanId(),
      parentSpanId: options?.parentSpanId || this.currentSpan?.spanId,
      name,
      kind: options?.kind || 'INTERNAL',
      startTime: Date.now(),
      attributes: options?.attributes || {},
      events: [],
    };

    this.spans.set(span.spanId, span);
    this.currentSpan = span;

    return span;
  }

  /**
   * Finalizar un span
   */
  endSpan(span: Span): void {
    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;

    // Set parent as current span
    if (span.parentSpanId) {
      this.currentSpan = this.spans.get(span.parentSpanId) || null;
    } else {
      this.currentSpan = null;
    }
  }

  /**
   * Añadir evento a un span
   */
  addEvent(span: Span, name: string, attributes?: Record<string, unknown>): void {
    span.events = span.events || [];
    span.events.push({
      name,
      timestamp: Date.now(),
      attributes,
    });
  }

  /**
   * Añadir atributo a un span
   */
  setAttribute(span: Span, key: string, value: unknown): void {
    span.attributes = span.attributes || {};
    span.attributes[key] = value;
  }

  /**
   * Marcar span con error
   */
  recordError(span: Span, error: Error): void {
    span.status = {
      code: 'ERROR',
      message: error.message,
    };

    this.addEvent(span, 'exception', {
      'exception.type': error.name,
      'exception.message': error.message,
      'exception.stacktrace': error.stack,
    });
  }

  /**
   * Obtener todos los spans de un trace
   */
  getTrace(traceId: string): Trace | null {
    const traceSpans = Array.from(this.spans.values()).filter(
      (span) => span.traceId === traceId,
    );

    if (traceSpans.length === 0) return null;

    const rootSpan = traceSpans.find((span) => !span.parentSpanId);
    if (!rootSpan) return null;

    return {
      traceId,
      spans: traceSpans,
      rootSpan,
    };
  }

  private generateTraceId(): string {
    return 'trace-' + Math.random().toString(36).substring(2, 15);
  }

  private generateSpanId(): string {
    return 'span-' + Math.random().toString(36).substring(2, 10);
  }
}

// ============================================
// EJEMPLO 1: TRACE SIMPLE (UN SERVICIO)
// ============================================

async function simpleTraceExample(): Promise<void> {
  const tracer = new SimpleTracer();

  console.log('\n=== EJEMPLO 1: Trace Simple ===\n');

  // 1. Root span: HTTP request
  const httpSpan = tracer.startSpan('GET /api/users/123', {
    kind: 'SERVER',
    attributes: {
      'http.method': 'GET',
      'http.url': '/api/users/123',
      'http.status_code': 200,
    },
  });

  // 2. Child span: Database query
  const dbSpan = tracer.startSpan('SELECT users WHERE id = ?', {
    traceId: httpSpan.traceId,
    kind: 'CLIENT',
    attributes: {
      'db.system': 'postgresql',
      'db.statement': 'SELECT * FROM users WHERE id = $1',
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 50)); // Simular query (50ms)
  tracer.addEvent(dbSpan, 'query_executed', { rowsReturned: 1 });
  tracer.endSpan(dbSpan);

  // 3. Child span: External API call
  const apiSpan = tracer.startSpan('GET https://api.external.com/profile', {
    traceId: httpSpan.traceId,
    kind: 'CLIENT',
    attributes: {
      'http.method': 'GET',
      'http.url': 'https://api.external.com/profile',
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 120)); // Simular API call (120ms)
  tracer.endSpan(apiSpan);

  tracer.endSpan(httpSpan);

  // Visualizar trace
  const trace = tracer.getTrace(httpSpan.traceId);
  if (trace) {
    console.log(`Trace ID: ${trace.traceId}`);
    console.log(`Total Duration: ${trace.rootSpan.duration}ms\n`);

    trace.spans.forEach((span) => {
      const indent = '  '.repeat(span.parentSpanId ? 1 : 0);
      console.log(`${indent}${span.name}`);
      console.log(`${indent}  Duration: ${span.duration}ms`);
      console.log(`${indent}  Attributes:`, span.attributes);
      if (span.events && span.events.length > 0) {
        console.log(`${indent}  Events:`, span.events.map((e) => e.name).join(', '));
      }
    });
  }
}

// ============================================
// EJEMPLO 2: TRACE DISTRIBUIDO (MÚLTIPLES SERVICIOS)
// ============================================

/**
 * Simula un request que pasa por:
 * API Gateway → Lambda Auth → Lambda Orders → DynamoDB → EventBridge
 */

async function distributedTraceExample(): Promise<void> {
  const tracer = new SimpleTracer();

  console.log('\n=== EJEMPLO 2: Trace Distribuido ===\n');

  // Servicio 1: API Gateway
  const apiGatewaySpan = tracer.startSpan('POST /api/orders', {
    kind: 'SERVER',
    attributes: {
      'http.method': 'POST',
      'http.route': '/api/orders',
      'service.name': 'api-gateway',
    },
  });

  // Servicio 2: Lambda Authorizer
  const authSpan = tracer.startSpan('authorizeRequest', {
    traceId: apiGatewaySpan.traceId,
    kind: 'INTERNAL',
    attributes: {
      'service.name': 'lambda-authorizer',
      'function.name': 'AuthorizerFunction',
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 30)); // Auth: 30ms
  tracer.setAttribute(authSpan, 'auth.userId', 'user-123');
  tracer.endSpan(authSpan);

  // Servicio 3: Lambda Orders
  const ordersSpan = tracer.startSpan('processOrder', {
    traceId: apiGatewaySpan.traceId,
    kind: 'INTERNAL',
    attributes: {
      'service.name': 'lambda-orders',
      'function.name': 'OrdersFunction',
    },
  });

  // Nested: DynamoDB PutItem
  const dynamoSpan = tracer.startSpan('DynamoDB.PutItem', {
    traceId: apiGatewaySpan.traceId,
    kind: 'CLIENT',
    attributes: {
      'db.system': 'dynamodb',
      'db.operation': 'PutItem',
      'db.table': 'Orders',
      'aws.region': 'us-east-1',
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 80)); // DynamoDB: 80ms
  tracer.addEvent(dynamoSpan, 'item_created', { orderId: 'order-456' });
  tracer.endSpan(dynamoSpan);

  // Nested: EventBridge PutEvents
  const eventBridgeSpan = tracer.startSpan('EventBridge.PutEvents', {
    traceId: apiGatewaySpan.traceId,
    kind: 'PRODUCER',
    attributes: {
      'messaging.system': 'eventbridge',
      'messaging.destination': 'OrdersEventBus',
      'event.type': 'OrderCreated',
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 25)); // EventBridge: 25ms
  tracer.endSpan(eventBridgeSpan);

  tracer.endSpan(ordersSpan);
  tracer.endSpan(apiGatewaySpan);

  // Visualizar trace completo
  const trace = tracer.getTrace(apiGatewaySpan.traceId);
  if (trace) {
    console.log(`Trace ID: ${trace.traceId}`);
    console.log(`Total E2E Duration: ${trace.rootSpan.duration}ms\n`);

    // Árbol de spans
    console.log('Trace Waterfall:');
    visualizeTrace(trace);

    // Análisis
    console.log('\nBottleneck Analysis:');
    const sortedByDuration = [...trace.spans].sort(
      (a, b) => (b.duration || 0) - (a.duration || 0),
    );
    sortedByDuration.slice(0, 3).forEach((span, i) => {
      console.log(
        `${i + 1}. ${span.name}: ${span.duration}ms (${span.attributes?.['service.name'] || 'unknown'})`,
      );
    });
  }
}

function visualizeTrace(trace: Trace): void {
  const spansByParent = new Map<string | undefined, Span[]>();

  trace.spans.forEach((span) => {
    const parent = span.parentSpanId;
    if (!spansByParent.has(parent)) {
      spansByParent.set(parent, []);
    }
    spansByParent.get(parent)!.push(span);
  });

  function printSpan(span: Span, depth: number): void {
    const indent = '  '.repeat(depth);
    const bar = '█'.repeat(Math.floor((span.duration || 0) / 10));
    console.log(`${indent}├─ ${span.name} (${span.duration}ms) ${bar}`);

    const children = spansByParent.get(span.spanId) || [];
    children.forEach((child) => printSpan(child, depth + 1));
  }

  printSpan(trace.rootSpan, 0);
}

// ============================================
// EJEMPLO 3: ERROR TRACKING CON SPANS
// ============================================

async function errorTrackingExample(): Promise<void> {
  const tracer = new SimpleTracer();

  console.log('\n=== EJEMPLO 3: Error Tracking ===\n');

  const rootSpan = tracer.startSpan('processPayment', {
    kind: 'SERVER',
  });

  try {
    // Operación que falla
    const paymentSpan = tracer.startSpan('chargeCard', {
      traceId: rootSpan.traceId,
      attributes: {
        'payment.amount': 99.99,
        'payment.currency': 'USD',
      },
    });

    // Simular error
    throw new Error('Card declined: Insufficient funds');
  } catch (error) {
    const paymentSpan = tracer.startSpan('chargeCard', {
      traceId: rootSpan.traceId,
    });

    // Registrar error en el span
    tracer.recordError(paymentSpan, error as Error);
    tracer.endSpan(paymentSpan);

    // Propagar error al root span
    tracer.recordError(rootSpan, error as Error);
  } finally {
    tracer.endSpan(rootSpan);
  }

  // Ver trace con error
  const trace = tracer.getTrace(rootSpan.traceId);
  if (trace) {
    console.log('Trace with Error:');
    trace.spans.forEach((span) => {
      console.log(`\n${span.name}:`);
      console.log(`  Status: ${span.status?.code || 'OK'}`);
      if (span.status?.code === 'ERROR') {
        console.log(`  Error: ${span.status.message}`);
      }
      if (span.events && span.events.length > 0) {
        console.log('  Events:', span.events);
      }
    });
  }
}

// ============================================
// DEMOSTRACIÓN
// ============================================

console.log('='.repeat(60));
console.log('🔍 SPANS Y TRACES - DISTRIBUTED TRACING');
console.log('='.repeat(60));

(async () => {
  await simpleTraceExample();
  await distributedTraceExample();
  await errorTrackingExample();

  console.log('\n' + '='.repeat(60));
  console.log('💡 KEY TAKEAWAYS');
  console.log('='.repeat(60));
  console.log('✅ Trace = Viaje completo de un request');
  console.log('✅ Span = Operación individual dentro del trace');
  console.log('✅ Parent-child = Relaciones jerárquicas');
  console.log('✅ Context propagation = Pasar traceId entre servicios');
  console.log('✅ Attributes = Metadata para filtrar y buscar');
  console.log('✅ Events = Puntos importantes durante el span');
})();

/**
 * ============================================
 * MEJORES PRÁCTICAS
 * ============================================
 *
 * 1. NAMING:
 *    - Descriptivo: "DynamoDB.PutItem" no "db query"
 *    - Consistente: Usa convenciones (HTTP: "GET /path")
 *
 * 2. ATTRIBUTES:
 *    - Sigue semantic conventions (OpenTelemetry)
 *    - http.method, http.status_code, db.system, etc.
 *
 * 3. SPAN LIFECYCLE:
 *    - Siempre cierra spans (endSpan)
 *    - Usa try/finally para garantizar cierre
 *
 * 4. CONTEXT PROPAGATION:
 *    - Propaga traceId en headers HTTP
 *    - W3C Trace Context standard
 *
 * 5. SAMPLING:
 *    - No traces de TODO (costoso)
 *    - Samplea % de requests
 *    - Siempre captura errores
 */

export { Span, Trace, SpanEvent, SpanStatus, SimpleTracer };
