import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';
import { TICKET_CODE_PREFIX } from '../common/constants/app.constants';

describe('TicketsService', () => {
  let service: TicketsService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUserId = 'user-123';

  const mockTicket = {
    id: 'ticket-123',
    code: 'A001',
    userId: mockUserId,
    status: 'WAITING',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      ticket: {
        findMany: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create first ticket with code A001', async () => {
      jest
        .mocked(prismaService.ticket.findMany) // @ts-ignore
        .mockResolvedValue([]);
      jest
        .mocked(prismaService.ticket.create) // @ts-ignore
        .mockResolvedValue(mockTicket);

      const result = await service.createTicket(mockUserId);

      expect(result).toEqual(mockTicket);
      expect(prismaService.ticket.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        select: { code: true },
      });
      expect(prismaService.ticket.create).toHaveBeenCalledWith({
        data: {
          code: 'A001',
          userId: mockUserId,
        },
      });
    });

    it('should create ticket with next sequential code', async () => {
      // Arrange
      const existingTickets = [
        { code: 'A001' },
        { code: 'A002' },
        { code: 'A005' },
      ];
      jest
        .mocked(prismaService.ticket.findMany) // @ts-ignore
        .mockResolvedValue(existingTickets);
      jest
        .mocked(prismaService.ticket.create) // @ts-ignore
        .mockResolvedValue({
          ...mockTicket,
          code: 'A006',
        });

      const result = await service.createTicket(mockUserId);

      expect(result.code).toBe('A006');
      expect(prismaService.ticket.create).toHaveBeenCalledWith({
        data: {
          code: 'A006',
          userId: mockUserId,
        },
      });
    });

    it('should handle tickets with non-numeric codes', async () => {
      const existingTickets = [
        { code: 'A001' },
        { code: 'INVALID' },
        { code: 'A003' },
      ];
      jest
        .mocked(prismaService.ticket.findMany) // @ts-ignore
        .mockResolvedValue(existingTickets);
      jest
        .mocked(prismaService.ticket.create) // @ts-ignore
        .mockResolvedValue({
          ...mockTicket,
          code: 'A004',
        });

      const result = await service.createTicket(mockUserId);

      expect(result.code).toBe('A004');
    });
  });

  describe('getWaitingTickets', () => {
    it('should return only waiting tickets', async () => {
      const tickets = [{ ...mockTicket, status: 'WAITING' }];
      jest
        .mocked(prismaService.ticket.findMany) // @ts-ignore
        .mockResolvedValue(tickets);

      const result = await service.getWaitingTickets(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('WAITING');
      expect(prismaService.ticket.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          status: 'WAITING',
        },
        orderBy: { createdAt: 'asc' },
      });
    });
  });
});
