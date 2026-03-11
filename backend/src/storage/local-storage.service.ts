import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { StoredObject, StorageService, UploadInput } from './storage.types';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly uploadsRoot = join(process.cwd(), 'uploads');

  async save(input: UploadInput): Promise<StoredObject> {
    const folderPath = join(this.uploadsRoot, input.folder);
    await mkdir(folderPath, { recursive: true });

    const fileName = `${input.type}-${randomUUID()}.${input.extension}`;
    const key = `${input.folder}/${fileName}`;
    const absolutePath = join(this.uploadsRoot, key);
    await writeFile(absolutePath, input.fileBuffer);

    return {
      key,
      url: `/uploads/${key}`,
      provider: 'LOCAL',
    };
  }

  async remove(key: string): Promise<void> {
    const absolutePath = join(this.uploadsRoot, key);
    await unlink(absolutePath).catch(() => undefined);
  }
}
