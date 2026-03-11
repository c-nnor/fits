import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { STORAGE_SERVICE } from '../storage/storage.module';
import type { StorageService } from '../storage/storage.types';
import { CreatePostDto } from './dto/create-post.dto';

type UploadedFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

type PostMediaKind = 'IMAGE' | 'VIDEO';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
  ) {}

  async createPost(
    userId: string,
    dto: CreatePostDto,
    files: UploadedFile[],
  ) {
    if (!files.length) {
      throw new BadRequestException('At least one media file is required');
    }

    const images = files.filter((file) => file.mimetype.startsWith('image/'));
    const videos = files.filter((file) => file.mimetype.startsWith('video/'));

    if (images.length + videos.length !== files.length) {
      throw new BadRequestException('Only image/* and video/* files are allowed');
    }

    if (videos.length > 1) {
      throw new BadRequestException('A post can contain only one video');
    }

    if (videos.length === 1 && images.length > 0) {
      throw new BadRequestException('A post cannot mix images and video');
    }

    if (videos.length === 1) {
      if (dto.videoDurationSeconds == null) {
        throw new BadRequestException(
          'videoDurationSeconds is required when uploading a video',
        );
      }
      if (dto.videoDurationSeconds > 20) {
        throw new BadRequestException('Video duration cannot exceed 20 seconds');
      }
    }

    const uploadedKeys: string[] = [];

    try {
      const uploaded = await Promise.all(
        files.map(async (file, index) => {
          const type: PostMediaKind = file.mimetype.startsWith('video/')
            ? 'VIDEO'
            : 'IMAGE';

          const stored = await this.storageService.save({
            fileBuffer: file.buffer,
            mimeType: file.mimetype,
            extension: this.resolveExtension(file),
            folder: `posts/${userId}`,
            type: type === 'VIDEO' ? 'video' : 'image',
          });
          uploadedKeys.push(stored.key);

          return {
            type,
            url: stored.url,
            storageKey: stored.key,
            storageProvider: stored.provider,
            durationSeconds: type === 'VIDEO' ? dto.videoDurationSeconds ?? null : null,
            sortOrder: index,
          };
        }),
      );

      const post = await this.prisma.$transaction(async (tx) => {
        const post = await tx.post.create({
          data: {
            userId,
            caption: dto.caption?.trim() || null,
            location: dto.location?.trim() || null,
          } as any,
        });

        await (tx as any).postMedia.createMany({
          data: uploaded.map((item) => ({
            postId: post.id,
            type: item.type,
            url: item.url,
            storageKey: item.storageKey,
            storageProvider: item.storageProvider,
            durationSeconds: item.durationSeconds,
            sortOrder: item.sortOrder,
          })),
        });

        return post;
      });

      const media = await (this.prisma as any).postMedia.findMany({
        where: { postId: post.id },
        orderBy: { sortOrder: 'asc' },
      });

      return {
        ...post,
        media,
      };
    } catch (error) {
      await Promise.all(uploadedKeys.map((key) => this.storageService.remove(key)));
      throw error;
    }
  }

  private resolveExtension(file: UploadedFile) {
    const fromName = file.originalname.split('.').pop()?.toLowerCase();
    if (fromName && /^[a-z0-9]+$/.test(fromName)) {
      return fromName;
    }

    if (file.mimetype === 'image/jpeg') {
      return 'jpg';
    }
    if (file.mimetype === 'image/png') {
      return 'png';
    }
    if (file.mimetype === 'image/webp') {
      return 'webp';
    }
    if (file.mimetype === 'video/mp4') {
      return 'mp4';
    }
    if (file.mimetype === 'video/webm') {
      return 'webm';
    }

    return 'bin';
  }
}
