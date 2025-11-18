/**
 * ==========================================
 * STRUCTURED LOGGING EN AWS LAMBDA
 * ==========================================
 *
 * Lambda tiene características específicas que requieren prácticas especiales
 * de logging. Este módulo cubre cómo implementar structured logging efectivo
 * en funciones Lambda.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Execution context y request ID
 * - CloudWatch Logs integration
 * - Cold start vs warm start logging
 * - AWS Lambda Powertools
 *
 * 🏢 USO EN PRODUCCIÓN:
 * - AWS Lambda Powertools: Librería oficial de AWS
 * - CloudWatch Logs Insights: Query language para logs
 * - Structured logging como estándar
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Sin structured logging en Lambda:
 * - Difícil correlacionar logs entre invocaciones
 * - No puedes buscar "todos los errores del usuario X"
 * - Debugging lleva horas
 * - No sabes si es cold start o warm start
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// ============================================
// IMPLEMENTACIÓN BÁSICA
// ============================================

/**
 * Logger estructurado para Lambda
 */
class LambdaLogger {
  private context: Record<string, unknown> = {};

  constructor(
    private serviceName: string,
    private persistentContext: Record<string, unknown> = {},
  ) {}

  // Añadir contexto de Lambda
  addLambdaContext(lambdaContext: Context): void {
    this.context = {
      ...this.context,
      requestId: lambdaContext.requestId, // Unique ID para esta invocación
      functionName: lambdaContext.functionName,
      functionVersion: lambdaContext.functionVersion,
      memoryLimitInMB: lambdaContext.memoryLimitInMB,
      awsRegion: process.env.AWS_REGION,
      logGroupName: lambdaContext.logGroupName,
      logStreamName: lambdaContext.logStreamName,
    };
  }

  // Añadir correlation ID desde event
  addCorrelationId(correlationId: string): void {
    this.context = {
      ...this.context,
      correlationId,
    };
  }

  private log(
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR',
    message: string,
    additionalContext?: Record<string, unknown>,
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      ...this.context,
      ...this.persistentContext,
      ...additionalContext,
    };

    // CloudWatch parsea JSON automáticamente
    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('DEBUG', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('INFO', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('WARN', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('ERROR', message, context);
  }
}

// ============================================
// EJEMPLO 1: LAMBDA HANDLER BÁSICO
// ============================================

const logger = new LambdaLogger('orders-service', {
  environment: process.env.ENVIRONMENT || 'dev',
});

export const basicHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  // 1. Añadir Lambda context al logger
  logger.addLambdaContext(context);

  // 2. Extraer correlation ID
  const correlationId =
    event.headers['x-correlation-id'] || event.requestContext.requestId || context.requestId;

  logger.addCorrelationId(correlationId);

  // 3. Log inicial del request
  logger.info('Handler invoked', {
    path: event.path,
    httpMethod: event.httpMethod,
    sourceIp: event.requestContext.identity.sourceIp,
  });

  try {
    // Simular lógica de negocio
    const body = event.body ? JSON.parse(event.body) : {};

    logger.info('Processing order', {
      orderId: body.orderId,
      userId: body.userId,
    });

    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 100));

    logger.info('Order processed successfully', {
      orderId: body.orderId,
      processingTime: 100,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify({
        message: 'Success',
        correlationId,
      }),
    };
  } catch (error) {
    logger.error('Handler failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify({
        error: 'Internal server error',
        correlationId,
      }),
    };
  } finally {
    logger.info('Handler completed', {
      remainingTime: context.getRemainingTimeInMillis(),
    });
  }
};

// ============================================
// EJEMPLO 2: COLD START DETECTION
// ============================================

/**
 * Detectar y loggear cold starts
 */

let isColdStart = true;

export const coldStartAwareHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const logger = new LambdaLogger('orders-service');
  logger.addLambdaContext(context);

  // Detectar cold start
  if (isColdStart) {
    logger.info('Cold start detected', {
      coldStart: true,
      initDuration: context.getRemainingTimeInMillis(),
    });

    isColdStart = false; // Subsecuentes invocaciones serán warm
  } else {
    logger.debug('Warm start', {
      coldStart: false,
    });
  }

  // Handler logic...
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'OK' }),
  };
};

// ============================================
// EJEMPLO 3: AWS LAMBDA POWERTOOLS
// ============================================

/**
 * Usando AWS Lambda Powertools (recomendado para producción)
 */

