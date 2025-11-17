/**
 * Comparación de SDKs: AWS vs Azure vs GCP
 *
 * Este archivo muestra cómo realizar operaciones básicas con los SDKs
 * de cada proveedor cloud.
 *
 * Para ejecutar estos ejemplos:
 * 1. npm install @aws-sdk/client-s3 @azure/storage-blob @google-cloud/storage
 * 2. Configura credenciales para cada cloud
 * 3. ts-node 02-sdk-comparison.ts
 */

// ============================================================================
// AWS SDK v3 - Modular
// ============================================================================

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

/**
 * AWS S3 - Upload de archivo
 */
async function awsUploadFile(bucketName: string, key: string, content: string): Promise<void> {
  const client = new S3Client({
    region: 'us-east-1',
    // Credentials se toman de:
    // - Variables de entorno (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    // - ~/.aws/credentials
    // - IAM role (si está en EC2)
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: content,
    ContentType: 'text/plain',
  });

  try {
    const response = await client.send(command);
    console.log('AWS upload success:', response);
  } catch (error) {
    console.error('AWS upload error:', error);
    throw error;
  }
}

/**
 * AWS S3 - Download de archivo
 */
async function awsDownloadFile(bucketName: string, key: string): Promise<string> {
  const client = new S3Client({ region: 'us-east-1' });

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const response = await client.send(command);
    const bodyContents = await streamToString(response.Body as any);
    console.log('AWS download success');
    return bodyContents;
  } catch (error) {
    console.error('AWS download error:', error);
    throw error;
  }
}

// Helper para convertir stream a string
async function streamToString(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

// ============================================================================
// Azure SDK
// ============================================================================

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

/**
 * Azure Blob Storage - Upload de archivo
 */
async function azureUploadFile(
  containerName: string,
  blobName: string,
  content: string
): Promise<void> {
  // Credentials desde environment variables o connection string
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'your-account';
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || 'your-key';

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const uploadResponse = await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: {
        blobContentType: 'text/plain',
      },
    });
    console.log('Azure upload success:', uploadResponse.requestId);
  } catch (error) {
    console.error('Azure upload error:', error);
    throw error;
  }
}

/**
 * Azure Blob Storage - Download de archivo
 */
async function azureDownloadFile(containerName: string, blobName: string): Promise<string> {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'your-account';
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || 'your-key';

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  try {
    const downloadResponse = await blobClient.download();
    const downloaded = await streamToString(downloadResponse.readableStreamBody);
    console.log('Azure download success');
    return downloaded;
  } catch (error) {
    console.error('Azure download error:', error);
    throw error;
  }
}

// ============================================================================
// Google Cloud SDK
// ============================================================================

import { Storage } from '@google-cloud/storage';

/**
 * GCP Cloud Storage - Upload de archivo
 */
async function gcpUploadFile(bucketName: string, fileName: string, content: string): Promise<void> {
  // Credentials desde:
  // - GOOGLE_APPLICATION_CREDENTIALS env var (path to JSON key)
  // - ~/.config/gcloud/application_default_credentials.json
  // - Service account en GCE/GKE
  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID || 'your-project-id',
  });

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  try {
    await file.save(content, {
      contentType: 'text/plain',
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    console.log('GCP upload success');
  } catch (error) {
    console.error('GCP upload error:', error);
    throw error;
  }
}

/**
 * GCP Cloud Storage - Download de archivo
 */
async function gcpDownloadFile(bucketName: string, fileName: string): Promise<string> {
  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID || 'your-project-id',
  });

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  try {
    const [contents] = await file.download();
    console.log('GCP download success');
    return contents.toString('utf-8');
  } catch (error) {
    console.error('GCP download error:', error);
    throw error;
  }
}

// ============================================================================
// Capa de Abstracción Multicloud
// ============================================================================

/**
 * Interfaz común para storage multicloud
 */
interface CloudStorageProvider {
  upload(container: string, key: string, content: string): Promise<void>;
  download(container: string, key: string): Promise<string>;
  delete(container: string, key: string): Promise<void>;
  list(container: string, prefix?: string): Promise<string[]>;
}

/**
 * Implementación AWS
 */
class AwsStorageProvider implements CloudStorageProvider {
  private client: S3Client;

  constructor(region: string = 'us-east-1') {
    this.client = new S3Client({ region });
  }

  async upload(bucket: string, key: string, content: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: content,
    });
    await this.client.send(command);
  }

  async download(bucket: string, key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await this.client.send(command);
    return streamToString(response.Body as any);
  }

  async delete(bucket: string, key: string): Promise<void> {
    // Implementación...
    console.log(`Delete ${bucket}/${key} from AWS`);
  }

  async list(bucket: string, prefix?: string): Promise<string[]> {
    // Implementación...
    console.log(`List ${bucket} from AWS with prefix ${prefix}`);
    return [];
  }
}

/**
 * Implementación Azure
 */
class AzureStorageProvider implements CloudStorageProvider {
  private client: BlobServiceClient;

  constructor(accountName: string, accountKey: string) {
    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    this.client = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
  }

