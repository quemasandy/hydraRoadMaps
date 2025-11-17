/**
 * DynamoDB CRUD Operations - Operaciones Básicas
 *
 * Este archivo demuestra todas las operaciones CRUD básicas
 * con DynamoDB usando AWS SDK v3 y TypeScript
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  BatchGetCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

// ============================================================================
// Setup
// ============================================================================
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = process.env.TABLE_NAME || 'Users';

interface User {
  userId: string;
  email: string;
  name: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * ============================================================================
 * CREATE - PutItem
 * ============================================================================
 * Crea un nuevo item o reemplaza uno existente
 */

export async function createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
  const timestamp = new Date().toISOString();
  const fullUser: User = {
    ...user,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: fullUser,
    // ConditionExpression previene sobrescribir si ya existe
    ConditionExpression: 'attribute_not_exists(userId)',
  });

  try {
    await docClient.send(command);
    return fullUser;
  } catch (error: any) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('User already exists');
    }
    throw error;
  }
}

/**
 * ============================================================================
 * READ - GetItem
 * ============================================================================
 * Obtiene un item por su primary key
 */

export async function getUser(userId: string): Promise<User | null> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    // Proyección: solo devolver campos específicos
    // ProjectionExpression: 'userId, #n, email',
    // ExpressionAttributeNames: { '#n': 'name' }
  });

  const response = await docClient.send(command);
  return (response.Item as User) || null;
}

/**
 * ============================================================================
 * UPDATE - UpdateItem
 * ============================================================================
 * Actualiza atributos específicos de un item
 */

export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'userId' | 'createdAt'>>,
): Promise<User> {
  // Construir UpdateExpression dinámicamente
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  // Iterar sobre los campos a actualizar
  Object.entries(updates).forEach(([key, value], index) => {
    updateExpressions.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:value${index}`] = value;
  });

  // Siempre actualizar updatedAt
  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: 'attribute_exists(userId)',
    ReturnValues: 'ALL_NEW', // Devolver el item actualizado
  });

  try {
    const response = await docClient.send(command);
    return response.Attributes as User;
  } catch (error: any) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('User not found');
    }
    throw error;
  }
}

/**
 * ============================================================================
 * DELETE - DeleteItem
 * ============================================================================
 * Elimina un item por su primary key
 */

export async function deleteUser(userId: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    ConditionExpression: 'attribute_exists(userId)',
  });

  try {
    await docClient.send(command);
  } catch (error: any) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('User not found');
    }
    throw error;
  }
}

/**
 * ============================================================================
 * QUERY - Buscar items con partition key
 * ============================================================================
 * Query es más eficiente que Scan - requiere partition key
 */

export async function getUsersByEmail(email: string): Promise<User[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'EmailIndex', // GSI
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  });

  const response = await docClient.send(command);
  return (response.Items as User[]) || [];
}

/**
 * ============================================================================
 * QUERY - Con Sort Key Range
 * ============================================================================
 */

export async function getUsersByEmailAndDateRange(
  email: string,
  startDate: string,
  endDate: string,
): Promise<User[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :email AND createdAt BETWEEN :start AND :end',
    ExpressionAttributeValues: {
      ':email': email,
      ':start': startDate,
      ':end': endDate,
    },
  });

  const response = await docClient.send(command);
  return (response.Items as User[]) || [];
}

/**
 * ============================================================================
 * SCAN - Escanear toda la tabla (evitar en producción)
 * ============================================================================
 * Scan lee todos los items - muy costoso en tablas grandes
 */

export async function getAllUsers(limit?: number): Promise<User[]> {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    Limit: limit,
    // Filtros (aplicados DESPUÉS del scan)
    // FilterExpression: 'age > :minAge',
    // ExpressionAttributeValues: { ':minAge': 18 }
  });

  const response = await docClient.send(command);
  return (response.Items as User[]) || [];
}

/**
 * ============================================================================
 * SCAN - Con Paginación
 * ============================================================================
 */

export async function getAllUsersPaginated(): Promise<User[]> {
  const users: User[] = [];
  let lastEvaluatedKey: Record<string, any> | undefined;

  do {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      ExclusiveStartKey: lastEvaluatedKey,
      Limit: 100,
    });

    const response = await docClient.send(command);

    if (response.Items) {
      users.push(...(response.Items as User[]));
    }

    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return users;
}

/**
 * ============================================================================
 * BATCH GET - Obtener múltiples items
 * ============================================================================
 * Máximo 100 items por request
 */

export async function getBatchUsers(userIds: string[]): Promise<User[]> {
  const command = new BatchGetCommand({
    RequestItems: {
      [TABLE_NAME]: {
        Keys: userIds.map((userId) => ({ userId })),
      },
    },
  });

  const response = await docClient.send(command);
  const items = response.Responses?.[TABLE_NAME] || [];
  return items as User[];
}

/**
 * ============================================================================
 * BATCH WRITE - Crear/eliminar múltiples items
 * ============================================================================
 * Máximo 25 items por request
 */

export async function batchCreateUsers(users: User[]): Promise<void> {
  const BATCH_SIZE = 25;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);

    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: batch.map((user) => ({
          PutRequest: {
            Item: user,
          },
        })),
      },
    });

    await docClient.send(command);
  }
}

/**
 * ============================================================================
 * CONDITIONAL WRITES - Escrituras condicionales
 * ============================================================================
 */

// Incrementar campo numérico solo si existe
export async function incrementUserAge(userId: string): Promise<void> {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: 'SET age = age + :inc',
    ExpressionAttributeValues: { ':inc': 1 },
    ConditionExpression: 'attribute_exists(userId) AND attribute_exists(age)',
  });

  await docClient.send(command);
}

// Actualizar solo si versión coincide (optimistic locking)
export async function updateUserWithVersion(
  userId: string,
  updates: Partial<User>,
  expectedVersion: number,
): Promise<void> {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: 'SET #name = :name, version = version + :inc',
    ExpressionAttributeNames: { '#name': 'name' },
    ExpressionAttributeValues: {
      ':name': updates.name,
      ':inc': 1,
      ':expectedVersion': expectedVersion,
    },
    ConditionExpression: 'version = :expectedVersion',
  });

  try {
    await docClient.send(command);
  } catch (error: any) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('Version mismatch - item was modified');
    }
    throw error;
  }
}

/**
 * ============================================================================
 * Ejercicio Práctico
 * ============================================================================
 *
 * Implementar las siguientes funciones:
 *
 * 1. getUsersOlderThan(age: number): Promise<User[]>
 *    - Usar Scan con FilterExpression
 *    - Implementar paginación
 *
 * 2. updateUserEmail(userId: string, newEmail: string): Promise<void>
 *    - Validar que el email no esté en uso
 *    - Usar transacción si es posible
 *
 * 3. softDeleteUser(userId: string): Promise<void>
 *    - No eliminar, solo marcar como deleted
 *    - Agregar campo deletedAt
 *
 * 4. restoreUser(userId: string): Promise<void>
 *    - Remover marca de deleted
 *
 * 5. countUsersByAge(): Promise<Map<number, number>>
 *    - Contar usuarios agrupados por edad
 */
