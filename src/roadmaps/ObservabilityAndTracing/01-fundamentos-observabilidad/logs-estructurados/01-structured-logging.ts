/**
 * ==========================================
 * STRUCTURED LOGGING vs NO ESTRUCTURADO
 * ==========================================
 *
 * Structured logging es la práctica de escribir logs en formato estructurado
 * (JSON) en lugar de strings libres. Esto permite búsquedas y análisis eficientes.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Logs como datos, no como texto
 * - Búsqueda por campos específicos
 * - Agregación y análisis
 * - Context enrichment
 *
 * 🏢 USO EN BIG TECH:
 * - AWS Lambda Power Tools: Structured logging por defecto
 * - Google Cloud: Structured logs en Stackdriver
 * - Datadog, Splunk: Parsean JSON automáticamente
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Logs no estructurados:
 * - Difícil buscar "todos los errores del usuario X"
 * - Parsing manual con regex
 * - Imposible hacer agregaciones
 * - No puedes crear dashboards automáticos
 */

// ============================================
// ❌ LOGGING NO ESTRUCTURADO (MALO)
// ============================================

function badLoggingExample(): void {
  // Logs como strings libres
  console.log('User logged in');
  console.log('Processing order for user john@example.com with ID order-123');
  console.log('ERROR: Payment failed - card declined - amount: 99.99 - retry: 3');

  /**
   * PROBLEMAS:
   * 1. No puedes filtrar por user ID fácilmente
   * 2. No puedes buscar "todos los errores de pago"
   * 3. No puedes hacer queries como "orders > $50"
   * 4. Necesitas regex para parsear
   * 5. Formato inconsistente
   */
}

// ============================================
// ✅ STRUCTURED LOGGING (BUENO)
// ============================================

/**
 * Log Entry Structure
 */
interface LogEntry {
  timestamp: string; // ISO 8601
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'; // Nivel de log
  message: string; // Mensaje legible
  service: string; // Nombre del servicio
  context: Record<string, unknown>; // Contexto estructurado
  correlationId?: string; // ID para correlacionar requests
  userId?: string; // Usuario que triggereó el log
  traceId?: string; // Distributed tracing ID
}

class StructuredLogger {
  constructor(
    private serviceName: string,
    private defaultContext: Record<string, unknown> = {},
  ) {}

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    context: Record<string, unknown> = {},
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      context: {
        ...this.defaultContext,
        ...context,
      },
    };
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('DEBUG', message, context);
    console.log(JSON.stringify(entry));
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('INFO', message, context);
    console.log(JSON.stringify(entry));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('WARN', message, context);
    console.warn(JSON.stringify(entry));
  }

  error(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('ERROR', message, context);
    console.error(JSON.stringify(entry));
  }
}

// Ejemplo de uso
function goodLoggingExample(): void {
  const logger = new StructuredLogger('orders-service', {
    environment: 'production',
    region: 'us-east-1',
  });

  // Login event
  logger.info('User logged in', {
    userId: 'user-456',
    email: 'john@example.com',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
  });

  // Order processing
  logger.info('Processing order', {
    userId: 'user-456',
    orderId: 'order-123',
    amount: 99.99,
    currency: 'USD',
    itemCount: 3,
  });

  // Payment error
  logger.error('Payment processing failed', {
    userId: 'user-456',
    orderId: 'order-123',
    errorCode: 'CARD_DECLINED',
    errorMessage: 'Insufficient funds',
    amount: 99.99,
    retryAttempt: 3,
    paymentMethod: 'credit_card',
  });

  /**
   * VENTAJAS:
   * ✅ Búsqueda fácil: fields.userId = "user-456"
   * ✅ Filtrar errores: level = "ERROR" AND fields.errorCode = "CARD_DECLINED"
   * ✅ Agregaciones: SUM(fields.amount) WHERE level = "ERROR"
   * ✅ No necesitas regex
   * ✅ Formato consistente
   */
}

// ============================================
// CONTEXT ENRICHMENT
// ============================================

/**
 * Añadir contexto global a todos los logs
 */
class EnrichedLogger extends StructuredLogger {
  private enrichmentContext: Record<string, unknown> = {};

  // Añadir contexto que persiste en todos los logs
  addContext(key: string, value: unknown): void {
    this.enrichmentContext[key] = value;
  }

  // Eliminar contexto
  removeContext(key: string): void {
    delete this.enrichmentContext[key];
  }

