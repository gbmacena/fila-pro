"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const queue_service_1 = require("./queue.service");
const prisma_service_1 = require("../prisma/prisma.service");
const app_constants_1 = require("../common/constants/app.constants");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
const common_1 = require("@nestjs/common");
describe('QueueService', () => {
    let service;
    let prismaService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                queue_service_1.QueueService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(queue_service_1.QueueService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getQueueState', () => {
        it('should return correct queue state', async () => {
            jest
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue(mockTickets);
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
            expect(result.averageTime).toBe(app_constants_1.DEFAULT_AVERAGE_TIME);
        });
        it('should return empty queue state', async () => {
            jest
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue([]);
            const result = await service.getQueueState(mockUserId);
            expect(result.current).toBeNull();
            expect(result.next).toHaveLength(0);
            expect(result.total).toBe(0);
            expect(result.averageTime).toBe(app_constants_1.DEFAULT_AVERAGE_TIME);
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
            jest
                .mocked(prismaService.ticket.update)
                .mockResolvedValue({});
            jest
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue([]);
            const result = await service.callNext(mockUserId);
            expect(prismaService.ticket.update).toHaveBeenCalledWith({
                where: { id: callingTicket.id },
                data: { status: 'DONE', finishedAt: expect.any(Date) },
            });
            expect(prismaService.ticket.update).toHaveBeenCalledWith({
                where: { id: nextTicket.id },
                data: { status: 'CALLING', calledAt: expect.any(Date) },
            });
        });
        it('should throw NoTicketsInQueueException when no waiting tickets', async () => {
            jest
                .mocked(prismaService.ticket.findFirst)
                .mockResolvedValue(null);
            await expect(service.callNext(mockUserId)).rejects.toThrow(custom_exceptions_1.NoTicketsInQueueException);
        });
        it('should call next ticket when no current calling ticket', async () => {
            const ticketsWithoutCalling = mockTickets.filter((t) => t.status !== 'CALLING');
            const nextTicket = ticketsWithoutCalling.find((t) => t.status === 'WAITING');
            prismaService.ticket.findFirst
                .mockResolvedValueOnce(nextTicket)
                .mockResolvedValueOnce(null);
            jest
                .mocked(prismaService.ticket.update)
                .mockResolvedValue({});
            jest
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue([]);
            await service.callNext(mockUserId);
            expect(prismaService.ticket.update).toHaveBeenCalledTimes(1);
            expect(prismaService.ticket.update).toHaveBeenCalledWith({
                where: { id: nextTicket.id },
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
            jest
                .mocked(prismaService.ticket.update)
                .mockResolvedValue({});
            jest
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue([]);
            const result = await service.finish(mockUserId);
            expect(prismaService.ticket.update).toHaveBeenCalledWith({
                where: { id: callingTicket.id },
                data: { status: 'DONE', finishedAt: expect.any(Date) },
            });
            expect(result).toBeDefined();
        });
        it('should throw BadRequestException when no calling ticket', async () => {
            jest
                .mocked(prismaService.ticket.findFirst)
                .mockResolvedValue(null);
            await expect(service.finish(mockUserId)).rejects.toThrow(common_1.BadRequestException);
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
            jest
                .mocked(prismaService.ticket.findFirst)
                .mockResolvedValue(null);
            await expect(service.getMyPosition('INVALID', mockUserId)).rejects.toThrow(custom_exceptions_1.TicketNotFoundException);
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
            jest
                .mocked(prismaService.ticket.findMany)
                .mockResolvedValue(mockTickets);
            const result = await service.getPublicQueueState(mockUserId);
            expect(result.current).toBe('A003');
            expect(result.next).toHaveLength(2);
            expect(result.total).toBe(2);
        });
    });
});
//# sourceMappingURL=queue.service.spec.js.map