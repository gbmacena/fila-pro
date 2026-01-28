import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITicketsService } from '../common/interfaces/services.interface';
import {
  TICKET_CODE_PREFIX,
  TICKET_CODE_LENGTH,
} from '../common/constants/app.constants';

@Injectable()
export class TicketsService implements ITicketsService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string) {
    const allCodes = await this.prisma.ticket.findMany({
      where: { userId },
      select: { code: true },
    });

    let maxNum = 0;
    for (const ticket of allCodes) {
      const num = parseInt(ticket.code.slice(1));
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }

    let nextCode = `${TICKET_CODE_PREFIX}${(maxNum + 1)
      .toString()
      .padStart(TICKET_CODE_LENGTH, '0')}`;

    console.log('Tentando criar ticket com código:', nextCode);

    while (true) {
      try {
        const ticket = await this.prisma.ticket.create({
          data: {
            code: nextCode,
            userId,
          },
        });
        return ticket;
      } catch (e) {
        const error = e as { code: string; meta?: { target?: string[] } };
        if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
          const num = parseInt(nextCode.slice(1)) + 1;
          nextCode = `${TICKET_CODE_PREFIX}${num
            .toString()
            .padStart(TICKET_CODE_LENGTH, '0')}`;
        } else {
          throw e;
        }
      }
    }
  }

  async getWaitingTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { status: 'WAITING', userId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
