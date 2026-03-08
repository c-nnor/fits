import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            username: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshTokenForCookie: string;
        user: {
            id: string;
            email: string;
            username: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    logout(userId: string): Promise<void>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshTokenForCookie: string;
        user: {
            id: string;
            email: string;
            username: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    private getAccessToken;
    private getRefreshToken;
    private hashToken;
    getAllUsers(): Promise<{
        email: string;
        username: string;
        id: string;
        passwordHash: string;
        displayName: string | null;
        bio: string | null;
        profileImage: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isPrivate: boolean;
        createdAt: Date;
        updatedAt: Date;
        refreshTokenHash: string | null;
    }[]>;
    getUserById(id: string): Promise<{
        email: string;
        username: string;
        id: string;
        passwordHash: string;
        displayName: string | null;
        bio: string | null;
        profileImage: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isPrivate: boolean;
        createdAt: Date;
        updatedAt: Date;
        refreshTokenHash: string | null;
    } | null>;
    getUserByEmail(email: string): Promise<{
        email: string;
        username: string;
        id: string;
        passwordHash: string;
        displayName: string | null;
        bio: string | null;
        profileImage: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isPrivate: boolean;
        createdAt: Date;
        updatedAt: Date;
        refreshTokenHash: string | null;
    } | null>;
}
