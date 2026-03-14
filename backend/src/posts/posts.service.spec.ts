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
  const postViewsCacheService = {
    incrementPendingViews: jest.fn(),
  };

  let service: PostsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostsService(
      prisma,
      storageService as any,
      postViewsCacheService as any,
    );
  });

  it('returns not found for unknown posts', async () => {
    prisma.post = {
      findUnique: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
    };

    await expect(service.getPostById('missing')).rejects.toThrow('Post not found');
  });

  it('returns post with cached view increment when redis is available', async () => {
    prisma.post = {
      findUnique: jest.fn().mockResolvedValue({
        id: 'post-1',
        userId: 'user-1',
        views: 10,
        media: [],
      }),
      update: jest.fn(),
    };
    postViewsCacheService.incrementPendingViews.mockResolvedValue(3);

    const result = await service.getPostById('post-1');

    expect(result).toMatchObject({ id: 'post-1', views: 13 });
    expect(prisma.post.update).not.toHaveBeenCalled();
  });

  it('falls back to direct db writes when redis is unavailable', async () => {
    prisma.post = {
      findUnique: jest.fn().mockResolvedValue({
        id: 'post-1',
        userId: 'user-1',
        views: 10,
        media: [],
      }),
      update: jest.fn().mockResolvedValue({ views: 11 }),
    };
    postViewsCacheService.incrementPendingViews.mockResolvedValue(null);

    const result = await service.getPostById('post-1');

    expect(result).toMatchObject({ id: 'post-1', views: 11 });
    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { id: 'post-1' },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
  });

  it('returns feed ranked by recency and engagement', async () => {
    const now = new Date('2026-03-12T12:00:00.000Z').getTime();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    prisma.post = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'new-low-engagement',
          views: 2,
          createdAt: new Date('2026-03-12T11:30:00.000Z'),
          _count: { likes: 0, comments: 0 },
          media: [],
          user: { id: 'u-1', username: 'a' },
        },
        {
          id: 'old-high-engagement',
          views: 300,
          createdAt: new Date('2026-03-09T12:00:00.000Z'),
          _count: { likes: 60, comments: 20 },
          media: [],
          user: { id: 'u-2', username: 'b' },
        },
      ]),
    };

    const result = await service.getFeed({ limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe('new-low-engagement');
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 50,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
    );
    jest.restoreAllMocks();
  });

  it('returns explore feed ranked by random plus engagement', async () => {
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.9);

    prisma.post = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'high-engagement-low-random',
          views: 1000,
          createdAt: new Date('2026-03-12T11:00:00.000Z'),
          _count: { likes: 200, comments: 50 },
          media: [],
          user: { id: 'u-1', username: 'a' },
        },
        {
          id: 'low-engagement-high-random',
          views: 1,
          createdAt: new Date('2026-03-12T10:00:00.000Z'),
          _count: { likes: 0, comments: 0 },
          media: [],
          user: { id: 'u-2', username: 'b' },
        },
      ]),
    };

    const result = await service.getExploreFeed({ limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe('low-engagement-high-random');
    expect(randomSpy).toHaveBeenCalledTimes(2);
    randomSpy.mockRestore();
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
