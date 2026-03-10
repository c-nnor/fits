export type UploadMediaType = 'image' | 'video';
export type StorageProvider = 'LOCAL' | 'S3';

export type UploadInput = {
  fileBuffer: Buffer;
  mimeType: string;
  extension: string;
  folder: string;
  type: UploadMediaType;
};

export type StoredObject = {
  key: string;
  url: string;
  provider: StorageProvider;
};

export interface StorageService {
  save(input: UploadInput): Promise<StoredObject>;
  remove(key: string): Promise<void>;
}
