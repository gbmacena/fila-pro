import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { IAuthService } from '../common/interfaces/services.interface';
import { InvalidCredentialsException } from '../common/exceptions/custom.exceptions';
import { UserAlreadyExistsException } from '../common/exceptions/custom.exceptions';
import { JWT_EXPIRES_IN } from '../common/constants/app.constants';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    user: { id: string; username: string; email: string };
  }> {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      const payload = { username: user.username, sub: user.id };

      const access_token = this.jwtService.sign(payload, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return {
        access_token,
        user: { id: user.id, username: user.username, email: user.email },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UserAlreadyExistsException();
      }
      throw error;
    }
  }

  async login(
    username: string,
    password: string,
  ): Promise<{
    access_token: string;
    user: { id: string; username: string; email: string };
  }> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: JWT_EXPIRES_IN,
      }),
      user: { id: user.id, username: user.username, email: user.email },
    };
  }
}
