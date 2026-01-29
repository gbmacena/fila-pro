// @ts-nocheck

import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_AVERAGE_TIME } from '../common/constants/app.constants';
import {
  NoTicketsInQueueException,
  TicketNotFoundException,
} from '../common/exceptions/custom.exceptions';
import { BadRequestException } from '@nestjs/common';

describe('QueueService', () => {
  let service: QueueService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUserId = 'user-123';

  const mockTickets = [
    {
      id: 'ticket-1',
      code: 'A001',
      userId: mockUserId,
      status: 'WAITING',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      calledAt: null,
      finishedAt: null,
    },
    {
      id: 'ticket-2',
      code: 'A002',
      userId: mockUserId,
      status: 'WAITING',
      createdAt: new Date('2024-01-01T10:05:00Z'),
      calledAt: null,
      finishedAt: null,
    },
    {
      id: 'ticket-3',
      code: 'A003',
      userId: mockUserId,
      status: 'CALLING',
      createdAt: new Date('2024-01-01T09:55:00Z'),
      calledAt: new Date('2024-01-01T11:00:00Z'),
      finishedAt: null,
    },
    {
      id: 'ticket-4',
      code: 'A004',
      userId: mockUserId,
      status: 'DONE',
      createdAt: new Date('2024-01-01T09:00:00Z'),
      calledAt: new Date('2024-01-01T10:00:00Z'),
      finishedAt: new Date('2024-01-01T10:30:00Z'),
    },
  ];

  beforeEach(async () => {
    const mockPrismaService = {
      ticket: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQueueState', () => {
    it('should return correct queue state', async () => {
      jest.mocked(prismaService.ticket.findMany).mockResolvedValue(mockTickets);

      const result = await service.getQueueState(mockUserId);

      expect(result.current).toBe('A003');
      expect(result.next).toHaveLength(2);
      expect(result.next[0]).toEqual({
        code: 'A001',
        position: 1,
        estimatedWait: 30,
      });
      expect(result.total).toBe(2);
      expect(result.averageTime).toBe(30);
    });

    it('should return default average time when no completed tickets', async () => {
      const ticketsWithoutDone = mockTickets.filter((t) => t.status !== 'DONE');
      jest
        .mocked(prismaService.ticket.findMany)
        .mockResolvedValue(ticketsWithoutDone);

      const result = await service.getQueueState(mockUserId);

      expect(result.averageTime).toBe(DEFAULT_AVERAGE_TIME);
    });

    it('should return empty queue state', async () => {
      jest.mocked(prismaService.ticket.findMany).mockResolvedValue([]);

      const result = await service.getQueueState(mockUserId);

      expect(result.current).toBeNull();
      expect(result.next).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.averageTime).toBe(DEFAULT_AVERAGE_TIME);
      expect(result.estimatedWait).toBe(0);
    });
  });

  describe('callNext', () => {
    it('should call next ticket successfully', async () => {
      const nextTicket = mockTickets.find((t) => t.status === 'WAITING');
      const callingTicket = mockTickets.find((t) => t.status === 'CALLING');

      prismaService.ticket.findFirst

        .mockResolvedValueOnce(nextTicket)

        .mockResolvedValueOnce(callingTicket);

      jest.mocked(prismaService.ticket.update).mockResolvedValue({
        id: 'ticket-1',
        code: 'A001',
        status: 'CALLING',
        createdAt: new Date(),
        calledAt: new Date(),
        finishedAt: null,
        userId: mockUserId,
      });
      jest.mocked(prismaService.ticket.findMany).mockResolvedValue([]);

      await service.callNext(mockUserId);

      expect(prismaService.ticket.update).toHaveBeenCalledWith({
        where: { id: callingTicket!.id },
        data: { status: 'DONE', finishedAt: expect.any(Date) },
      });
      expect(prismaService.ticket.update).toHaveBeenCalledWith({
        where: { id: nextTicket!.id },
        data: { status: 'CALLING', calledAt: expect.any(Date) },
      });
    });

    it('should throw NoTicketsInQueueException when no waiting tickets', async () => {
      jest.mocked(prismaService.ticket.findFirst).mockResolvedValue(null);

      await expect(service.callNext(mockUserId)).rejects.toThrow(
        NoTicketsInQueueException,
      );
    });

    it('should call next ticket when no current calling ticket', async () => {
      const ticketsWithoutCalling = mockTickets.filter(
        (t) => t.status !== 'CALLING',
      );
      const nextTicket = ticketsWithoutCalling.find(
        (t) => t.status === 'WAITING',
      );

      prismaService.ticket.findFirst

        .mockResolvedValueOnce(nextTicket)

        .mockResolvedValueOnce(null);

      jest.mocked(prismaService.ticket.update).mockResolvedValue({
        id: 'ticket-2',
        code: 'A002',
        status: 'CALLING',
        createdAt: new Date(),
        calledAt: new Date(),
        finishedAt: null,
        userId: mockUserId,
      });
      jest.mocked(prismaService.ticket.findMany).mockResolvedValue([]);

      await service.callNext(mockUserId);

      expect(prismaService.ticket.update).toHaveBeenCalledTimes(1);
      expect(prismaService.ticket.update).toHaveBeenCalledWith({
        where: { id: nextTicket!.id },
        data: { status: 'CALLING', calledAt: expect.any(Date) },
      });
    });
  });

  describe('finish', () => {
    it('should finish current calling ticket', async () => {
      const callingTicket = mockTickets.find((t) => t.status === 'CALLING');
      jest
        .mocked(prismaService.ticket.findFirst)
        .mockResolvedValue(callingTicket);
      jest.mocked(prismaService.ticket.update).mockResolvedValue({
        id: callingTicket!.id,
        code: callingTicket!.code,
        status: 'DONE',
        createdAt: callingTicket!.createdAt,
        calledAt: callingTicket!.calledAt,
        finishedAt: new Date(),
        userId: mockUserId,
      });
      jest.mocked(prismaService.ticket.findMany).mockResolvedValue([]);

      const result = await service.finish(mockUserId);

      expect(prismaService.ticket.update).toHaveBeenCalledWith({
        where: { id: callingTicket!.id },
        data: { status: 'DONE', finishedAt: expect.any(Date) },
      });
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when no calling ticket', async () => {
      jest.mocked(prismaService.ticket.findFirst).mockResolvedValue(null);

      await expect(service.finish(mockUserId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getMyPosition', () => {
    it('should return ticket position correctly', async () => {
      const ticketCode = 'A001';
      const ticket = mockTickets.find((t) => t.code === ticketCode);
      const waitingTickets = mockTickets.filter((t) => t.status === 'WAITING');

      const doneTickets = mockTickets.filter((t) => t.status === 'DONE');

      prismaService.ticket.findFirst

        .mockResolvedValueOnce(ticket)

        .mockResolvedValueOnce(null);

      prismaService.ticket.findMany

        .mockResolvedValueOnce(waitingTickets)
        .mockResolvedValueOnce(doneTickets);

      const result = await service.getMyPosition(ticketCode, mockUserId);

      expect(result).toEqual({
        code: ticketCode,
        position: 1,
        estimatedWait: 30,
        status: 'WAITING',
      });
    });

    it('should throw TicketNotFoundException when ticket not found', async () => {
      jest.mocked(prismaService.ticket.findFirst).mockResolvedValue(null);

      await expect(
        service.getMyPosition('INVALID', mockUserId),
      ).rejects.toThrow(TicketNotFoundException);
    });

    it('should return position for calling ticket', async () => {
      const ticketCode = 'A003';
      const ticket = mockTickets.find((t) => t.code === ticketCode);

      prismaService.ticket.findFirst

        .mockResolvedValueOnce(ticket)

        .mockResolvedValueOnce(ticket);

      const result = await service.getMyPosition(ticketCode, mockUserId);

      expect(result).toEqual({
        message: 'Sua vez! Dirija-se ao balcão',
      });
    });
  });

  describe('getPublicQueueState', () => {
    it('should return public queue state', async () => {
      jest.mocked(prismaService.ticket.findMany).mockResolvedValue(mockTickets);

      const result = await service.getPublicQueueState(mockUserId);

      expect(result.current).toBe('A003');
      expect(result.next).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
