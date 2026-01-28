import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Nome de usuário único',
    example: 'joao_silva',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário',
    example: 'joao_silva',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'uuid-string' },
      username: { type: 'string', example: 'joao_silva' },
      email: { type: 'string', example: 'joao.silva@email.com' },
    },
  })
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Mensagem de confirmação do cadastro',
    example: 'Usuário registrado com sucesso',
  })
  message: string;
}
