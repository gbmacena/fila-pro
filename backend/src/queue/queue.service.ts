import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IQueueService } from '../common/interfaces/services.interface';
import { DEFAULT_AVERAGE_TIME } from '../common/constants/app.constants';
import {
  NoTicketsInQueueException,
  TicketNotFoundException,
} from '../common/exceptions/custom.exceptions';

@Injectable()
export class QueueService implements IQueueService {
  constructor(private prisma: PrismaService) {}

  async getQueueState(userId: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const waiting = tickets.filter((t) => t.status === 'WAITING');
    const calling = tickets.find((t) => t.status === 'CALLING');
    const done = tickets.filter((t) => t.status === 'DONE');

    const averageTime = this.calculateAverageTime(done);

    const current = calling?.code || null;
    const next = waiting.slice(0, 20).map((t, index) => ({
      code: t.code,
      position: index + 1,
      estimatedWait: (index + 1) * averageTime,
    }));
    const total = waiting.length;
    const estimatedWait = total > 0 ? total * averageTime : 0;

    return {
      current,
      next,
      total,
      averageTime,
      estimatedWait,
    };
  }

  async callNext(userId: string) {
    const nextTicket = await this.prisma.ticket.findFirst({
      where: { status: 'WAITING', userId },
      orderBy: { createdAt: 'asc' },
    });

    if (!nextTicket) {
      throw new NoTicketsInQueueException();
    }

    const calling = await this.prisma.ticket.findFirst({
      where: { status: 'CALLING', userId },
    });

    if (calling) {
      await this.prisma.ticket.update({
        where: { id: calling.id },
        data: { status: 'DONE', finishedAt: new Date() },
      });
    }

    await this.prisma.ticket.update({
      where: { id: nextTicket.id },
      data: { status: 'CALLING', calledAt: new Date() },
    });

    return this.getQueueState(userId);
  }

  async finish(userId: string) {
    const calling = await this.prisma.ticket.findFirst({
      where: { status: 'CALLING', userId },
    });

    if (!calling) {
      throw new BadRequestException(
        'Nenhum ticket em atendimento para finalizar',
      );
    }

    await this.prisma.ticket.update({
      where: { id: calling.id },
      data: { status: 'DONE', finishedAt: new Date() },
    });

    return this.getQueueState(userId);
  }

  async getPublicQueueState(userId: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const waiting = tickets.filter((t) => t.status === 'WAITING');
    const calling = tickets.find((t) => t.status === 'CALLING');
    const done = tickets.filter((t) => t.status === 'DONE');

    const averageTime = this.calculateAverageTime(done);

    const current = calling?.code || null;
    const next = waiting.slice(0, 5).map((t, index) => ({
      code: t.code,
      position: index + 1,
      estimatedWait: (index + 1) * averageTime,
    }));
    const total = waiting.length;
    const estimatedWait = total > 0 ? total * averageTime : 0;

    return {
      current,
      next,
      total,
      averageTime,
      estimatedWait,
    };
  }

  async getMyPosition(ticketCode: string, userId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        code: ticketCode,
        userId: userId,
      },
    });

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    if (ticket.status === 'DONE') {
      return { message: 'Seu atendimento foi finalizado' };
    }

    if (ticket.status === 'CALLING') {
      return { message: 'Sua vez! Dirija-se ao balcão' };
    }

    const waitingTickets = await this.prisma.ticket.findMany({
      where: { status: 'WAITING', userId },
      orderBy: { createdAt: 'asc' },
    });

    const position = waitingTickets.findIndex((t) => t.code === ticketCode) + 1;

    const doneTickets = await this.prisma.ticket.findMany({
      where: { status: 'DONE', userId },
    });

    const averageTime = this.calculateAverageTime(doneTickets);
    const estimatedWait = position * averageTime;

    return {
      code: ticketCode,
      position,
      estimatedWait,
      status: ticket.status,
    };
  }

  private calculateAverageTime(
    doneTickets: { calledAt: Date | null; finishedAt: Date | null }[],
  ): number {
    if (doneTickets.length === 0) return DEFAULT_AVERAGE_TIME;

    const totalTime = doneTickets.reduce((sum, ticket) => {
      if (ticket.calledAt && ticket.finishedAt) {
        return (
          sum +
          (ticket.finishedAt.getTime() - ticket.calledAt.getTime()) / 60000
        );
      }
      return sum;
    }, 0);

    const averageTime = Math.round(totalTime / doneTickets.length);
    return Math.max(averageTime, 1);
  }
}
