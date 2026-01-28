import { PrismaService } from '../prisma/prisma.service';
import { ITicketsService } from '../common/interfaces/services.interface';
export declare class TicketsService implements ITicketsService {
    private prisma;
    constructor(prisma: PrismaService);
    createTicket(userId: string): Promise<{
        status: import(".prisma/client").$Enums.Status;
        id: string;
        createdAt: Date;
        code: string;
        calledAt: Date | null;
        finishedAt: Date | null;
        userId: string;
    }>;
    getWaitingTickets(userId: string): Promise<{
        status: import(".prisma/client").$Enums.Status;
        id: string;
        createdAt: Date;
        code: string;
        calledAt: Date | null;
        finishedAt: Date | null;
        userId: string;
    }[]>;
}