  async upload(container: string, blob: string, content: string): Promise<void> {
    const containerClient = this.client.getContainerClient(container);
    const blockBlobClient = containerClient.getBlockBlobClient(blob);
    await blockBlobClient.upload(content, content.length);
  }

  async download(container: string, blob: string): Promise<string> {
    const containerClient = this.client.getContainerClient(container);
    const blobClient = containerClient.getBlobClient(blob);
    const downloadResponse = await blobClient.download();
    return streamToString(downloadResponse.readableStreamBody);
  }

  async delete(container: string, blob: string): Promise<void> {
    console.log(`Delete ${container}/${blob} from Azure`);
  }

  async list(container: string, prefix?: string): Promise<string[]> {
    console.log(`List ${container} from Azure with prefix ${prefix}`);
    return [];
  }
}

/**
 * Implementación GCP
 */
class GcpStorageProvider implements CloudStorageProvider {
  private storage: Storage;

  constructor(projectId: string) {
    this.storage = new Storage({ projectId });
  }

  async upload(bucket: string, file: string, content: string): Promise<void> {
    await this.storage.bucket(bucket).file(file).save(content);
  }

  async download(bucket: string, file: string): Promise<string> {
    const [contents] = await this.storage.bucket(bucket).file(file).download();
    return contents.toString('utf-8');
  }

  async delete(bucket: string, file: string): Promise<void> {
    console.log(`Delete ${bucket}/${file} from GCP`);
  }

  async list(bucket: string, prefix?: string): Promise<string[]> {
    console.log(`List ${bucket} from GCP with prefix ${prefix}`);
    return [];
  }
}

// ============================================================================
// Factory Pattern para crear provider
// ============================================================================

type CloudProvider = 'aws' | 'azure' | 'gcp';

interface CloudStorageConfig {
  provider: CloudProvider;
  // AWS
  region?: string;
  // Azure
  accountName?: string;
  accountKey?: string;
  // GCP
  projectId?: string;
}

/**
 * Factory para crear storage provider según configuración
 */
class CloudStorageFactory {
  static create(config: CloudStorageConfig): CloudStorageProvider {
    switch (config.provider) {
      case 'aws':
        return new AwsStorageProvider(config.region);

      case 'azure':
        if (!config.accountName || !config.accountKey) {
          throw new Error('Azure requires accountName and accountKey');
        }
        return new AzureStorageProvider(config.accountName, config.accountKey);

      case 'gcp':
        if (!config.projectId) {
          throw new Error('GCP requires projectId');
        }
        return new GcpStorageProvider(config.projectId);

      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }
  }
}

// ============================================================================
// Ejemplo de uso
// ============================================================================

async function main() {
  console.log('=== Multicloud Storage Abstraction Demo ===\n');

  // Configuración (normalmente vendría de environment variables)
  const configs: CloudStorageConfig[] = [
    {
      provider: 'aws',
      region: 'us-east-1',
    },
    {
      provider: 'azure',
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME!,
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY!,
    },
    {
      provider: 'gcp',
      projectId: process.env.GCP_PROJECT_ID!,
    },
  ];

  const testContent = 'Hello from multicloud application!';
  const testFile = 'test-file.txt';

  // Probar cada provider con la misma interfaz
  for (const config of configs) {
    console.log(`\n--- Testing ${config.provider.toUpperCase()} ---`);

    try {
      const storage = CloudStorageFactory.create(config);

      // Upload
      await storage.upload('my-bucket', testFile, testContent);
      console.log(`✅ Upload successful`);

      // Download
      const downloaded = await storage.download('my-bucket', testFile);
      console.log(`✅ Download successful: ${downloaded.substring(0, 30)}...`);

      // List
      await storage.list('my-bucket', 'test-');
      console.log(`✅ List successful`);
    } catch (error) {
      console.error(`❌ Error with ${config.provider}:`, error);
    }
  }

  console.log('\n=== Demo Complete ===');
}

// ============================================================================
// Comparación de Características de SDKs
// ============================================================================

/**
 * Comparación de características:
 *
 * AWS SDK v3:
 * ✅ Modular (instala solo lo que necesitas)
 * ✅ TypeScript nativo
 * ✅ Middleware support
 * ✅ Paginators y waiters
 * ❌ Curva de aprendizaje (cambio de v2)
 *
 * Azure SDK:
 * ✅ TypeScript nativo
 * ✅ Consistente entre servicios
 * ✅ Retry policies built-in
 * ❌ Menos maduro que AWS
 * ❌ Documentación a veces confusa
 *
 * Google Cloud SDK:
 * ✅ Simple y limpio
 * ✅ TypeScript nativo
 * ✅ Buena documentación
 * ❌ Menos features que AWS
 * ❌ Comunidad más pequeña
 *
 * Conclusión:
 * - Para flexibilidad: AWS SDK v3
 * - Para enterprise: Azure SDK
 * - Para simplicidad: Google Cloud SDK
 * - Para multicloud: Crea tu propia abstracción
 */

// Descomentar para ejecutar:
// main().catch(console.error);

export {
  CloudStorageProvider,
  CloudStorageFactory,
  AwsStorageProvider,
  AzureStorageProvider,
  GcpStorageProvider,
};
