/**
 * Tipos TypeScript para AWS Lambda
 *
 * Este archivo demuestra los tipos más comunes usados en funciones Lambda
 * con TypeScript, proporcionados por @types/aws-lambda
 */

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  S3Event,
  DynamoDBStreamEvent,
  SQSEvent,
  SNSEvent,
  EventBridgeEvent,
  ScheduledEvent,
  Handler,
} from 'aws-lambda';

/**
 * ============================================================================
 * 1. Handler Básico - API Gateway REST
 * ============================================================================
 * El tipo más común: API Gateway proxy integration
 */

// Event: contiene toda la información del request HTTP
// Context: metadata sobre la ejecución de Lambda
// Return: APIGatewayProxyResult (statusCode, body, headers)

export const basicHandler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event: APIGatewayProxyEvent, context: Context) => {
  // Log del request ID para debugging
  console.log('Request ID:', context.requestId);

  // Acceder a información del request
  const method = event.httpMethod; // GET, POST, PUT, DELETE
  const path = event.path; // /users/123
  const queryParams = event.queryStringParameters; // ?name=john
  const headers = event.headers; // { 'content-type': 'application/json' }
  const body = event.body ? JSON.parse(event.body) : null;

  // Información del contexto de ejecución
  const functionName = context.functionName;
  const remainingTime = context.getRemainingTimeInMillis();
  const memoryLimit = context.memoryLimitInMB;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // CORS
    },
    body: JSON.stringify({
      message: 'Success',
      method,
      path,
      queryParams,
      functionName,
      remainingTime,
    }),
  };
};

/**
 * ============================================================================
 * 2. Typed Request/Response
 * ============================================================================
 * Definir interfaces para request y response bodies
 */

interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
}

interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const createUserHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse y validación con tipos
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const requestBody: CreateUserRequest = JSON.parse(event.body);

    // Validación manual (o usar librerías como Zod, Joi)
    if (!requestBody.name || !requestBody.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Name and email are required',
        }),
      };
    }

    // Simular creación de usuario
    const user: CreateUserResponse = {
      id: crypto.randomUUID(),
      name: requestBody.name,
      email: requestBody.email,
      createdAt: new Date().toISOString(),
    };

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error creating user:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

/**
 * ============================================================================
 * 3. S3 Event Handler
 * ============================================================================
 * Lambda triggered por eventos de S3 (upload, delete, etc.)
 */

export const s3EventHandler: Handler<S3Event, void> = async (
  event: S3Event,
) => {
  console.log('S3 Event received');

  // Iterar sobre todos los records del evento
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const size = record.s3.object.size;
    const eventName = record.eventName; // ObjectCreated:Put, ObjectRemoved:Delete

    console.log(`File ${eventName}: ${bucket}/${key} (${size} bytes)`);

    // Ejemplo: Procesar solo imágenes
    if (key.match(/\.(jpg|jpeg|png|gif)$/i)) {
      console.log('Processing image:', key);
      // Aquí iría lógica de procesamiento de imagen
      // Ej: generar thumbnail, extraer metadata, etc.
    }
  }
};

/**
 * ============================================================================
 * 4. DynamoDB Stream Handler
 * ============================================================================
 * Lambda triggered por cambios en tabla DynamoDB
 */

export const dynamoDBStreamHandler: Handler<DynamoDBStreamEvent, void> = async (
  event: DynamoDBStreamEvent,
) => {
  console.log('DynamoDB Stream event received');

  for (const record of event.Records) {
    const eventName = record.eventName; // INSERT, MODIFY, REMOVE

    console.log(`Event: ${eventName}`);
    console.log('Keys:', JSON.stringify(record.dynamodb?.Keys));
    console.log('New Image:', JSON.stringify(record.dynamodb?.NewImage));
    console.log('Old Image:', JSON.stringify(record.dynamodb?.OldImage));

    // Ejemplo: Auditoría de cambios
    if (eventName === 'MODIFY') {
      const oldImage = record.dynamodb?.OldImage;
      const newImage = record.dynamodb?.NewImage;

      // Comparar y loggear cambios
      console.log('Data changed from:', oldImage, 'to:', newImage);
    }
  }
};

/**
 * ============================================================================
 * 5. SQS Handler
 * ============================================================================
 * Lambda triggered por mensajes de SQS queue
 */

interface OrderMessage {
  orderId: string;
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
}

export const sqsHandler: Handler<SQSEvent, void> = async (
  event: SQSEvent,
) => {
  console.log(`Processing ${event.Records.length} messages from SQS`);

  // Procesar mensajes en batch
  for (const record of event.Records) {
    try {
      const message: OrderMessage = JSON.parse(record.body);

      console.log('Processing order:', message.orderId);

      // Lógica de procesamiento
      // Si falla, el mensaje volverá a la cola (según DLQ config)
      await processOrder(message);

      console.log('Order processed successfully:', message.orderId);
    } catch (error) {
      console.error('Error processing message:', error);
      // En caso de error, el mensaje irá a Dead Letter Queue
      throw error; // Re-throw para marcar el batch como fallido
    }
  }
};

