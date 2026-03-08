import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { OAuthUserPayload } from './types/oauth-user.type';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const TIKTOK_STATE_COOKIE_NAME = 'tiktokOauthState';
const TIKTOK_STATE_MAX_AGE_MS = 10 * 60 * 1000;

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

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      this.getRefreshCookieOptions(),
    );
  }

  private tiktokStateCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: TIKTOK_STATE_MAX_AGE_MS,
      path: '/',
    };
  }

  private clearTiktokStateCookie(res: Response) {
    const baseOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };
    res.clearCookie(TIKTOK_STATE_COOKIE_NAME, { ...baseOptions, path: '/' });
    res.clearCookie(TIKTOK_STATE_COOKIE_NAME, {
      ...baseOptions,
      path: '/auth',
    });
  }

  private respondOauthSuccess(
    res: Response,
    payload: {
      accessToken: string;
      refreshTokenForCookie: string;
      user: unknown;
    },
  ) {
    this.setRefreshCookie(res, payload.refreshTokenForCookie);

    const successRedirect = process.env.OAUTH_SUCCESS_REDIRECT_URL;
    if (successRedirect) {
      return res.redirect(successRedirect);
    }

    return {
      accessToken: payload.accessToken,
      user: payload.user,
    };
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshTokenForCookie, accessToken, user } =
      await this.authService.login(dto);

    // Refresh token is kept in an httpOnly cookie so JS cannot read it.
    this.setRefreshCookie(res, refreshTokenForCookie);

    return {
      accessToken,
      user,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Frontend should send this automatically via cookie jar / credentials.
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as
      | string
      | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token cookie');
    }

    // Service validates token, verifies hash in DB, then rotates tokens.
    const { accessToken, refreshTokenForCookie, user } =
      await this.authService.refreshTokens(refreshToken);

    // Overwrite old refresh cookie with the rotated (new) token.
    this.setRefreshCookie(res, refreshTokenForCookie);

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: Request & { user: OAuthUserPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionPayload = await this.authService.loginWithOauth(req.user);
    return this.respondOauthSuccess(res, sessionPayload);
  }

  @Get('tiktok')
  tiktokAuth(@Res() res: Response) {
    const { state, authorizationUrl } =
      this.authService.buildTiktokAuthorizationUrl();
    res.cookie(
      TIKTOK_STATE_COOKIE_NAME,
      state,
      this.tiktokStateCookieOptions(),
    );
    return res.redirect(authorizationUrl);
  }

  @Get('tiktok/callback')
  async tiktokAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const code = req.query.code;
    const state = req.query.state;

    if (typeof code !== 'string' || !code) {
      throw new BadRequestException('Missing TikTok authorization code');
    }

    if (typeof state !== 'string' || !state) {
      throw new BadRequestException('Missing TikTok OAuth state');
    }

    const storedState = req.cookies?.[TIKTOK_STATE_COOKIE_NAME] as
      | string
      | undefined;
    this.clearTiktokStateCookie(res);
    if (!storedState || storedState !== state) {
      throw new UnauthorizedException('Invalid TikTok OAuth state');
    }

    const oauthPayload = await this.authService.exchangeTiktokCode(code);
    const sessionPayload = await this.authService.loginWithOauth(oauthPayload);
    return this.respondOauthSuccess(res, sessionPayload);
  }
}
