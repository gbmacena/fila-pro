import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketResponseDto {
  @ApiProperty({
    description: 'Código único da senha gerada',
    example: 'A001',
  })
  code: string;

  @ApiProperty({
    description: 'Posição atual na fila',
    example: 3,
  })
  position: number;

  @ApiProperty({
    description: 'Tempo estimado de espera em minutos',
    example: 15,
  })
  estimatedWait: number;
}

export class TicketPositionDto {
  @ApiProperty({
    description: 'Mensagem informativa',
    example: 'Sua posição na fila foi atualizada',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Código da senha',
    example: 'A001',
    required: false,
  })
  code?: string;

  @ApiProperty({
    description: 'Posição atual na fila',
    example: 2,
    required: false,
  })
  position?: number;

  @ApiProperty({
    description: 'Tempo estimado de espera em minutos',
    example: 10,
    required: false,
  })
  estimatedWait?: number;

  @ApiProperty({
    description: 'Status da senha',
    example: 'waiting',
    enum: ['waiting', 'serving', 'completed'],
    required: false,
  })
  status?: string;
}
