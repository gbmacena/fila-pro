import { Controller, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { QueueService } from '../queue/queue.service';
import { QueueGateway } from '../queue/queue.gateway';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { CreateTicketResponseDto } from './dto/ticket.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('tickets')
@ApiBearerAuth('JWT-auth')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly queueService: QueueService,
    private readonly gateway: QueueGateway,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar nova senha/ticket na fila' })
  @ApiResponse({
    status: 201,
    description: 'Ticket criado com sucesso',
    type: CreateTicketResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@UserId() userId: string) {
    const ticket = await this.ticketsService.createTicket(userId);
    const state = await this.queueService.getQueueState(userId);
    const waitingTickets = await this.ticketsService.getWaitingTickets(userId);
    const position = waitingTickets.findIndex((t) => t.id === ticket.id) + 1;
    const estimatedWait = position * state.averageTime;

    await this.gateway.emitQueueUpdate(userId);
    await this.gateway.emitPublicQueueUpdate(userId);

    return {
      code: ticket.code,
      position,
      estimatedWait,
    };
  }
}
