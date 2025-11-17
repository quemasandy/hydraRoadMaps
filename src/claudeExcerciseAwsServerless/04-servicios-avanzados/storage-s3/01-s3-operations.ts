/**
 * AWS S3 Operations con TypeScript
 *
 * Operaciones comunes con S3: upload, download, delete, list, presigned URLs
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';

const s3Client = new S3Client({});

/**
 * Upload file to S3
 */
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
    // Metadata
    Metadata: {
      uploadedBy: 'lambda-function',
      timestamp: new Date().toISOString(),
    },
    // Server-side encryption
    ServerSideEncryption: 'AES256',
  });

  await s3Client.send(command);
  return `s3://${bucket}/${key}`;
}

/**
 * Generate presigned URL for upload (client-side upload)
 */
export async function getPresignedUploadUrl(
  bucket: string,
  key: string,
  expiresIn: number = 3600,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate presigned URL for download
 */
export async function getPresignedDownloadUrl(
  bucket: string,
  key: string,
  expiresIn: number = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Multipart upload for large files
 */
export async function uploadLargeFile(
  bucket: string,
  key: string,
  body: Buffer,
): Promise<string> {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: body,
    },
    // Configuración de multipart
    queueSize: 4, // Concurrent uploads
    partSize: 5 * 1024 * 1024, // 5MB per part
  });

  upload.on('httpUploadProgress', (progress) => {
    console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`);
  });

  await upload.done();
  return `s3://${bucket}/${key}`;
}
