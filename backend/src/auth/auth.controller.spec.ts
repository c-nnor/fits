import { UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    buildTiktokAuthorizationUrl: jest.fn(),
    exchangeTiktokCode: jest.fn(),
    loginWithOauth: jest.fn(),
    getAllUsers: jest.fn(),
  } as unknown as AuthService;

  const controller = new AuthController(authService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('register forwards dto to service', async () => {
    (authService.register as jest.Mock).mockResolvedValue({
      message: 'Account created successfully',
    });

    const dto = {
      email: 'user@example.com',
      username: 'user123',
      password: 'secret1',
    };
    await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('login sets refresh token cookie and returns access token payload', async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      refreshTokenForCookie: 'refresh-token',
      accessToken: 'access-token',
      user: { id: 'user-1' },
    });
    const res = {
      cookie: jest.fn(),
    } as unknown as Response;

    const result = await controller.login(
      { email: 'user@example.com', password: 'secret1' },
      res,
    );

    expect(result).toEqual({
      accessToken: 'access-token',
      user: { id: 'user-1' },
    });
    expect((res as any).cookie).toHaveBeenCalledWith(
      'refreshToken',
      'refresh-token',
      expect.objectContaining({
        httpOnly: true,
      }),
    );
  });

  it('refresh rejects when refresh cookie is missing', async () => {
    await expect(
      controller.refresh({ cookies: {} } as any, {} as Response),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('refresh rotates cookie and returns new access token', async () => {
    (authService.refreshTokens as jest.Mock).mockResolvedValue({
      accessToken: 'new-access-token',
      refreshTokenForCookie: 'new-refresh-token',
      user: { id: 'user-1' },
    });
    const res = {
      cookie: jest.fn(),
    } as unknown as Response;

    const result = await controller.refresh(
      { cookies: { refreshToken: 'old-refresh-token' } } as any,
      res,
    );

    expect(authService.refreshTokens).toHaveBeenCalledWith('old-refresh-token');
    expect((res as any).cookie).toHaveBeenCalledWith(
      'refreshToken',
      'new-refresh-token',
      expect.any(Object),
    );
    expect(result).toEqual({
      accessToken: 'new-access-token',
      user: { id: 'user-1' },
    });
  });

  it('logout clears refresh cookie paths and returns confirmation', async () => {
    const res = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const result = await controller.logout({ user: { sub: 'user-1' } } as any, res);

    expect(authService.logout).toHaveBeenCalledWith('user-1');
    expect((res as any).clearCookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ message: 'Logged out successfully' });
  });
});
