import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // test for rate limiting:
  // @Throttle({ default: { ttl: 60_000, limit: 1 } })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
