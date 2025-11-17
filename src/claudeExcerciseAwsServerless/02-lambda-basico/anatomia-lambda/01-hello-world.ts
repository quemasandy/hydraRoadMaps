/**
 * Hello World Lambda - Anatomía básica
 *
 * Este es el ejemplo más simple de una función Lambda.
 * Demuestra los conceptos fundamentales: handler, event, context
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

/**
 * ============================================================================
 * 1. Handler Signature - Forma más común
 * ============================================================================
 *
 * export const handler = async (event, context) => { ... }
 *
 * - handler: nombre de la función que Lambda invocará
 * - event: datos del trigger (API Gateway, S3, SQS, etc.)
 * - context: metadata de la ejecución
 * - async: Lambda soporta async/await nativamente
 */

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  // Log básico (va a CloudWatch Logs)
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  /**
   * Context contiene información útil:
   * - requestId: ID único de la invocación
   * - functionName: Nombre de la función Lambda
   * - functionVersion: Versión ($LATEST o número)
   * - memoryLimitInMB: Memoria asignada
   * - getRemainingTimeInMillis(): Tiempo restante antes de timeout
   */

  console.log('Request ID:', context.requestId);
  console.log('Function name:', context.functionName);
  console.log('Remaining time (ms):', context.getRemainingTimeInMillis());

  // Response para API Gateway
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // CORS
    },
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      requestId: context.requestId,
      timestamp: new Date().toISOString(),
    }),
  };
};

/**
 * ============================================================================
 * 2. Variables de Entorno
 * ============================================================================
 */

export const handlerWithEnvVars = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Leer variables de entorno
  const stage = process.env.STAGE || 'dev';
  const region = process.env.AWS_REGION;
  const tableName = process.env.USERS_TABLE;

  // Validar que variables requeridas existan
  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'USERS_TABLE environment variable not set',
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      stage,
      region,
      tableName,
    }),
  };
};

/**
 * ============================================================================
 * 3. Manejo de Errores
 * ============================================================================
 */

export const handlerWithErrorHandling = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Simular operación que puede fallar
    const userId = event.pathParameters?.id;

    if (!userId) {
      // Error de validación (400)
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'User ID is required',
        }),
      };
    }

    // Simular búsqueda de usuario
    const user = await getUser(userId);

    if (!user) {
      // Not found (404)
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'User not found',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    // Log del error completo
    console.error('Error processing request:', error);

    // Internal server error (500)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

async function getUser(userId: string) {
  // Simulación
  if (userId === '123') {
    return { id: '123', name: 'John Doe' };
  }
  return null;
}

/**
 * ============================================================================
 * 4. Timeout Awareness
 * ============================================================================
 * Lambda tiene un timeout máximo de 15 minutos.
 * Es importante verificar el tiempo restante para operaciones largas.
 */

export const handlerWithTimeoutCheck = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
  const processed: number[] = [];

  for (const item of items) {
    // Verificar si tenemos tiempo suficiente (dejar 5 segundos de buffer)
    const remainingTime = context.getRemainingTimeInMillis();
    if (remainingTime < 5000) {
      console.warn('Timeout approaching, stopping processing');
      break;
    }

    // Procesar item
    await processItem(item);
    processed.push(item.id);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      processedCount: processed.length,
      totalCount: items.length,
      completed: processed.length === items.length,
    }),
  };
};

async function processItem(item: any) {
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * ============================================================================
 * 5. Cold Start Optimization
 * ============================================================================
 * Inicializar recursos fuera del handler para reutilizarlos en warm starts
 */

// ✅ CORRECTO: Inicializar fuera del handler
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export const optimizedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // ❌ INCORRECTO: NO crear el client dentro del handler
  // const dynamoClient = new DynamoDBClient({});
  // Se crearía en cada invocación

  // ✅ CORRECTO: Reutilizar client creado fuera
  // El client persiste entre invocaciones en warm starts
  console.log('Using existing DynamoDB client');

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Optimized!' }),
  };
};

/**
 * ============================================================================
 * 6. Structured Logging
 * ============================================================================
 * Logs estructurados son más fáciles de buscar en CloudWatch Insights
 */

interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  requestId: string;
  timestamp: string;
  metadata?: any;
}

function log(level: LogEntry['level'], message: string, metadata?: any, context?: Context) {
  const entry: LogEntry = {
    level,
    message,
    requestId: context?.requestId || 'N/A',
    timestamp: new Date().toISOString(),
    metadata,
  };
  console.log(JSON.stringify(entry));
}

export const handlerWithStructuredLogging = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  log('INFO', 'Processing request', { path: event.path }, context);

  try {
    // Lógica de negocio
    const result = { success: true };

    log('INFO', 'Request processed successfully', result, context);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    log(
      'ERROR',
      'Error processing request',
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      context,
    );

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

/**
 * ============================================================================
 * 7. Lambda con Layers (dependencias compartidas)
 * ============================================================================
 * Layers permiten compartir código entre funciones y reducir bundle size
 */

// Ejemplo: Usar library desde layer
// Si 'lodash' está en un layer, no necesitas incluirlo en el bundle
// import _ from 'lodash'; // Disponible desde layer

export const handlerWithLayer = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Usar funcionalidad del layer
  // const sorted = _.sortBy([...], 'field');

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Using shared layer dependencies',
    }),
  };
};

/**
 * ============================================================================
 * Ejercicio Práctico
 * ============================================================================
 *
 * Crear una función Lambda que:
 * 1. Recibe un POST request con { name, email, age }
 * 2. Valida que name y email sean obligatorios
 * 3. Valida que age sea >= 18
 * 4. Genera un ID único (crypto.randomUUID())
 * 5. Simula guardar en base de datos (await delay 100ms)
 * 6. Devuelve el usuario creado con timestamp
 * 7. Maneja errores apropiadamente
 * 8. Usa structured logging
 * 9. Verifica timeout si procesa múltiples usuarios
 *
 * Bonus: Implementar rate limiting básico usando un contador en memoria
 */

// Tu solución aquí:
