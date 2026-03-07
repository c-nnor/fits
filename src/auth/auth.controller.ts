import { Body, Controller, Post, Req, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { refreshTokenForCookie, accessToken, user } = await this.authService.login(dto);
  
    res.cookie('refreshToken', refreshTokenForCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth', // or '/auth/refresh'
    });
  
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
    // clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
