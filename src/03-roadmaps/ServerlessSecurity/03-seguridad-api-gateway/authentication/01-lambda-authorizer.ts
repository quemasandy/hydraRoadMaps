/**
 * Lambda Authorizer (Custom Authorizer) - API Gateway
 *
 * Implementa autorización custom con JWT tokens
 */

import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayRequestAuthorizerEvent,
} from 'aws-lambda';
import * as jwt from 'jsonwebtoken';

/**
 * ============================================================================
 * 1. Token-Based Authorizer (JWT)
 * ============================================================================
 */

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  scope: string[];
  iat: number;
  exp: number;
}

// ✅ BUENA PRÁCTICA: Obtener secret de Secrets Manager o Parameter Store
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const tokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  console.log('Token Authorizer invoked');

  try {
    // Extraer token del header Authorization
    const token = event.authorizationToken;

    if (!token) {
      throw new Error('No authorization token provided');
    }

    // ✅ SEGURO: Validar formato Bearer token
    const tokenMatch = token.match(/^Bearer (.+)$/);
    if (!tokenMatch) {
      throw new Error('Invalid authorization token format');
    }

    const jwtToken = tokenMatch[1];

    // ✅ SEGURO: Verificar y decodificar JWT
    const decoded = jwt.verify(jwtToken, JWT_SECRET) as JWTPayload;

    console.log('Token verified for user:', decoded.sub);

    // ✅ BUENA PRÁCTICA: Generar policy que permite acceso
    return generatePolicy(decoded.sub, 'Allow', event.methodArn, {
      email: decoded.email,
      role: decoded.role,
      scope: decoded.scope.join(','),
    });
  } catch (error) {
    console.error('Authorization failed:', error);

    // ❌ IMPORTANTE: Retornar Deny en caso de error
    // NO retornar error 401 aquí, API Gateway maneja eso
    throw new Error('Unauthorized');
  }
};

/**
 * ============================================================================
 * 2. Request-Based Authorizer
 * ============================================================================
 */

export const requestAuthorizerHandler = async (
  event: APIGatewayRequestAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  console.log('Request Authorizer invoked');

  try {
    // Acceso a múltiples fuentes de autenticación
    const headers = event.headers || {};
    const queryParams = event.queryStringParameters || {};

    // Opción 1: API Key en header
    const apiKey = headers['x-api-key'];

    // Opción 2: Token en query string (menos seguro)
    const tokenParam = queryParams.token;

    // Opción 3: Custom authentication scheme
    const customAuth = headers['x-custom-auth'];

    let userId: string;
    let context: any = {};

    // Validar según el método de auth disponible
    if (apiKey) {
      // ✅ Validar API key (consultar DynamoDB, cache, etc.)
      const validApiKey = await validateApiKey(apiKey);
      if (!validApiKey) {
        throw new Error('Invalid API key');
      }
      userId = validApiKey.userId;
      context = {
        userId: validApiKey.userId,
        plan: validApiKey.plan,
        rateLimit: validApiKey.rateLimit,
      };
    } else if (tokenParam) {
      // ⚠️ Menos seguro: Token en query string
      const decoded = jwt.verify(tokenParam, JWT_SECRET) as JWTPayload;
      userId = decoded.sub;
      context = { email: decoded.email, role: decoded.role };
    } else {
      throw new Error('No valid authentication method found');
    }

    return generatePolicy(userId, 'Allow', event.methodArn, context);
  } catch (error) {
    console.error('Authorization failed:', error);
    throw new Error('Unauthorized');
  }
};

/**
 * ============================================================================
 * 3. Generate IAM Policy
 * ============================================================================
 */

function generatePolicy(
  principalId: string,
  effect: 'Allow' | 'Deny',
  resource: string,
  context?: any,
): APIGatewayAuthorizerResult {
  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };

  // ✅ IMPORTANTE: Context se pasa a la Lambda backend
  // Disponible en event.requestContext.authorizer
  if (context) {
    authResponse.context = context;
  }

  // ✅ BUENA PRÁCTICA: Configurar TTL para caching
  // authResponse.usageIdentifierKey = principalId;

  return authResponse;
}

/**
 * ============================================================================
 * 4. Advanced Policy Generation (Resource-Level)
 * ============================================================================
 */

function generateAdvancedPolicy(
  principalId: string,
  methodArn: string,
  userRole: string,
): APIGatewayAuthorizerResult {
  // Parse methodArn para obtener API Gateway info
  // Format: arn:aws:execute-api:region:account-id:api-id/stage/method/resource
  const arnParts = methodArn.split(':');
  const apiGatewayArnPart = arnParts[5].split('/');
  const awsAccountId = arnParts[4];
  const region = arnParts[3];
  const restApiId = apiGatewayArnPart[0];
  const stage = apiGatewayArnPart[1];

  // Construir resource ARN base
  const resourceArnBase = `arn:aws:execute-api:${region}:${awsAccountId}:${restApiId}/${stage}`;

  // ✅ SEGURO: Role-based access control
  const statements: any[] = [];

  if (userRole === 'admin') {
    // Admin: Full access
    statements.push({
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: `${resourceArnBase}/*/*`,
    });
  } else if (userRole === 'user') {
    // User: Limited access
    statements.push(
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: [
          `${resourceArnBase}/GET/users/*`,
          `${resourceArnBase}/POST/orders`,
          `${resourceArnBase}/GET/orders/*`,
        ],
      },
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: `${resourceArnBase}/DELETE/*`,
      },
    );
  } else {
    // Guest: Very limited
    statements.push({
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: `${resourceArnBase}/GET/public/*`,
    });
  }

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: statements,
    },
    context: {
      role: userRole,
    },
  };
}

