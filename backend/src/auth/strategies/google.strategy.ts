import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { OAuthUserPayload } from '../types/oauth-user.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'Google OAuth env vars are missing. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL.',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const primaryEmail = profile.emails?.[0];
    const payload: OAuthUserPayload = {
      provider: 'GOOGLE',
      providerAccountId: profile.id,
      email: primaryEmail?.value ?? null,
      emailVerified: primaryEmail?.verified ?? false,
      displayName: profile.displayName ?? null,
      profileImage: profile.photos?.[0]?.value ?? null,
      accessToken,
      refreshToken: refreshToken || null,
    };

    done(null, payload);
  }
}
