"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tickets_service_1 = require("./tickets.service");
const prisma_service_1 = require("../prisma/prisma.service");
describe('TicketsService', () => {
    let service;
    let prismaService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                tickets_service_1.TicketsService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(tickets_service_1.TicketsService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('createTicket', () => {
        it('should create first ticket with code A001', async () => {
            jest
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue([]);
            jest
                .mocked(prismaService.ticket.create)
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
            const existingTickets = [
                { code: 'A001' },
                { code: 'A002' },
                { code: 'A005' },
            ];
            jest
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue(existingTickets);
            jest
                .mocked(prismaService.ticket.create)
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
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue(existingTickets);
            jest
                .mocked(prismaService.ticket.create)
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
                .mocked(prismaService.ticket.findMany)
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
//# sourceMappingURL=tickets.service.spec.js.map