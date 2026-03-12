import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

type AuthenticatedRequest = Request & { user: { sub: string } };
type UploadedFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Throttle({ default: { limit: 3, ttl: 600_000 } })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('media', 10, {
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async createPost(
    @Req() req: AuthenticatedRequest,
    @Body() body: Record<string, string | undefined>,
    @UploadedFiles() files: UploadedFile[],
  ) {
    const dto: CreatePostDto = {
      caption: body.caption,
      location: body.location,
      videoDurationSeconds: this.parseOptionalInt(body.videoDurationSeconds),
    };

    return this.postsService.createPost(req.user.sub, dto, files ?? []);
  }

  private parseOptionalInt(value: string | undefined) {
    if (value == null || value === '') {
      return undefined;
    }

    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      throw new BadRequestException('videoDurationSeconds must be an integer');
    }

    return parsed;
  }
}
