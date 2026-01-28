import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  UserAlreadyExistsException,
  InvalidCredentialsException,
} from '../common/exceptions/custom.exceptions';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
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

      // @ts-ignore
      prismaService.user.findFirst // @ts-ignore
        .mockResolvedValue(null);
      jest
        .mocked(prismaService.user.create) // @ts-ignore
        .mockResolvedValue(mockUser);
      jest
        .mocked(bcrypt.hash) // @ts-ignore
        .mockResolvedValue('hashedpassword' as never);

      const result = await service.register(
        registerDto.username,
        registerDto.email,
        registerDto.password,
      );

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

      // @ts-ignore
      prismaService.user.findFirst // @ts-ignore
        .mockResolvedValue(mockUser);

      await expect(
        service.register(
          registerDto.username,
          registerDto.email,
          registerDto.password,
        ),
      ).rejects.toThrow(UserAlreadyExistsException);
    });

    it('should throw UserAlreadyExistsException when email already exists', async () => {
      const registerDto = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
      };

      prismaService.user.findFirst // @ts-ignore
        .mockResolvedValue(mockUser);

      await expect(
        service.register(
          registerDto.username,
          registerDto.email,
          registerDto.password,
        ),
      ).rejects.toThrow(UserAlreadyExistsException);
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
        .mocked(prismaService.user.findUnique) // @ts-ignore
        .mockResolvedValue(mockUser);
      jest
        .mocked(bcrypt.compare) // @ts-ignore
        .mockResolvedValue(true);
      jwtService.sign.mockReturnValue(expectedToken);

      // Act
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
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: mockUser.id, username: mockUser.username },
        { expiresIn: '12h' },
      );
    });

    it('should throw InvalidCredentialsException when user not found', async () => {
      const loginDto = {
        username: 'nonexistent',
        password: 'password123',
      };

      jest
        .mocked(prismaService.user.findUnique) // @ts-ignore
        .mockResolvedValue(null);

      await expect(
        service.login(loginDto.username, loginDto.password),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw InvalidCredentialsException when password is incorrect', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      jest
        .mocked(prismaService.user.findUnique) // @ts-ignore
        .mockResolvedValue(mockUser);
      jest
        .mocked(bcrypt.compare) // @ts-ignore
        .mockResolvedValue(false);

      await expect(
        service.login(loginDto.username, loginDto.password),
      ).rejects.toThrow(InvalidCredentialsException);
    });
  });
});
