import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  RegisterResponseDto,
} from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário/atendente' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Usuário já existe' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login no sistema' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.username, loginDto.password);
  }
}