/**
 * ============================================================================
 * 5. API Key Validation (DynamoDB)
 * ============================================================================
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface ApiKeyData {
  userId: string;
  plan: string;
  rateLimit: number;
  expiresAt: number;
  isActive: boolean;
}

// Cache para API keys (optimización)
const apiKeyCache = new Map<string, { data: ApiKeyData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

async function validateApiKey(apiKey: string): Promise<ApiKeyData | null> {
  // ✅ Check cache first
  const cached = apiKeyCache.get(apiKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('API key found in cache');
    return cached.data;
  }

  // Query DynamoDB
  try {
    const command = new GetCommand({
      TableName: process.env.API_KEYS_TABLE || 'ApiKeys',
      Key: { apiKey },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      console.log('API key not found');
      return null;
    }

    const keyData = response.Item as ApiKeyData;

    // ✅ Validar que la key esté activa
    if (!keyData.isActive) {
      console.log('API key is inactive');
      return null;
    }

    // ✅ Validar que no haya expirado
    if (keyData.expiresAt && Date.now() > keyData.expiresAt) {
      console.log('API key has expired');
      return null;
    }

    // Cache the result
    apiKeyCache.set(apiKey, { data: keyData, timestamp: Date.now() });

    return keyData;
  } catch (error) {
    console.error('Error validating API key:', error);
    return null;
  }
}

/**
 * ============================================================================
 * 6. Caching Strategy
 * ============================================================================
 */

/**
 * API Gateway cachea el resultado del authorizer basado en:
 * - Token (para token-based)
 * - Combination of headers/query params (para request-based)
 *
 * Configuración en SAM template:
 *
 * MyApi:
 *   Type: AWS::Serverless::Api
 *   Properties:
 *     Auth:
 *       Authorizers:
 *         MyLambdaAuthorizer:
 *           FunctionArn: !GetAtt AuthorizerFunction.Arn
 *           Identity:
 *             Header: Authorization
 *             ValidationExpression: "Bearer .*"
 *             ReauthorizeEvery: 300  # Cache TTL en segundos
 */

/**
 * ============================================================================
 * 7. Security Headers en Backend Lambda
 * ============================================================================
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const protectedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // ✅ Acceder a context del authorizer
  const authorizer = event.requestContext.authorizer || {};
  const userId = authorizer.principalId;
  const userRole = authorizer.role;
  const userEmail = authorizer.email;

  console.log(`Request from user ${userId} (${userRole})`);

  // ✅ Verificar permisos adicionales si es necesario
  if (userRole !== 'admin') {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Insufficient permissions' }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      // ✅ Security headers
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': "default-src 'self'",
    },
    body: JSON.stringify({
      message: 'Authorized access',
      userId,
      role: userRole,
    }),
  };
};

/**
 * ============================================================================
 * 8. Best Practices Summary
 * ============================================================================
 */

/**
 * LAMBDA AUTHORIZER BEST PRACTICES:
 *
 * 1. ALWAYS validate tokens properly
 *    - Use jwt.verify() con secret seguro
 *    - Verificar exp (expiration)
 *    - Verificar issuer y audience
 *
 * 2. USE caching wisely
 *    - Configure ReauthorizeEvery apropiadamente
 *    - Balance seguridad vs performance
 *    - Típicamente 300s (5 min) es razonable
 *
 * 3. RETURN proper policies
 *    - Specific resources, no wildcards innecesarios
 *    - Use Deny cuando sea apropiado
 *    - Include context para backend Lambda
 *
 * 4. HANDLE errors securely
 *    - Throw 'Unauthorized' para denegar
 *    - NO exponer detalles del error
 *    - Log para debugging
 *
 * 5. OPTIMIZE performance
 *    - Cache API keys/users en memoria (warm starts)
 *    - Use DynamoDB DAX si aplica
 *    - Minimizar llamadas externas
 *
 * 6. MONITOR y AUDIT
 *    - CloudWatch Logs para todas las invocaciones
 *    - CloudTrail para API calls
 *    - Metrics para failures/latency
 *
 * 7. LEAST PRIVILEGE
 *    - IAM role del authorizer con permisos mínimos
 *    - Solo acceso a recursos necesarios
 */

/**
 * ============================================================================
 * Ejercicio Práctico
 * ============================================================================
 *
 * Crear un Lambda Authorizer que:
 * 1. Valide JWT tokens con RS256 (public key)
 * 2. Verifique expiration, issuer, audience
 * 3. Extraiga user role del token
 * 4. Genere policy basado en role (admin, user, guest)
 * 5. Incluya context con user info
 * 6. Implemente caching de public key
 * 7. Maneje errores apropiadamente
 * 8. Log structured events
 *
 * Bonus: Integrar con Cognito para obtener user groups
 */
