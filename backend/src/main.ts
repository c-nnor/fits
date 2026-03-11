import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { mkdirSync } from 'fs';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const uploadsDir = join(process.cwd(), 'uploads');
  mkdirSync(uploadsDir, { recursive: true });

  app.use(cookieParser());
  app.use('/uploads', express.static(uploadsDir));
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // for production, we need to trust the proxy for rate limiting to work :O
  // if we are adding extra proxie or cloudflare CDN, we need to revisit this
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