/*
// Instalar:
// npm install @aws-lambda-powertools/logger

import { Logger } from '@aws-lambda-powertools/logger';

const powertoolsLogger = new Logger({
  serviceName: 'orders-service',
  logLevel: process.env.LOG_LEVEL || 'INFO',
  persistentLogAttributes: {
    environment: process.env.ENVIRONMENT,
    version: process.env.VERSION,
  },
});

export const powertoolsHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Powertools añade Lambda context automáticamente
  powertoolsLogger.addContext(context);

  // Correlation ID
  const correlationId = event.headers['x-correlation-id'] || context.requestId;
  powertoolsLogger.appendKeys({ correlationId });

  powertoolsLogger.info('Processing request', {
    path: event.path,
    method: event.httpMethod,
  });

  try {
    // Business logic
    powertoolsLogger.debug('Debug info', { details: 'something' });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    powertoolsLogger.error('Error occurred', {
      error: error as Error,
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
*/

// ============================================
// CLOUDWATCH LOGS INSIGHTS QUERIES
// ============================================

/**
 * Queries útiles para logs estructurados en Lambda
 */
const cloudWatchQueriesForLambda = `
# 1. Buscar todos los cold starts
fields @timestamp, functionName, message
| filter coldStart = true
| sort @timestamp desc
| limit 50

# 2. Errores por función
fields @timestamp, functionName, error, correlationId
| filter level = "ERROR"
| stats count() by functionName
| sort count desc

# 3. Latencia promedio por endpoint
fields @timestamp, path, processingTime
| filter message = "Order processed successfully"
| stats avg(processingTime), max(processingTime), p99(processingTime) by path

# 4. Buscar todos los logs de un correlation ID
fields @timestamp, level, message, functionName
| filter correlationId = "abc-123"
| sort @timestamp asc

# 5. Memory usage (si añades métricas)
fields @timestamp, @memoryUsed, @maxMemoryUsed
| stats max(@memoryUsed), max(@maxMemoryUsed) by functionName

# 6. Errores en las últimas 24 horas
fields @timestamp, error, stack, correlationId
| filter level = "ERROR" and @timestamp > ago(24h)
| sort @timestamp desc

# 7. Top usuarios con más requests
fields userId
| filter userId exists
| stats count() as requestCount by userId
| sort requestCount desc
| limit 10
`;

// ============================================
// MEJORES PRÁCTICAS PARA LAMBDA
// ============================================

/**
 * ✅ DO's:
 *
 * 1. USA STRUCTURED LOGGING (JSON)
 *    Siempre JSON, nunca strings
 *
 * 2. AÑADE LAMBDA CONTEXT
 *    requestId, functionName, etc.
 *
 * 3. CORRELATION IDs
 *    Propaga desde API Gateway
 *
 * 4. LOG COLD STARTS
 *    Útil para debugging de performance
 *
 * 5. LOG REMAINING TIME
 *    Para detectar timeouts
 *
 * 6. USA LAMBDA POWERTOOLS
 *    Librería oficial, battle-tested
 *
 * ❌ DON'Ts:
 *
 * 1. NO LOGS SECRETOS
 *    Environment variables, tokens, passwords
 *
 * 2. NO OVER-LOGGING
 *    Cuesta dinero en CloudWatch
 *
 * 3. NO CONSOLE.LOG SIN ESTRUCTURA
 *    Difícil de buscar
 *
 * 4. NO LOGS SYNC
 *    console.log es async en Lambda
 */

// Ejemplo de estructura de log final
const exampleLogOutput = {
  timestamp: '2024-11-18T10:30:00.123Z',
  level: 'INFO',
  message: 'Processing order',
  service: 'orders-service',
  environment: 'production',
  requestId: 'abc-123-def-456',
  correlationId: 'corr-789',
  functionName: 'OrdersFunction',
  functionVersion: '$LATEST',
  memoryLimitInMB: 512,
  awsRegion: 'us-east-1',
  coldStart: false,
  path: '/api/orders',
  httpMethod: 'POST',
  orderId: 'order-123',
  userId: 'user-456',
};

console.log('='.repeat(60));
console.log('📝 STRUCTURED LOGGING EN AWS LAMBDA');
console.log('='.repeat(60));
console.log('\nEjemplo de log estructurado:');
console.log(JSON.stringify(exampleLogOutput, null, 2));
console.log('\nCloudWatch Logs Insights Queries:');
console.log(cloudWatchQueriesForLambda);

export { LambdaLogger, exampleLogOutput };
