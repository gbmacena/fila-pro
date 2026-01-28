import { Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { QueueService } from './queue.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { QueueGateway } from './queue.gateway';
import { QueueStateDto, PublicQueueStateDto } from './dto/queue.dto';
import { TicketPositionDto } from '../tickets/dto/ticket.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('queue')
@Controller('queue')
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
    private readonly gateway: QueueGateway,
  ) {}

  @Get('state')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter estado completo da fila (atendente)' })
  @ApiResponse({
    status: 200,
    description: 'Estado da fila retornado com sucesso',
    type: QueueStateDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getState(@UserId() userId: string) {
    return this.queueService.getQueueState(userId);
  }

  @Get('public-state/:userId')
  @ApiOperation({ summary: 'Obter estado público da fila' })
  @ApiParam({ name: 'userId', description: 'ID do estabelecimento' })
  @ApiResponse({
    status: 200,
    description: 'Estado público da fila retornado com sucesso',
    type: PublicQueueStateDto,
  })
  async getPublicState(@Param('userId') userId: string) {
    return this.queueService.getPublicQueueState(userId);
  }

  @Get('my-position/:ticketCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consultar posição de uma senha na fila' })
  @ApiParam({ name: 'ticketCode', description: 'Código da senha' })
  @ApiResponse({
    status: 200,
    description: 'Posição da senha retornada com sucesso',
    type: TicketPositionDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Senha não encontrada' })
  async getMyPosition(
    @Param('ticketCode') ticketCode: string,
    @UserId() userId: string,
  ) {
    return this.queueService.getMyPosition(ticketCode, userId);
  }

  @Post('call-next')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Chamar próxima senha da fila' })
  @ApiResponse({
    status: 200,
    description: 'Próxima senha chamada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async callNext(@UserId() userId: string) {
    const result = await this.queueService.callNext(userId);
    await this.gateway.emitQueueUpdate(userId);
    await this.gateway.emitPublicQueueUpdate(userId);
    return result;
  }

  @Post('finish')
  @UseGuards(JwtAuthGuard)
  async finish(@UserId() userId: string) {
    const result = await this.queueService.finish(userId);
    await this.gateway.emitQueueUpdate(userId);
    await this.gateway.emitPublicQueueUpdate(userId);
    return result;
  }
}
