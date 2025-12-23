import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error('R2 configuration is missing');
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'profile-images';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Upload a file to R2 storage
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  userId: string
): Promise<UploadResult> {
  const ext = fileName.split('.').pop();
  const key = `${userId}/${nanoid()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);

  const url = `${PUBLIC_URL}/${key}`;

  return { key, url };
}

/**
 * Delete a file from R2 storage
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Get a presigned URL for uploading directly from the client
 */
export async function getPresignedUploadUrl(
  userId: string,
  fileName: string,
  contentType: string
): Promise<{ key: string; uploadUrl: string; publicUrl: string }> {
  const ext = fileName.split('.').pop();
  const key = `${userId}/${nanoid()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour
  const publicUrl = `${PUBLIC_URL}/${key}`;

  return { key, uploadUrl, publicUrl };
}

/**
 * Get a presigned URL for reading a private file
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour

  return url;
}