  // Override para incluir enrichment context
  protected createLogEntry(
    level: LogEntry['level'],
    message: string,
    context: Record<string, unknown> = {},
  ): LogEntry {
    const baseEntry = super['createLogEntry'](level, message, context);
    return {
      ...baseEntry,
      context: {
        ...baseEntry.context,
        ...this.enrichmentContext, // ← Añadir contexto enriquecido
      },
    };
  }
}

// Ejemplo: Lambda handler con context enrichment
async function lambdaHandlerExample(event: { userId: string; requestId: string }): Promise<void> {
  const logger = new EnrichedLogger('lambda-function');

  // Enriquecer con request context
  logger.addContext('requestId', event.requestId);
  logger.addContext('userId', event.userId);

  // Todos los logs ahora incluyen requestId y userId automáticamente
  logger.info('Handler started');

  try {
    await processOrder();
    logger.info('Order processed successfully');
  } catch (error) {
    logger.error('Order processing failed', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
  }

  logger.info('Handler completed');
}

async function processOrder(): Promise<void> {
  // Simular procesamiento
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// ============================================
// LOG LEVELS Y CUÁNDO USARLOS
// ============================================

/**
 * Niveles de log estándar:
 * DEBUG < INFO < WARN < ERROR
 */

class LogLevelsExample {
  private logger = new StructuredLogger('example-service');

  demonstrateLogLevels(): void {
    // DEBUG: Información detallada para desarrollo
    // Solo habilitar en desarrollo o debugging temporal
    this.logger.debug('Database query executed', {
      query: 'SELECT * FROM users WHERE id = ?',
      params: ['user-123'],
      executionTime: 45,
    });

    this.logger.debug('Cache lookup', {
      cacheKey: 'user:user-123',
      hit: true,
      ttl: 3600,
    });

    // INFO: Eventos normales del negocio
    // Operaciones exitosas, milestones
    this.logger.info('User created account', {
      userId: 'user-123',
      email: 'john@example.com',
      plan: 'premium',
    });

    this.logger.info('Order completed', {
      orderId: 'order-456',
      amount: 99.99,
      status: 'completed',
    });

    // WARN: Algo no es ideal pero el sistema sigue funcionando
    // No es un error pero necesitas atención
    this.logger.warn('API rate limit approaching threshold', {
      currentRate: 950,
      limit: 1000,
      timeWindow: '1m',
    });

    this.logger.warn('Retrying failed operation', {
      operation: 'fetchUserData',
      attempt: 2,
      maxAttempts: 3,
    });

    // ERROR: Algo falló, necesita investigación
    // Operaciones que no se pudieron completar
    this.logger.error('Payment processing failed', {
      errorCode: 'PAYMENT_GATEWAY_TIMEOUT',
      orderId: 'order-789',
      amount: 149.99,
    });

    this.logger.error('Database connection failed', {
      host: 'db.example.com',
      error: 'Connection timeout after 30s',
      retryScheduled: true,
    });
  }
}

// ============================================
// CORRELATION IDS
// ============================================

/**
 * Correlation IDs permiten seguir un request a través de múltiples servicios
 */

class CorrelationIdLogger extends EnrichedLogger {
  setCorrelationId(correlationId: string): void {
    this.addContext('correlationId', correlationId);
  }

  setTraceId(traceId: string): void {
    this.addContext('traceId', traceId);
  }
}

// Ejemplo: Request que pasa por múltiples servicios
async function distributedSystemExample(): Promise<void> {
  const correlationId = 'req-' + Math.random().toString(36).substring(7);

  // Servicio 1: API Gateway
  const apiLogger = new CorrelationIdLogger('api-gateway');
  apiLogger.setCorrelationId(correlationId);
  apiLogger.info('Request received', {
    path: '/api/orders',
    method: 'POST',
  });

  // Servicio 2: Orders Service
  const ordersLogger = new CorrelationIdLogger('orders-service');
  ordersLogger.setCorrelationId(correlationId); // ← Mismo correlation ID
  ordersLogger.info('Creating order', {
    userId: 'user-123',
    items: 3,
  });

  // Servicio 3: Payment Service
  const paymentLogger = new CorrelationIdLogger('payment-service');
  paymentLogger.setCorrelationId(correlationId); // ← Mismo correlation ID
  paymentLogger.info('Processing payment', {
    amount: 99.99,
    method: 'credit_card',
  });

  /**
   * Ahora puedes buscar en logs:
   * fields.correlationId = "req-abc123"
   *
   * Y ver TODOS los logs de ese request a través de los 3 servicios!
   */
}

// ============================================
// BÚSQUEDAS EN CLOUDWATCH LOGS INSIGHTS
// ============================================

/**
 * Ejemplos de queries con structured logs
 */
const cloudWatchQueriesExamples = `
# 1. Buscar todos los errores de un usuario específico
fields @timestamp, message, context.errorCode
| filter level = "ERROR" and context.userId = "user-123"
| sort @timestamp desc
| limit 20

# 2. Contar errores por código de error
fields context.errorCode as ErrorCode
| filter level = "ERROR"
| stats count() by ErrorCode

# 3. Buscar todos los logs de un request específico (correlation ID)
fields @timestamp, service, message
| filter context.correlationId = "req-abc123"
| sort @timestamp asc

# 4. Calcular latencia promedio
fields context.duration as Duration
| filter message = "Request completed"
| stats avg(Duration), max(Duration), min(Duration)

# 5. Top usuarios con más errores
fields context.userId as UserId
| filter level = "ERROR"
| stats count() as ErrorCount by UserId
| sort ErrorCount desc
| limit 10

# 6. Errores de pago en las últimas 24 horas
fields @timestamp, context.orderId, context.errorCode, context.amount
| filter level = "ERROR" and service = "payment-service"
| filter @timestamp > ago(24h)
| sort @timestamp desc
`;

// ============================================
// DEMOSTRACIÓN
// ============================================

console.log('='.repeat(60));
console.log('📝 STRUCTURED LOGGING vs NO ESTRUCTURADO');
console.log('='.repeat(60));

console.log('\n❌ BAD: Logging no estructurado');
badLoggingExample();

console.log('\n✅ GOOD: Structured logging');
goodLoggingExample();

console.log('\n--- Log Levels Example ---');
new LogLevelsExample().demonstrateLogLevels();

console.log('\n--- Correlation ID Example ---');
distributedSystemExample();

console.log('\n--- CloudWatch Logs Insights Queries ---');
console.log(cloudWatchQueriesExamples);

/**
 * ============================================
 * MEJORES PRÁCTICAS
 * ============================================
 *
 * ✅ DO's:
 *
 * 1. USA JSON SIEMPRE:
 *    logger.info('User created', { userId: '123' })
 *
 * 2. AÑADE CORRELATION IDs:
 *    Propaga correlation ID en todos los servicios
 *
 * 3. LOG STRUCTURED DATA:
 *    context: { userId: '123', orderId: '456' }
 *
 * 4. INCLUYE TIMESTAMP:
 *    ISO 8601 format (2024-11-18T10:30:00.000Z)
 *
 * 5. NIVELES APROPIADOS:
 *    ERROR para failures
 *    WARN para anomalías
 *    INFO para business events
 *    DEBUG solo en desarrollo
 *
 * 6. AÑADE CONTEXTO:
 *    service, environment, region, version
 *
 * ❌ DON'Ts:
 *
 * 1. NO USES console.log('string'):
 *    Difícil de buscar y parsear
 *
 * 2. NO LOGS SECRETOS:
 *    Passwords, API keys, tokens
 *
 * 3. NO ALTA CARDINALIDAD:
 *    Evita loggear TODOS los user IDs en production (costo)
 *
 * 4. NO LOG BINARIES:
 *    No loggear imágenes, archivos, etc.
 *
 * 5. NO INCONSISTENTE:
 *    Mantén estructura consistente
 */

/**
 * ============================================
 * EJERCICIOS PRÁCTICOS
 * ============================================
 *
 * 1. BÁSICO:
 *    Convierte estos logs a structured logging:
 *    - "User john logged in from IP 192.168.1.1"
 *    - "ERROR: Payment failed, order 123, amount $99.99"
 *
 * 2. INTERMEDIO:
 *    Implementa un middleware de Express que:
 *    - Genera correlation ID
 *    - Loggea request/response
 *    - Mide duración
 *
 * 3. AVANZADO:
 *    Implementa context enrichment automático para:
 *    - User ID (desde JWT)
 *    - Request ID
 *    - Session ID
 *    - Trace ID
 */

export { LogEntry, StructuredLogger, EnrichedLogger, CorrelationIdLogger };
