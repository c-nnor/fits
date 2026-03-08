import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    private getRefreshCookieOptions;
    private clearRefreshCookie;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            username: string;
        };
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
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
}
