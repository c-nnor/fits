import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { StorageService, StoredObject, UploadInput } from './storage.types';

@Injectable()
export class S3StorageService implements StorageService {
  private readonly bucket = process.env.S3_BUCKET;
  private readonly region = process.env.S3_REGION;
  private readonly endpoint = process.env.S3_ENDPOINT;
  private readonly forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true';
  private readonly publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;

  private readonly client = new S3Client({
    region: this.region,
    endpoint: this.endpoint,
    forcePathStyle: this.forcePathStyle,
    credentials:
      process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          }
        : undefined,
  });

  async save(input: UploadInput): Promise<StoredObject> {
    if (!this.bucket || !this.region) {
      throw new NotImplementedException(
        'Set S3_BUCKET and S3_REGION before using STORAGE_PROVIDER=s3.',
      );
    }

    const key = `${input.folder}/${input.type}-${randomUUID()}.${input.extension}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: input.fileBuffer,
        ContentType: input.mimeType,
      }),
    );

    return {
      key,
      url: this.resolvePublicUrl(key),
      provider: 'S3',
    };
  }

  async remove(key: string): Promise<void> {
    if (!this.bucket || !this.region) {
      return;
    }
    await this.client
      .send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      )
      .catch(() => undefined);
  }

  private resolvePublicUrl(key: string) {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl.replace(/\/+$/, '')}/${key}`;
    }

    if (this.endpoint && this.forcePathStyle) {
      return `${this.endpoint.replace(/\/+$/, '')}/${this.bucket}/${key}`;
    }

    if (this.endpoint) {
      const cleanEndpoint = this.endpoint.replace(/\/+$/, '');
      return `${cleanEndpoint}/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