async function processOrder(order: OrderMessage): Promise<void> {
  // Simulación de procesamiento
  console.log('Processing order items:', order.items.length);
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * ============================================================================
 * 6. SNS Handler
 * ============================================================================
 * Lambda triggered por notificaciones SNS
 */

export const snsHandler: Handler<SNSEvent, void> = async (event: SNSEvent) => {
  console.log('SNS event received');

  for (const record of event.Records) {
    const message = record.Sns.Message;
    const subject = record.Sns.Subject;
    const topicArn = record.Sns.TopicArn;

    console.log(`Topic: ${topicArn}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // Parsear mensaje si es JSON
    try {
      const jsonMessage = JSON.parse(message);
      console.log('Parsed message:', jsonMessage);
    } catch {
      console.log('Message is not JSON');
    }
  }
};

/**
 * ============================================================================
 * 7. EventBridge Handler
 * ============================================================================
 * Lambda triggered por eventos custom de EventBridge
 */

interface UserCreatedDetail {
  userId: string;
  email: string;
  timestamp: string;
}

export const eventBridgeHandler: Handler<
  EventBridgeEvent<'UserCreated', UserCreatedDetail>,
  void
> = async (event) => {
  console.log('EventBridge event received');
  console.log('Source:', event.source); // com.myapp.users
  console.log('Detail Type:', event['detail-type']); // UserCreated
  console.log('Detail:', event.detail);

  const { userId, email, timestamp } = event.detail;

  // Lógica basada en el evento
  console.log(`New user created: ${userId} - ${email} at ${timestamp}`);

  // Ejemplo: Enviar email de bienvenida
  // await sendWelcomeEmail(email);
};

/**
 * ============================================================================
 * 8. Scheduled Event Handler (CloudWatch Events / EventBridge)
 * ============================================================================
 * Lambda triggered por cron expression (ej: cada hora)
 */

export const scheduledHandler: Handler<ScheduledEvent, void> = async (
  event,
) => {
  console.log('Scheduled event triggered');
  console.log('Time:', event.time);
  console.log('Schedule:', event.resources); // ARN del schedule

  // Ejemplo: Limpieza de datos viejos
  console.log('Running scheduled cleanup task...');

  // Aquí iría la lógica programada
  // Ej: eliminar registros antiguos, generar reportes, etc.
};

/**
 * ============================================================================
 * 9. Generic Handler Type
 * ============================================================================
 * Crear custom handlers con tipos genéricos
 */

type LambdaHandler<TEvent, TResult> = (
  event: TEvent,
  context: Context,
) => Promise<TResult>;

// Ejemplo: Handler tipado para cualquier evento custom
interface CustomEvent {
  action: string;
  payload: unknown;
}

interface CustomResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

const customHandler: LambdaHandler<CustomEvent, CustomResult> = async (
  event,
  context,
) => {
  console.log('Custom event:', event.action);

  try {
    // Lógica personalizada basada en action
    switch (event.action) {
      case 'process':
        return { success: true, data: { processed: true } };
      case 'validate':
        return { success: true, data: { valid: true } };
      default:
        return {
          success: false,
          error: `Unknown action: ${event.action}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * ============================================================================
 * 10. Utility: Response Builder
 * ============================================================================
 * Helper function para construir responses consistentes
 */

class ResponseBuilder {
  static success<T>(
    data: T,
    statusCode: number = 200,
  ): APIGatewayProxyResult {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, data }),
    };
  }

  static error(
    message: string,
    statusCode: number = 500,
  ): APIGatewayProxyResult {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: false, error: message }),
    };
  }
}

// Uso del ResponseBuilder
export const getUserHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;

    if (!userId) {
      return ResponseBuilder.error('User ID is required', 400);
    }

    // Simular obtención de usuario
    const user = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
    };

    return ResponseBuilder.success(user);
  } catch (error) {
    return ResponseBuilder.error(
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
};

/**
 * ============================================================================
 * Ejercicio Práctico
 * ============================================================================
 *
 * Crear un handler que:
 * 1. Recibe un evento de API Gateway con un body JSON
 * 2. Valida que tenga campos: title, content
 * 3. Simula guardar en base de datos
 * 4. Devuelve el objeto creado con id y timestamp
 * 5. Maneja errores apropiadamente
 *
 * Tip: Usa los tipos y ResponseBuilder mostrados arriba
 */

// Tu solución aquí:
// export const createPostHandler = async (...)
