import { ApiProperty } from '@nestjs/swagger';

export class QueueStateDto {
  @ApiProperty({
    description: 'Código da senha sendo atendida atualmente',
    example: 'A001',
    nullable: true,
  })
  current: string | null;

  @ApiProperty({
    description: 'Próximas senhas na fila',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'A002' },
        position: { type: 'number', example: 1 },
        estimatedWait: { type: 'number', example: 5 },
      },
    },
  })
  next: Array<{
    code: string;
    position: number;
    estimatedWait: number;
  }>;

  @ApiProperty({
    description: 'Total de pessoas na fila',
    example: 15,
  })
  total: number;

  @ApiProperty({
    description: 'Tempo médio de atendimento em minutos',
    example: 8,
  })
  averageTime: number;

  @ApiProperty({
    description: 'Tempo estimado total de espera em minutos',
    example: 40,
  })
  estimatedWait: number;
}

export class PublicQueueStateDto {
  @ApiProperty({
    description: 'Código da senha sendo atendida atualmente',
    example: 'A001',
    nullable: true,
  })
  current: string | null;

  @ApiProperty({
    description: 'Próximas senhas na fila (visão pública)',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'A002' },
        position: { type: 'number', example: 1 },
        estimatedWait: { type: 'number', example: 5 },
      },
    },
  })
  next: Array<{
    code: string;
    position: number;
    estimatedWait: number;
  }>;

  @ApiProperty({
    description: 'Total de pessoas na fila',
    example: 15,
  })
  total: number;

  @ApiProperty({
    description: 'Tempo médio de atendimento em minutos',
    example: 8,
  })
  averageTime: number;

  @ApiProperty({
    description: 'Tempo estimado total de espera em minutos',
    example: 40,
  })
  estimatedWait: number;
}
