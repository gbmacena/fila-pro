import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { IAuthService } from '../common/interfaces/services.interface';
export declare class AuthService implements IAuthService {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    register(username: string, email: string, password: string): Promise<{
        message: string;
    }>;
    login(username: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
    }>;
}
