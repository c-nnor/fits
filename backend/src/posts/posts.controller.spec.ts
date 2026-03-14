import { BadRequestException } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  const createPost = jest.fn();
  const getPostById = jest.fn();
  const getFeed = jest.fn();
  const getExploreFeed = jest.fn();
  const postsService = {
    createPost,
    getPostById,
    getFeed,
    getExploreFeed,
  } as unknown as PostsService;
  const controller = new PostsController(postsService);

  beforeEach(() => {
    createPost.mockReset();
    getPostById.mockReset();
    getFeed.mockReset();
    getExploreFeed.mockReset();
  });

  it('fetches the ranked feed', async () => {
    getFeed.mockResolvedValue({ items: [], nextCursor: null });

    const result = await controller.getFeed('12', 'post-1');

    expect(result).toEqual({ items: [], nextCursor: null });
    expect(getFeed).toHaveBeenCalledWith({ limit: 12, cursor: 'post-1' });
  });

  it('fetches the explore feed', async () => {
    getExploreFeed.mockResolvedValue({ items: [], nextCursor: null });

    const result = await controller.getExploreFeed(undefined, undefined);

    expect(result).toEqual({ items: [], nextCursor: null });
    expect(getExploreFeed).toHaveBeenCalledWith({
      limit: undefined,
      cursor: undefined,
    });
  });

  it('fetches a post by id', async () => {
    getPostById.mockResolvedValue({ id: 'post-1', views: 7 });

    const result = await controller.getPostById('post-1');

    expect(result).toEqual({ id: 'post-1', views: 7 });
    expect(getPostById).toHaveBeenCalledWith('post-1');
  });

  it('creates a post with parsed videoDurationSeconds', async () => {
    createPost.mockResolvedValue({ id: 'post-1' });

    const result = await controller.createPost(
      { user: { sub: 'user-1' } } as any,
      {
        caption: 'Hello',
        location: 'Earth',
        videoDurationSeconds: '18',
      },
      [{ mimetype: 'video/mp4' }] as any,
    );

    expect(result).toEqual({ id: 'post-1' });
    expect(createPost).toHaveBeenCalledWith(
      'user-1',
      {
        caption: 'Hello',
        location: 'Earth',
        videoDurationSeconds: 18,
      },
      [{ mimetype: 'video/mp4' }],
    );
  });

  it('passes undefined videoDurationSeconds when omitted', async () => {
    createPost.mockResolvedValue({ id: 'post-2' });

    await controller.createPost(
      { user: { sub: 'user-1' } } as any,
      { caption: 'No video duration' },
      [],
    );

    expect(createPost).toHaveBeenCalledWith(
      'user-1',
      {
        caption: 'No video duration',
        location: undefined,
        videoDurationSeconds: undefined,
      },
      [],
    );
  });

  it('throws when videoDurationSeconds is not an integer', async () => {
    await expect(
      controller.createPost(
        { user: { sub: 'user-1' } } as any,
        { videoDurationSeconds: 'invalid' },
        [],
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
