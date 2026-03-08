export type OAuthProviderName = 'GOOGLE' | 'TIKTOK';

export type OAuthUserPayload = {
  provider: OAuthProviderName;
  providerAccountId: string;
  email?: string | null;
  emailVerified?: boolean;
  displayName?: string | null;
  profileImage?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: number | null;
  scope?: string | null;
  tokenType?: string | null;
  idToken?: string | null;
};
