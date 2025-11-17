/**
 * AWS SDK v3 con TypeScript
 *
 * SDK v3 es modular - solo importas lo que necesitas
 * Resulta en bundles más pequeños y cold starts más rápidos
 */

// ============================================================================
// 1. Diferencia entre v2 y v3
// ============================================================================

// ❌ AWS SDK v2 (obsoleto, pero aún usado)
// import AWS from 'aws-sdk';
// const dynamodb = new AWS.DynamoDB.DocumentClient();
// const s3 = new AWS.S3();

// ✅ AWS SDK v3 (modular, recomendado)
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

/**
 * ============================================================================
 * 2. Configuración de Clients
 * ============================================================================
 * Los clients son reutilizables - créalos fuera del handler para warm starts
 */

// Client básico
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

// DocumentClient (wrapper para datos JSON más fáciles)
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

// ⚡ Pro tip: Crear clients fuera del handler
// Esto permite reutilizarlos en warm starts
// Reduce latencia en ~50-100ms por request

/**
 * ============================================================================
 * 3. DynamoDB - Operaciones Básicas
 * ============================================================================
 */

interface User {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

// PUT - Crear o reemplazar item
export async function createUser(user: User): Promise<void> {
  const command = new PutCommand({
    TableName: process.env.USERS_TABLE || 'Users',
    Item: user,
  });

  try {
    await docClient.send(command);
    console.log('User created:', user.userId);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// GET - Obtener un item por key
export async function getUser(userId: string): Promise<User | null> {
  const command = new PutCommand({
    TableName: process.env.USERS_TABLE || 'Users',
    Item: { userId },
  });

  try {
    const response = await docClient.send(command);
    return (response.Item as User) || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// QUERY - Buscar items
export async function getUsersByEmail(
  email: string,
): Promise<User[]> {
  const command = new QueryCommand({
    TableName: process.env.USERS_TABLE || 'Users',
    IndexName: 'EmailIndex', // GSI
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  });

  try {
    const response = await docClient.send(command);
    return (response.Items as User[]) || [];
  } catch (error) {
    console.error('Error querying users:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * 4. S3 - Operaciones Básicas
 * ============================================================================
 */

// PUT - Subir archivo
export async function uploadFile(
  bucket: string,
  key: string,
  body: Buffer | string,
  contentType: string = 'application/octet-stream',
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  try {
    await s3Client.send(command);
    const url = `https://${bucket}.s3.amazonaws.com/${key}`;
    console.log('File uploaded:', url);
    return url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * 5. Manejo de Errores con Tipos
 * ============================================================================
 */

import {
  ResourceNotFoundException,
  ConditionalCheckFailedException,
} from '@aws-sdk/client-dynamodb';

export async function safeGetUser(userId: string): Promise<User | null> {
  try {
    return await getUser(userId);
  } catch (error) {
    // Type guard para errores específicos de AWS
    if (error instanceof ResourceNotFoundException) {
      console.log('Table not found');
      return null;
    }

    if (error instanceof ConditionalCheckFailedException) {
      console.log('Condition check failed');
      return null;
    }

    // Error genérico
    console.error('Unexpected error:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * 6. Batch Operations
 * ============================================================================
 */

import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

export async function batchCreateUsers(users: User[]): Promise<void> {
  // DynamoDB permite máximo 25 items por batch
  const BATCH_SIZE = 25;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);

    const command = new BatchWriteCommand({
      RequestItems: {
        [process.env.USERS_TABLE || 'Users']: batch.map((user) => ({
          PutRequest: {
            Item: user,
          },
        })),
      },
    });

    try {
      await docClient.send(command);
      console.log(`Batch ${i / BATCH_SIZE + 1} created successfully`);
    } catch (error) {
      console.error('Error in batch write:', error);
      throw error;
    }
  }
}

/**
 * ============================================================================
 * 7. Conditional Writes (Optimistic Locking)
 * ============================================================================
 */

import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function incrementUserScore(
  userId: string,
  points: number,
): Promise<void> {
  const command = new UpdateCommand({
    TableName: process.env.USERS_TABLE || 'Users',
    Key: { userId },
    UpdateExpression: 'SET score = if_not_exists(score, :zero) + :points',
    ExpressionAttributeValues: {
      ':points': points,
      ':zero': 0,
    },
    // Solo actualiza si el item existe
    ConditionExpression: 'attribute_exists(userId)',
  });

  try {
    await docClient.send(command);
    console.log(`Added ${points} points to user ${userId}`);
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      console.error('User does not exist');
    }
    throw error;
  }
}

/**
 * ============================================================================
 * 8. Transacciones (ACID operations)
 * ============================================================================
 */

import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

export async function transferPoints(
  fromUserId: string,
  toUserId: string,
  points: number,
): Promise<void> {
  const command = new TransactWriteCommand({
    TransactItems: [
      {
        // Decrementar puntos del usuario origen
        Update: {
          TableName: process.env.USERS_TABLE || 'Users',
          Key: { userId: fromUserId },
          UpdateExpression: 'SET score = score - :points',
          ExpressionAttributeValues: { ':points': points },
          // Validar que tenga suficientes puntos
          ConditionExpression: 'score >= :points',
        },
      },
      {
        // Incrementar puntos del usuario destino
        Update: {
          TableName: process.env.USERS_TABLE || 'Users',
          Key: { userId: toUserId },
          UpdateExpression: 'SET score = score + :points',
          ExpressionAttributeValues: { ':points': points },
        },
      },
    ],
  });

  try {
    await docClient.send(command);
    console.log(`Transferred ${points} from ${fromUserId} to ${toUserId}`);
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * 9. Paginación
 * ============================================================================
 */

import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function getAllUsers(): Promise<User[]> {
  const users: User[] = [];
  let lastEvaluatedKey: Record<string, any> | undefined;

  do {
    const command = new ScanCommand({
      TableName: process.env.USERS_TABLE || 'Users',
      ExclusiveStartKey: lastEvaluatedKey,
      Limit: 100, // Items por página
    });

    try {
      const response = await docClient.send(command);

      if (response.Items) {
        users.push(...(response.Items as User[]));
      }

      lastEvaluatedKey = response.LastEvaluatedKey;
    } catch (error) {
      console.error('Error scanning table:', error);
      throw error;
    }
  } while (lastEvaluatedKey);

  return users;
}

/**
 * ============================================================================
 * 10. Best Practices: Repository Pattern
 * ============================================================================
 */

export class UserRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(docClient: DynamoDBDocumentClient, tableName: string) {
    this.docClient = docClient;
    this.tableName = tableName;
  }

  async create(user: User): Promise<User> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: user,
      // No sobrescribir si ya existe
      ConditionExpression: 'attribute_not_exists(userId)',
    });

    await this.docClient.send(command);
    return user;
  }

  async findById(userId: string): Promise<User | null> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: { userId },
    });

    const response = await this.docClient.send(command);
    return (response.Item as User) || null;
  }

  async update(
    userId: string,
    updates: Partial<Omit<User, 'userId'>>,
  ): Promise<void> {
    // Construir UpdateExpression dinámicamente
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    Object.entries(updates).forEach(([key, value], index) => {
      updateExpressions.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = key;
      expressionAttributeValues[`:value${index}`] = value;
    });

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await this.docClient.send(command);
  }

  async delete(userId: string): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId },
    });

    await this.docClient.send(command);
  }
}

// Uso del Repository
const userRepository = new UserRepository(
  docClient,
  process.env.USERS_TABLE || 'Users',
);

export const lambdaHandler = async (event: any) => {
  const user: User = {
    userId: '123',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  };

  await userRepository.create(user);
  const foundUser = await userRepository.findById('123');

  return {
    statusCode: 200,
    body: JSON.stringify(foundUser),
  };
};

/**
 * ============================================================================
 * Ejercicio Práctico
 * ============================================================================
 *
 * Implementar una clase `ProductRepository` con:
 * 1. create(product): Crear producto
 * 2. findById(productId): Buscar por ID
 * 3. findByCategory(category): Buscar por categoría (usar GSI)
 * 4. updateStock(productId, quantity): Actualizar stock con conditional write
 * 5. batchCreate(products): Crear múltiples productos
 *
 * Interface Product:
 * - productId: string
 * - name: string
 * - category: string
 * - price: number
 * - stock: number
 * - createdAt: string
 */

// Tu solución aquí:
