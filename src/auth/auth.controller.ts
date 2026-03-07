import { Body, Controller, Post, Req, Res, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
      path: '/',
    };
  }

  private clearRefreshCookie(res: Response) {
    // Clear both common paths in case older cookies were issued under `/auth`.
    const baseOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };
    res.clearCookie(REFRESH_COOKIE_NAME, { ...baseOptions, path: '/' });
    res.clearCookie(REFRESH_COOKIE_NAME, { ...baseOptions, path: '/auth' });
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { refreshTokenForCookie, accessToken, user } = await this.authService.login(dto);
  
    // Refresh token is kept in an httpOnly cookie so JS cannot read it.
    res.cookie(REFRESH_COOKIE_NAME, refreshTokenForCookie, this.getRefreshCookieOptions());
  
    return {
      accessToken,
      user,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Frontend should send this automatically via cookie jar / credentials.
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token cookie');
    }

    // Service validates token, verifies hash in DB, then rotates tokens.
    const { accessToken, refreshTokenForCookie, user } = await this.authService.refreshTokens(refreshToken);

    // Overwrite old refresh cookie with the rotated (new) token.
    res.cookie(REFRESH_COOKIE_NAME, refreshTokenForCookie, this.getRefreshCookieOptions());

    return {
      accessToken,
      user,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // req.user is set by JwtStrategy; `sub` is the authenticated user id.
    const user = req.user as { sub: string };
    // Pass user id to service to clear the stored refresh token hash.
    await this.authService.logout(user.sub);
    // Clear refresh cookie in browser/REST client.
    this.clearRefreshCookie(res);
    return { message: 'Logged out successfully' };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
