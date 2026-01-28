import { PrismaService } from '../prisma/prisma.service';
import { IQueueService } from '../common/interfaces/services.interface';
export declare class QueueService implements IQueueService {
    private prisma;
    constructor(prisma: PrismaService);
    getQueueState(userId: string): Promise<{
        current: string | null;
        next: {
            code: string;
            position: number;
            estimatedWait: number;
        }[];
        total: number;
        averageTime: number;
        estimatedWait: number;
    }>;
    callNext(userId: string): Promise<{
        current: string | null;
        next: {
            code: string;
            position: number;
            estimatedWait: number;
        }[];
        total: number;
        averageTime: number;
        estimatedWait: number;
    }>;
    finish(userId: string): Promise<{
        current: string | null;
        next: {
            code: string;
            position: number;
            estimatedWait: number;
        }[];
        total: number;
        averageTime: number;
        estimatedWait: number;
    }>;
    getPublicQueueState(userId: string): Promise<{
        current: string | null;
        next: {
            code: string;
            position: number;
            estimatedWait: number;
        }[];
        total: number;
        averageTime: number;
        estimatedWait: number;
    }>;
    getMyPosition(ticketCode: string, userId: string): Promise<{
        message: string;
        code?: undefined;
        position?: undefined;
        estimatedWait?: undefined;
        status?: undefined;
    } | {
        code: string;
        position: number;
        estimatedWait: number;
        status: "WAITING";
        message?: undefined;
    }>;
    private calculateAverageTime;
}
