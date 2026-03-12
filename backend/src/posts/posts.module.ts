import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { PostViewsCacheService } from './post-views-cache.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [PostsController],
  providers: [PostsService, PostViewsCacheService],
})
export class PostsModule {}
