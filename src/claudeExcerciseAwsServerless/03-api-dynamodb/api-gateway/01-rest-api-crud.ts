/**
 * REST API CRUD Completo con API Gateway + Lambda + DynamoDB
 *
 * Este ejemplo muestra cómo implementar un CRUD completo para un recurso "Products"
 * usando las mejores prácticas de diseño de APIs REST.
 */

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

// ============================================================================
// Setup DynamoDB Client
// ============================================================================
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = process.env.PRODUCTS_TABLE || 'Products';

// ============================================================================
// Types
// ============================================================================
interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}

// ============================================================================
// Response Helpers
// ============================================================================
function success<T>(data: T, statusCode: number = 200): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
  };
}

function error(message: string, statusCode: number = 500): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: message }),
  };
}

// ============================================================================
// CREATE - POST /products
// ============================================================================
export const createProduct = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Validar body
    if (!event.body) {
      return error('Request body is required', 400);
    }

    const input: CreateProductInput = JSON.parse(event.body);

    // Validaciones
    if (!input.name || !input.category) {
      return error('Name and category are required', 400);
    }

    if (input.price < 0 || input.stock < 0) {
      return error('Price and stock must be non-negative', 400);
    }

    // Crear producto
    const product: Product = {
      productId: crypto.randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guardar en DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: product,
      }),
    );

    return success(product, 201);
  } catch (err) {
    console.error('Error creating product:', err);
    return error('Internal server error', 500);
  }
};

// ============================================================================
// READ ALL - GET /products
// ============================================================================
export const listProducts = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Query parameters para paginación y filtros
    const limit = event.queryStringParameters?.limit
      ? parseInt(event.queryStringParameters.limit)
      : 20;
    const category = event.queryStringParameters?.category;

    let result;

    if (category) {
      // Filtrar por categoría usando GSI
      result = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'CategoryIndex',
          KeyConditionExpression: 'category = :category',
          ExpressionAttributeValues: {
            ':category': category,
          },
          Limit: limit,
        }),
      );
    } else {
      // Scan completo (evitar en producción con tablas grandes)
      result = await docClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          Limit: limit,
        }),
      );
    }

    return success({
      products: result.Items || [],
      count: result.Count || 0,
      lastEvaluatedKey: result.LastEvaluatedKey,
    });
  } catch (err) {
    console.error('Error listing products:', err);
    return error('Internal server error', 500);
  }
};

// ============================================================================
// READ ONE - GET /products/{id}
// ============================================================================
export const getProduct = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const productId = event.pathParameters?.id;

    if (!productId) {
      return error('Product ID is required', 400);
    }

    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { productId },
      }),
    );

    if (!result.Item) {
      return error('Product not found', 404);
    }

    return success(result.Item);
  } catch (err) {
    console.error('Error getting product:', err);
    return error('Internal server error', 500);
  }
};

// ============================================================================
// UPDATE - PUT /products/{id}
// ============================================================================
export const updateProduct = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const productId = event.pathParameters?.id;

    if (!productId) {
      return error('Product ID is required', 400);
    }

    if (!event.body) {
      return error('Request body is required', 400);
    }

    const input: UpdateProductInput = JSON.parse(event.body);

    // Construir UpdateExpression dinámicamente
    const updates: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (input.name !== undefined) {
      updates.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = input.name;
    }

    if (input.description !== undefined) {
      updates.push('description = :description');
      expressionAttributeValues[':description'] = input.description;
    }

    if (input.price !== undefined) {
      if (input.price < 0) {
        return error('Price must be non-negative', 400);
      }
      updates.push('price = :price');
      expressionAttributeValues[':price'] = input.price;
    }

    if (input.category !== undefined) {
      updates.push('category = :category');
      expressionAttributeValues[':category'] = input.category;
    }

    if (input.stock !== undefined) {
      if (input.stock < 0) {
        return error('Stock must be non-negative', 400);
      }
      updates.push('stock = :stock');
      expressionAttributeValues[':stock'] = input.stock;
    }

    if (updates.length === 0) {
      return error('No fields to update', 400);
    }

    // Siempre actualizar updatedAt
    updates.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { productId },
        UpdateExpression: `SET ${updates.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames:
          Object.keys(expressionAttributeNames).length > 0
            ? expressionAttributeNames
            : undefined,
        ConditionExpression: 'attribute_exists(productId)',
        ReturnValues: 'ALL_NEW',
      }),
    );

    return success(result.Attributes);
  } catch (err: any) {
    console.error('Error updating product:', err);

    if (err.name === 'ConditionalCheckFailedException') {
      return error('Product not found', 404);
    }

    return error('Internal server error', 500);
  }
};

// ============================================================================
// DELETE - DELETE /products/{id}
// ============================================================================
export const deleteProduct = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const productId = event.pathParameters?.id;

    if (!productId) {
      return error('Product ID is required', 400);
    }

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { productId },
        ConditionExpression: 'attribute_exists(productId)',
      }),
    );

    return success({ message: 'Product deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting product:', err);

    if (err.name === 'ConditionalCheckFailedException') {
      return error('Product not found', 404);
    }

    return error('Internal server error', 500);
  }
};

/**
 * ============================================================================
 * SAM Template para desplegar
 * ============================================================================
 *
 * Resources:
 *   ProductsTable:
 *     Type: AWS::DynamoDB::Table
 *     Properties:
 *       TableName: Products
 *       AttributeDefinitions:
 *         - AttributeName: productId
 *           AttributeType: S
 *         - AttributeName: category
 *           AttributeType: S
 *       KeySchema:
 *         - AttributeName: productId
 *           KeyType: HASH
 *       GlobalSecondaryIndexes:
 *         - IndexName: CategoryIndex
 *           KeySchema:
 *             - AttributeName: category
 *               KeyType: HASH
 *           Projection:
 *             ProjectionType: ALL
 *       BillingMode: PAY_PER_REQUEST
 *
 *   CreateProductFunction:
 *     Type: AWS::Serverless::Function
 *     Properties:
 *       Handler: src/handlers/products.createProduct
 *       Environment:
 *         Variables:
 *           PRODUCTS_TABLE: !Ref ProductsTable
 *       Policies:
 *         - DynamoDBCrudPolicy:
 *             TableName: !Ref ProductsTable
 *       Events:
 *         CreateProduct:
 *           Type: Api
 *           Properties:
 *             Path: /products
 *             Method: post
 *
 *   ListProductsFunction:
 *     Type: AWS::Serverless::Function
 *     Properties:
 *       Handler: src/handlers/products.listProducts
 *       Environment:
 *         Variables:
 *           PRODUCTS_TABLE: !Ref ProductsTable
 *       Policies:
 *         - DynamoDBReadPolicy:
 *             TableName: !Ref ProductsTable
 *       Events:
 *         ListProducts:
 *           Type: Api
 *           Properties:
 *             Path: /products
 *             Method: get
 */
