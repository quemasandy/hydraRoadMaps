/**
 * AWS Secrets Manager - Gestión Segura de Secretos
 *
 * Demuestra cómo usar AWS Secrets Manager para almacenar y rotar secretos
 */

import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  RotateSecretCommand,
  PutSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const secretsClient = new SecretsManagerClient({});

/**
 * ============================================================================
 * 1. ANTI-PATTERN: Hardcoded Secrets
 * ============================================================================
 */

// ❌ NUNCA HACER ESTO
const HARDCODED_API_KEY = 'sk_live_1234567890abcdef'; // ¡INSEGURO!
const HARDCODED_DB_PASSWORD = 'MyP@ssw0rd123'; // ¡INSEGURO!

export const insecureHandler = async (): Promise<APIGatewayProxyResult> => {
  // ❌ PELIGRO: Secrets en código
  const apiResponse = await fetch('https://api.example.com/data', {
    headers: {
      Authorization: `Bearer ${HARDCODED_API_KEY}`,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Insecure approach' }),
  };
};

/**
 * ============================================================================
 * 2. Retrieving Secrets from Secrets Manager
 * ============================================================================
 */

interface DatabaseCredentials {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

// Cache secrets durante la ejecución de Lambda (warm start optimization)
let cachedSecret: DatabaseCredentials | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

async function getSecret(secretName: string): Promise<string> {
  try {
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });

    const response = await secretsClient.send(command);

    if (response.SecretString) {
      return response.SecretString;
    }

    // Para binary secrets
    if (response.SecretBinary) {
      const buff = Buffer.from(response.SecretBinary);
      return buff.toString('ascii');
    }

    throw new Error('Secret not found');
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

async function getDatabaseCredentials(): Promise<DatabaseCredentials> {
  // ✅ BUENA PRÁCTICA: Cache secrets en warm starts
  const now = Date.now();
  if (cachedSecret && now - cacheTime < CACHE_TTL) {
    console.log('Using cached secret');
    return cachedSecret;
  }

  console.log('Fetching secret from Secrets Manager');
  const secretName = process.env.DB_SECRET_NAME || 'prod/database/credentials';

  const secretString = await getSecret(secretName);
  const credentials = JSON.parse(secretString) as DatabaseCredentials;

  // Update cache
  cachedSecret = credentials;
  cacheTime = now;

  return credentials;
}

export const secureHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // ✅ SEGURO: Obtener credentials de Secrets Manager
    const dbCreds = await getDatabaseCredentials();

    // Usar credentials para conectar a database
    // const connection = await mysql.createConnection({
    //   host: dbCreds.host,
    //   user: dbCreds.username,
    //   password: dbCreds.password,
    //   database: dbCreds.database,
    // });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Connected securely',
        // ❌ NUNCA exponer secrets en la respuesta
        // credentials: dbCreds, // ¡NO!
      }),
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
 * 3. Creating Secrets
 * ============================================================================
 */

export async function createDatabaseSecret() {
  const secretName = 'prod/database/credentials';

  const credentials: DatabaseCredentials = {
    username: 'dbadmin',
    password: generateSecurePassword(),
    host: 'mydb.cluster.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'production',
  };

  try {
    const command = new CreateSecretCommand({
      Name: secretName,
      Description: 'Production database credentials',
      SecretString: JSON.stringify(credentials),
      // ✅ BUENA PRÁCTICA: Tags para organización
      Tags: [
        { Key: 'Environment', Value: 'production' },
        { Key: 'Application', Value: 'my-app' },
        { Key: 'ManagedBy', Value: 'terraform' },
      ],
      // ✅ IMPORTANTE: Habilitar KMS encryption
      KmsKeyId: process.env.KMS_KEY_ID || 'alias/aws/secretsmanager',
    });

    const response = await secretsClient.send(command);
    console.log('Secret created:', response.ARN);
    return response.ARN;
  } catch (error) {
    console.error('Error creating secret:', error);
    throw error;
  }
}

function generateSecurePassword(length: number = 32): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const crypto = require('crypto');
  const values = crypto.randomBytes(length);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[values[i] % charset.length];
  }
  return password;
}

/**
 * ============================================================================
 * 4. Updating Secrets
 * ============================================================================
 */

