import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async register(registerDto: RegisterDto) {
        const { email, username, password } = registerDto;

        // check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new BadRequestException('Account with this email already exists');
        }


        // check if username is already taken
        const existingUsername = await this.prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (existingUsername) {
            throw new BadRequestException('Username already taken');
        }
        // creat user
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

        // check if user exists
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordCorrect) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Short-lived token used for authenticated API calls.
        const accessToken = this.getAccessToken(user.id, user.role);
        // Long-lived token used only to mint a new access token.
        const refreshToken = this.getRefreshToken(user.id);

        // Hash and persist refresh token for later validation/rotation.
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
                role: user.role
            },
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
            // Step 1: verify signature + expiry of the refresh token.
            payload = this.jwtService.verify<{ sub: string }>(refreshToken);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Step 2: load the user referenced by token payload (sub = user id).
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        // User must still have a stored refresh token hash (e.g. not logged out).
        if (!user?.refreshTokenHash) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Step 3: compare incoming raw token to stored bcrypt hash.
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!isRefreshTokenValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Step 4: rotate both tokens so old refresh token cannot be reused.
        const accessToken = this.getAccessToken(user.id, user.role);
        const newRefreshToken = this.getRefreshToken(user.id);
        const newRefreshTokenHash = await this.hashToken(newRefreshToken);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash: newRefreshTokenHash },
        });

        return {
            accessToken,
            refreshTokenForCookie: newRefreshToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        };
    }


    // helpers
    private getAccessToken(userId: string, role: string) {
        return this.jwtService.sign(
            { sub: userId, role },
            { expiresIn: '1h' },
        );
    }

    private getRefreshToken(userId: string) {
        return this.jwtService.sign(
            { sub: userId },
            { expiresIn: '7d' },
        );
    }

    private async hashToken(token: string) {
        return bcrypt.hash(token, 10);
    }


    // Getters for users
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
}
