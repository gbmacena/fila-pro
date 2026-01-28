"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../prisma/prisma.service");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
jest.mock('bcryptjs');
describe('AuthService', () => {
    let service;
    let prismaService;
    let jwtService;
    const mockUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(async () => {
        const mockPrismaService = {
            user: {
                findFirst: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
            },
        };
        const mockJwtService = {
            sign: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        prismaService = module.get(prisma_service_1.PrismaService);
        jwtService = module.get(jwt_1.JwtService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerDto = {
                username: 'newuser',
                email: 'new@example.com',
                password: 'password123',
            };
            prismaService.user.findFirst
                .mockResolvedValue(null);
            jest
                .mocked(prismaService.user.create)
                .mockResolvedValue(mockUser);
            jest
                .mocked(bcrypt.hash)
                .mockResolvedValue('hashedpassword');
            const result = await service.register(registerDto.username, registerDto.email, registerDto.password);
            expect(result).toEqual({ message: 'Usuário registrado com sucesso' });
            expect(prismaService.user.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { username: registerDto.username },
                        { email: registerDto.email },
                    ],
                },
            });
            expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    username: registerDto.username,
                    email: registerDto.email,
                    password: 'hashedpassword',
                },
            });
        });
        it('should throw UserAlreadyExistsException when username already exists', async () => {
            const registerDto = {
                username: 'existinguser',
                email: 'new@example.com',
                password: 'password123',
            };
            prismaService.user.findFirst
                .mockResolvedValue(mockUser);
            await expect(service.register(registerDto.username, registerDto.email, registerDto.password)).rejects.toThrow(custom_exceptions_1.UserAlreadyExistsException);
        });
        it('should throw UserAlreadyExistsException when email already exists', async () => {
            const registerDto = {
                username: 'newuser',
                email: 'existing@example.com',
                password: 'password123',
            };
            prismaService.user.findFirst
                .mockResolvedValue(mockUser);
            await expect(service.register(registerDto.username, registerDto.email, registerDto.password)).rejects.toThrow(custom_exceptions_1.UserAlreadyExistsException);
        });
    });
    describe('login', () => {
        it('should login user successfully with valid credentials', async () => {
            const loginDto = {
                username: 'testuser',
                password: 'password123',
            };
            const expectedToken = 'jwt-token-123';
            jest
                .mocked(prismaService.user.findUnique)
                .mockResolvedValue(mockUser);
            jest
                .mocked(bcrypt.compare)
                .mockResolvedValue(true);
            jwtService.sign.mockReturnValue(expectedToken);
            const result = await service.login(loginDto.username, loginDto.password);
            expect(result).toEqual({
                access_token: expectedToken,
                user: {
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email,
                },
            });
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { username: loginDto.username },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
            expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id, username: mockUser.username }, { expiresIn: '12h' });
        });
        it('should throw InvalidCredentialsException when user not found', async () => {
            const loginDto = {
                username: 'nonexistent',
                password: 'password123',
            };
            jest
                .mocked(prismaService.user.findUnique)
                .mockResolvedValue(null);
            await expect(service.login(loginDto.username, loginDto.password)).rejects.toThrow(custom_exceptions_1.InvalidCredentialsException);
        });
        it('should throw InvalidCredentialsException when password is incorrect', async () => {
            const loginDto = {
                username: 'testuser',
                password: 'wrongpassword',
            };
            jest
                .mocked(prismaService.user.findUnique)
                .mockResolvedValue(mockUser);
            jest
                .mocked(bcrypt.compare)
                .mockResolvedValue(false);
            await expect(service.login(loginDto.username, loginDto.password)).rejects.toThrow(custom_exceptions_1.InvalidCredentialsException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map