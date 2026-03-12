import { BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';

type UploadedFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

const imageFile = (name = 'image.jpg'): UploadedFile => ({
  buffer: Buffer.from('img'),
  mimetype: 'image/jpeg',
  originalname: name,
});

const videoFile = (name = 'video.mp4'): UploadedFile => ({
  buffer: Buffer.from('video'),
  mimetype: 'video/mp4',
  originalname: name,
});

describe('PostsService', () => {
  const prisma = {
    $transaction: jest.fn(),
    postMedia: {
      findMany: jest.fn(),
    },
  } as any;

  const storageService = {
    save: jest.fn(),
    remove: jest.fn(),
  };

  let service: PostsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostsService(prisma, storageService as any);
  });

  it('throws when no files are provided', async () => {
    await expect(service.createPost('user-1', {}, [])).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws when files include unsupported mime types', async () => {
    const files = [
      {
        buffer: Buffer.from('x'),
        mimetype: 'application/pdf',
        originalname: 'file.pdf',
      },
    ] as UploadedFile[];

    await expect(service.createPost('user-1', {}, files)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws when mixing images and video', async () => {
    await expect(
      service.createPost('user-1', {}, [imageFile(), videoFile()]),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when a video is missing duration', async () => {
    await expect(service.createPost('user-1', {}, [videoFile()])).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('creates a post and returns media', async () => {
    storageService.save.mockResolvedValue({
      key: 'posts/user-1/image-1.jpg',
      url: 'https://cdn.example.com/posts/user-1/image-1.jpg',
      provider: 'LOCAL',
    });

    prisma.$transaction.mockImplementation(async (cb: (tx: any) => unknown) =>
      cb({
        post: {
          create: jest.fn().mockResolvedValue({ id: 'post-1', userId: 'user-1' }),
        },
        postMedia: {
          createMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      }),
    );
    prisma.postMedia.findMany.mockResolvedValue([
      {
        id: 'media-1',
        postId: 'post-1',
        type: 'IMAGE',
        url: 'https://cdn.example.com/posts/user-1/image-1.jpg',
      },
    ]);

    const result = await service.createPost(
      'user-1',
      { caption: 'Caption' },
      [imageFile()],
    );

    expect(storageService.save).toHaveBeenCalledTimes(1);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: 'post-1',
      userId: 'user-1',
      media: [
        {
          id: 'media-1',
          postId: 'post-1',
          type: 'IMAGE',
          url: 'https://cdn.example.com/posts/user-1/image-1.jpg',
        },
      ],
    });
  });

  it('removes uploaded files when persistence fails', async () => {
    storageService.save.mockResolvedValue({
      key: 'posts/user-1/video-1.mp4',
      url: 'https://cdn.example.com/posts/user-1/video-1.mp4',
      provider: 'LOCAL',
    });

    const txError = new Error('transaction failed');
    prisma.$transaction.mockRejectedValue(txError);

    await expect(
      service.createPost('user-1', { videoDurationSeconds: 5 }, [videoFile()]),
    ).rejects.toThrow('transaction failed');

    expect(storageService.remove).toHaveBeenCalledWith('posts/user-1/video-1.mp4');
  });
});
