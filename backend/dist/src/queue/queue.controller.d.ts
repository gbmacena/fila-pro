import { QueueService } from './queue.service';
import { QueueGateway } from './queue.gateway';
export declare class QueueController {
    private readonly queueService;
    private readonly gateway;
    constructor(queueService: QueueService, gateway: QueueGateway);
    getState(userId: string): Promise<{
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
    getPublicState(userId: string): Promise<{
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
}
