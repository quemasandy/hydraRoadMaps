/**
 * OWASP Serverless Top 10 - Injection Vulnerabilities
 *
 * Demuestra vulnerabilidades de inyección y cómo mitigarlas
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * ============================================================================
 * 1. NoSQL Injection - VULNERABLE
 * ============================================================================
 */

export const vulnerableNoSQLHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // ❌ VULNERABLE: Input directo sin validación
  const username = event.queryStringParameters?.username;

  // ❌ PELIGRO: Si username = "admin' OR '1'='1", puede bypassear auth
  const params = {
    TableName: 'Users',
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': username, // Sin validación!
    },
  };

  try {
    const result = await docClient.send(new QueryCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Query failed' }),
    };
  }
};

/**
 * ============================================================================
 * 2. NoSQL Injection - SECURE
 * ============================================================================
 */

// Schema validation con Zod
const UsernameSchema = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-zA-Z0-9_-]+$/);

export const secureNoSQLHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // ✅ SEGURO: Validar input
    const username = event.queryStringParameters?.username;

    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'username is required' }),
      };
    }

    // ✅ SEGURO: Validar formato
    const validationResult = UsernameSchema.safeParse(username);
    if (!validationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid username format',
          details: validationResult.error.errors,
        }),
      };
    }

    // ✅ SEGURO: Usar validated input
    const params = {
      TableName: process.env.USERS_TABLE || 'Users',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': validationResult.data,
      },
    };

    const result = await docClient.send(new QueryCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('Query error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

/**
 * ============================================================================
 * 3. Command Injection - VULNERABLE
 * ============================================================================
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const vulnerableCommandHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // ❌ VULNERABLE: Ejecutar comando con input de usuario
  const filename = event.queryStringParameters?.file;

  // ❌ PELIGRO: Si filename = "test.txt; rm -rf /", ejecuta código malicioso
  try {
    const { stdout } = await execAsync(`cat ${filename}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ content: stdout }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Command failed' }),
    };
  }
};

/**
 * ============================================================================
 * 4. Command Injection - SECURE
 * ============================================================================
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// Whitelist de archivos permitidos
const ALLOWED_FILES = ['data.txt', 'config.json', 'report.pdf'];
const BASE_DIR = '/tmp/safe-directory';

export const secureCommandHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const filename = event.queryStringParameters?.file;

    if (!filename) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'file parameter is required' }),
      };
    }

    // ✅ SEGURO: Validar contra whitelist
    if (!ALLOWED_FILES.includes(filename)) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: 'File not allowed',
          allowedFiles: ALLOWED_FILES,
        }),
      };
    }

    // ✅ SEGURO: Prevenir path traversal
    const safePath = path.join(BASE_DIR, path.basename(filename));

    // ✅ SEGURO: Verificar que el path esté dentro del directorio permitido
    if (!safePath.startsWith(BASE_DIR)) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Path traversal detected' }),
      };
    }

    // ✅ SEGURO: Usar fs API en lugar de shell commands
    const content = await fs.readFile(safePath, 'utf-8');

    return {
      statusCode: 200,
      body: JSON.stringify({ content }),
    };
  } catch (error) {
    console.error('File read error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

/**
 * ============================================================================
 * 5. JSON Injection / Prototype Pollution - VULNERABLE
 * ============================================================================
 */

export const vulnerableJSONHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // ❌ VULNERABLE: Parse sin validación
    const body = JSON.parse(event.body || '{}');

    // ❌ PELIGRO: Prototype pollution
    // Si body = {"__proto__": {"isAdmin": true}}, puede modificar prototype
    const user = Object.assign({}, body);

    return {
      statusCode: 200,
      body: JSON.stringify({ user }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }
};

/**
 * ============================================================================
 * 6. JSON Injection - SECURE
 * ============================================================================
 */

// Schema completo con validación
const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(18).max(120),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
});

// Prevent prototype pollution
function safeObjectAssign(target: any, source: any) {
  const safeKeys = Object.keys(source).filter(
    (key) => !['__proto__', 'constructor', 'prototype'].includes(key),
  );

  const safeSource = safeKeys.reduce((obj: any, key) => {
    obj[key] = source[key];
    return obj;
  }, {});

  return Object.assign(target, safeSource);
}

export const secureJSONHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // ✅ SEGURO: Validar Content-Type
    const contentType = event.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return {
        statusCode: 415,
        body: JSON.stringify({ error: 'Content-Type must be application/json' }),
      };
    }

    // ✅ SEGURO: Validar tamaño del body
    if (!event.body || event.body.length > 10000) {
      return {
        statusCode: 413,
        body: JSON.stringify({ error: 'Request body too large' }),
      };
    }

    // Parse JSON
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON format' }),
      };
    }

    // ✅ SEGURO: Validar con schema
    const validationResult = UserSchema.safeParse(parsedBody);
    if (!validationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Validation failed',
          details: validationResult.error.errors,
        }),
      };
    }

    // ✅ SEGURO: Usar validated data
    const user = validationResult.data;

    // ✅ SEGURO: Prevent prototype pollution si necesitas Object.assign
    const safeUser = safeObjectAssign({}, user);

    return {
      statusCode: 200,
      body: JSON.stringify({ user: safeUser }),
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

/**
 * ============================================================================
 * 7. Best Practices Summary
 * ============================================================================
 */

/**
 * MITIGACIÓN DE INJECTION:
 *
 * 1. INPUT VALIDATION
 *    - Validar todos los inputs (query params, body, headers)
 *    - Usar schemas (Zod, Joi, Yup)
 *    - Whitelist vs Blacklist (preferir whitelist)
 *
 * 2. PARAMETERIZED QUERIES
 *    - Usar ExpressionAttributeValues en DynamoDB
 *    - Nunca concatenar strings para queries
 *
 * 3. SAFE APIs
 *    - Preferir fs API sobre shell commands
 *    - Evitar eval(), Function(), exec()
 *
 * 4. PATH TRAVERSAL PREVENTION
 *    - Validar paths con path.basename()
 *    - Verificar que path esté en directorio permitido
 *
 * 5. PROTOTYPE POLLUTION PREVENTION
 *    - Filtrar __proto__, constructor, prototype
 *    - Usar Object.create(null) para objetos sin prototype
 *
 * 6. CONTENT TYPE VALIDATION
 *    - Validar Content-Type header
 *    - Limitar tamaño de requests
 *
 * 7. ERROR HANDLING
 *    - No exponer detalles internos en errores
 *    - Log errors para debugging
 */

/**
 * ============================================================================
 * Ejercicio Práctico
 * ============================================================================
 *
 * Crear una Lambda que:
 * 1. Recibe un POST con { query: string, filters: object }
 * 2. Valida que query tenga min 3 caracteres
 * 3. Valida que filters solo contenga campos permitidos
 * 4. Ejecuta búsqueda segura en DynamoDB
 * 5. Previene NoSQL injection
 * 6. Previene prototype pollution
 * 7. Maneja errores apropiadamente
 * 8. Incluye logging estructurado
 */