export async function updateSecret(secretName: string, newValue: string) {
  try {
    const command = new PutSecretValueCommand({
      SecretId: secretName,
      SecretString: newValue,
      // ✅ BUENA PRÁCTICA: Version stages
      VersionStages: ['AWSCURRENT'],
    });

    const response = await secretsClient.send(command);
    console.log('Secret updated, version:', response.VersionId);

    // ✅ Invalidar cache local
    cachedSecret = null;
    cacheTime = 0;

    return response.VersionId;
  } catch (error) {
    console.error('Error updating secret:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * 5. Automatic Secret Rotation
 * ============================================================================
 */

/**
 * Lambda function para rotar secrets automáticamente
 * Se invoca por Secrets Manager según el schedule configurado
 */
export const rotationHandler = async (event: any): Promise<void> => {
  const { Step, Token, SecretId } = event;

  console.log(`Rotation step: ${Step} for secret: ${SecretId}`);

  switch (Step) {
    case 'createSecret':
      await createNewSecretVersion(SecretId, Token);
      break;

    case 'setSecret':
      await updateDatabaseWithNewPassword(SecretId, Token);
      break;

    case 'testSecret':
      await testNewSecret(SecretId, Token);
      break;

    case 'finishSecret':
      await finishRotation(SecretId, Token);
      break;

    default:
      throw new Error(`Unknown rotation step: ${Step}`);
  }
};

async function createNewSecretVersion(secretId: string, token: string) {
  // Generar nueva password
  const newPassword = generateSecurePassword();

  // Obtener secret actual para mantener otros campos
  const currentSecret = await getSecret(secretId);
  const credentials = JSON.parse(currentSecret) as DatabaseCredentials;

  // Actualizar solo la password
  credentials.password = newPassword;

  const command = new PutSecretValueCommand({
    SecretId: secretId,
    SecretString: JSON.stringify(credentials),
    ClientRequestToken: token,
    VersionStages: ['AWSPENDING'],
  });

  await secretsClient.send(command);
  console.log('Created new secret version:', token);
}

async function updateDatabaseWithNewPassword(secretId: string, token: string) {
  // Obtener nueva password de la versión AWSPENDING
  const command = new GetSecretValueCommand({
    SecretId: secretId,
    VersionStage: 'AWSPENDING',
    VersionId: token,
  });

  const response = await secretsClient.send(command);
  const newCreds = JSON.parse(response.SecretString || '{}') as DatabaseCredentials;

  // Conectar con credenciales actuales y actualizar password
  // const adminConnection = await connectWithCurrentCreds();
  // await adminConnection.query(
  //   `ALTER USER '${newCreds.username}' IDENTIFIED BY '${newCreds.password}'`
  // );

  console.log('Database password updated');
}

async function testNewSecret(secretId: string, token: string) {
  // Obtener nueva password
  const command = new GetSecretValueCommand({
    SecretId: secretId,
    VersionStage: 'AWSPENDING',
    VersionId: token,
  });

  const response = await secretsClient.send(command);
  const newCreds = JSON.parse(response.SecretString || '{}') as DatabaseCredentials;

  // Intentar conectar con las nuevas credenciales
  // const connection = await testConnection(newCreds);
  // connection.close();

  console.log('New secret tested successfully');
}

async function finishRotation(secretId: string, token: string) {
  // Mover version de AWSPENDING a AWSCURRENT
  const command = new UpdateSecretCommand({
    SecretId: secretId,
    RotationLambdaARN: process.env.ROTATION_LAMBDA_ARN,
  });

  await secretsClient.send(command);
  console.log('Rotation finished:', token);
}

/**
 * ============================================================================
 * 6. Configurar Automatic Rotation (SAM Template)
 * ============================================================================
 */

/*
Resources:
  MySecret:
    Type: AWS::SecretsManager::Secret
    Properties:
      Name: prod/database/credentials
      Description: Production database credentials
      KmsKeyId: !Ref KMSKey
      GenerateSecretString:
        SecretStringTemplate: '{"username": "dbadmin"}'
        GenerateStringKey: "password"
        PasswordLength: 32
        ExcludeCharacters: '"@/\'

  RotationSchedule:
    Type: AWS::SecretsManager::RotationSchedule
    Properties:
      SecretId: !Ref MySecret
      RotationLambdaARN: !GetAtt RotationFunction.Arn
      RotationRules:
        AutomaticallyAfterDays: 30  # Rotar cada 30 días

  RotationFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: rotation.handler
      Runtime: nodejs20.x
      Policies:
        - Statement:
          - Effect: Allow
            Action:
              - secretsmanager:DescribeSecret
              - secretsmanager:GetSecretValue
              - secretsmanager:PutSecretValue
              - secretsmanager:UpdateSecretVersionStage
            Resource: !Ref MySecret
*/

/**
 * ============================================================================
 * 7. Best Practices
 * ============================================================================
 */

/**
 * SECRETS MANAGER BEST PRACTICES:
 *
 * 1. NUNCA hardcodear secrets en código
 * 2. Usar Secrets Manager para credentials sensibles
 * 3. Habilitar automatic rotation
 * 4. Usar KMS encryption (customer managed keys)
 * 5. Implementar caching en Lambda (warm starts)
 * 6. Usar version stages (AWSCURRENT, AWSPENDING)
 * 7. Tags para organización y cost allocation
 * 8. Least privilege IAM permissions
 * 9. Audit access con CloudTrail
 * 10. Delete secrets con recovery window (30 días)
 *
 * CUÁNDO USAR SECRETS MANAGER vs PARAMETER STORE:
 *
 * Secrets Manager:
 * - Database credentials
 * - API keys de terceros
 * - Automatic rotation requerida
 * - Cross-region replication
 * - Built-in integration con RDS/DocumentDB
 *
 * Parameter Store:
 * - Configuration values
 * - Feature flags
 * - Secrets simples (sin rotation)
 * - Más económico ($0 SecureString con default KMS)
 */

/**
 * ============================================================================
 * Ejercicio Práctico
 * ============================================================================
 *
 * Crear una Lambda que:
 * 1. Obtiene API key de Secrets Manager
 * 2. Usa la API key para llamar a servicio externo
 * 3. Implementa caching de secrets (5 min TTL)
 * 4. Maneja errores de Secrets Manager
 * 5. No expone secrets en logs ni respuestas
 * 6. Implementa retry logic con exponential backoff
 *
 * Bonus: Crear función de rotation para rotar API key automáticamente
 */
