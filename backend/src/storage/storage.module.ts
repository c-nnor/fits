import { Module } from '@nestjs/common';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';
import { StorageService } from './storage.types';

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

@Module({
  providers: [
    LocalStorageService,
    S3StorageService,
    {
      provide: STORAGE_SERVICE,
      useFactory: (
        localStorageService: LocalStorageService,
        s3StorageService: S3StorageService,
      ): StorageService => {
        const provider = process.env.STORAGE_PROVIDER?.toLowerCase() ?? 'local';
        return provider === 's3' ? s3StorageService : localStorageService;
      },
      inject: [LocalStorageService, S3StorageService],
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
