import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService) {}

    async register(registerDto: RegisterDto) {
        const { email, username, password } = registerDto;

        // check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new BadRequestException('User already exists');
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
        return user;
    }
}
