import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient } from 'redis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostViewsCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostViewsCacheService.name);
  private readonly pendingViewsKey = 'posts:views:pending';
  private readonly flushIntervalMs = 5_000;
  private client: ReturnType<typeof createClient> | null = null;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const client = createClient({ url: redisUrl });

    client.on('error', (error) => {
      this.logger.warn(`Redis error: ${String(error)}`);
    });

    try {
      await client.connect();
      this.client = client;
      this.flushTimer = setInterval(() => {
        void this.flushPendingViews();
      }, this.flushIntervalMs);
    } catch (error) {
      this.logger.warn(
        `Redis unavailable, falling back to direct writes: ${String(error)}`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    await this.flushPendingViews();

    if (this.client?.isOpen) {
      await this.client.quit();
    }
  }

  async incrementPendingViews(postId: string): Promise<number | null> {
    if (!this.client?.isReady) {
      return null;
    }

    try {
      return await this.client.hIncrBy(this.pendingViewsKey, postId, 1);
    } catch (error) {
      this.logger.warn(
        `Failed to increment cached views for ${postId}: ${String(error)}`,
      );
      return null;
    }
  }

  private async flushPendingViews() {
    if (!this.client?.isReady) {
      return;
    }

    const entries = await this.readAndClearPendingViews();
    if (!entries.length) {
      return;
    }

    await Promise.all(
      entries.map(async ([postId, incrementBy]) => {
        if (incrementBy <= 0) {
          return;
        }

        try {
          await (this.prisma as any).post.updateMany({
            where: { id: postId },
            data: { views: { increment: incrementBy } },
          });
        } catch (error) {
          this.logger.warn(
            `Failed flushing ${incrementBy} views for ${postId}: ${String(error)}`,
          );
          await this.client?.hIncrBy(this.pendingViewsKey, postId, incrementBy);
        }
      }),
    );
  }

  private async readAndClearPendingViews(): Promise<Array<[string, number]>> {
    if (!this.client?.isReady) {
      return [];
    }

    try {
      const values = (await this.client.eval(
        `
          local data = redis.call('HGETALL', KEYS[1])
          redis.call('DEL', KEYS[1])
          return data
        `,
        { keys: [this.pendingViewsKey] },
      )) as string[];

      const parsed: Array<[string, number]> = [];
      for (let index = 0; index < values.length; index += 2) {
        const postId = values[index];
        const incrementBy = Number.parseInt(values[index + 1] ?? '0', 10);
        if (!Number.isFinite(incrementBy)) {
          continue;
        }
        parsed.push([postId, incrementBy]);
      }

      return parsed;
    } catch (error) {
      this.logger.warn(`Failed to flush cached views: ${String(error)}`);
      return [];
    }
  }
}
