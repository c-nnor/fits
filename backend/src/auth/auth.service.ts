import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { OAuthProvider, User, UserRole } from '@prisma/client';
import { randomBytes } from 'crypto';
import { OAuthUserPayload } from './types/oauth-user.type';

type TikTokTokenData = {
  access_token?: string;
  refresh_token?: string;
  open_id?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

type TikTokTokenResponse = TikTokTokenData & {
  data?: TikTokTokenData;
  error?: { message?: string };
  message?: string;
};

type TikTokUserInfoResponse = {
  data?: {
    user?: {
      open_id?: string;
      display_name?: string;
      avatar_url?: string;
    };
  };
  error?: { message?: string };
  message?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('Account with this email already exists');
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (existingUsername) {
      throw new BadRequestException('Username already taken');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
    return {
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueSessionTokens(user);
  }

  async loginWithOauth(oauthPayload: OAuthUserPayload) {
    const provider = this.resolveProvider(oauthPayload.provider);

    const linkedAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: oauthPayload.providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    let user: User | null = linkedAccount?.user ?? null;

    if (!user) {
      const canLinkByEmail = Boolean(oauthPayload.email && oauthPayload.emailVerified);
      if (canLinkByEmail) {
        user = await this.prisma.user.findUnique({
          where: {
            email: oauthPayload.email as string,
          },
        });
      }

      if (!user) {
        const email =
          canLinkByEmail && oauthPayload.email
            ? oauthPayload.email
            : this.getSyntheticOauthEmail(provider, oauthPayload.providerAccountId);

        const username = await this.generateUniqueUsername(
          oauthPayload.displayName ?? oauthPayload.email ?? `${provider.toLowerCase()}_user`,
        );

        user = await this.prisma.user.create({
          data: {
            email,
            username,
            displayName: oauthPayload.displayName ?? null,
            profileImage: oauthPayload.profileImage ?? null,
            isVerified: canLinkByEmail,
          },
        });
      }

      await this.prisma.oAuthAccount.create({
        data: {
          provider,
          providerAccountId: oauthPayload.providerAccountId,
          email: oauthPayload.email ?? null,
          accessToken: oauthPayload.accessToken ?? null,
          refreshToken: oauthPayload.refreshToken ?? null,
          expiresAt: oauthPayload.expiresAt ?? null,
          scope: oauthPayload.scope ?? null,
          tokenType: oauthPayload.tokenType ?? null,
          idToken: oauthPayload.idToken ?? null,
          userId: user.id,
        },
      });
    } else {
      await this.prisma.oAuthAccount.update({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId: oauthPayload.providerAccountId,
          },
        },
        data: {
          email: oauthPayload.email ?? null,
          accessToken: oauthPayload.accessToken ?? null,
          refreshToken: oauthPayload.refreshToken ?? null,
          expiresAt: oauthPayload.expiresAt ?? null,
          scope: oauthPayload.scope ?? null,
          tokenType: oauthPayload.tokenType ?? null,
          idToken: oauthPayload.idToken ?? null,
        },
      });
    }

    return this.issueSessionTokens(user);
  }

  buildTiktokAuthorizationUrl() {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const redirectUri = process.env.TIKTOK_CALLBACK_URL;
    if (!clientKey || !redirectUri) {
      throw new Error('TIKTOK_CLIENT_KEY or TIKTOK_CALLBACK_URL is not set');
    }

    const state = randomBytes(16).toString('hex');
    const scope = process.env.TIKTOK_SCOPES ?? 'user.info.basic';
    const params = new URLSearchParams({
      client_key: clientKey,
      response_type: 'code',
      scope,
      redirect_uri: redirectUri,
      state,
    });

    return {
      state,
      authorizationUrl: `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`,
    };
  }

  async exchangeTiktokCode(code: string): Promise<OAuthUserPayload> {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = process.env.TIKTOK_CALLBACK_URL;
    if (!clientKey || !clientSecret || !redirectUri) {
      throw new Error(
        'TikTok OAuth env vars are missing. Set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, and TIKTOK_CALLBACK_URL.',
      );
    }

    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString(),
    });

    const tokenJson = (await tokenRes.json()) as TikTokTokenResponse;
    const tokenData = tokenJson.data ?? tokenJson;
    if (!tokenRes.ok || !tokenData.access_token || !tokenData.open_id) {
      throw new UnauthorizedException(
        tokenJson.error?.message ?? tokenJson.message ?? 'Failed to exchange TikTok authorization code',
      );
    }

    const userInfoRes = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    const userInfoJson = (await userInfoRes.json()) as TikTokUserInfoResponse;
    if (!userInfoRes.ok) {
      throw new UnauthorizedException(
        userInfoJson.error?.message ?? userInfoJson.message ?? 'Failed to fetch TikTok profile',
      );
    }

    const user = userInfoJson.data?.user;
    const expiresAt = tokenData.expires_in
      ? Math.floor(Date.now() / 1000) + tokenData.expires_in
      : null;

    return {
      provider: 'TIKTOK',
      providerAccountId: user?.open_id ?? tokenData.open_id,
      displayName: user?.display_name ?? null,
      profileImage: user?.avatar_url ?? null,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token ?? null,
      expiresAt,
      scope: tokenData.scope ?? null,
      tokenType: tokenData.token_type ?? null,
      email: null,
      emailVerified: false,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async refreshTokens(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify<{ sub: string }>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueSessionTokens(user);
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  private async issueSessionTokens(user: User) {
    const accessToken = this.getAccessToken(user.id, user.role);
    const refreshToken = this.getRefreshToken(user.id);

    const refreshTokenHash = await this.hashToken(refreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    return {
      accessToken,
      refreshTokenForCookie: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  private resolveProvider(provider: OAuthUserPayload['provider']): OAuthProvider {
    if (provider === 'GOOGLE') {
      return OAuthProvider.GOOGLE;
    }

    return OAuthProvider.TIKTOK;
  }

  private getSyntheticOauthEmail(provider: OAuthProvider, providerAccountId: string) {
    return `${provider.toLowerCase()}.${providerAccountId}@oauth.local`;
  }

  private async generateUniqueUsername(seed: string) {
    const normalized = this.normalizeUsername(seed);
    let candidate = normalized;
    let suffix = 1;

    while (true) {
      const existing = await this.prisma.user.findUnique({
        where: { username: candidate },
      });
      if (!existing) {
        return candidate;
      }

      suffix += 1;
      const suffixText = suffix.toString();
      const maxBaseLength = Math.max(3, 20 - suffixText.length);
      candidate = `${normalized.slice(0, maxBaseLength)}${suffixText}`;
    }
  }

  private normalizeUsername(input: string) {
    const sanitized = input
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');

    if (!sanitized) {
      return `user_${randomBytes(3).toString('hex')}`;
    }

    return sanitized.slice(0, 20);
  }

  private getAccessToken(userId: string, role: UserRole) {
    return this.jwtService.sign({ sub: userId, role }, { expiresIn: '1h' });
  }

  private getRefreshToken(userId: string) {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
  }

  private async hashToken(token: string) {
    return bcrypt.hash(token, 10);
  }
}
