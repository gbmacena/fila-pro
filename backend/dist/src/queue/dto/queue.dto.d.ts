export declare class QueueStateDto {
    current: string | null;
    next: Array<{
        code: string;
        position: number;
        estimatedWait: number;
    }>;
    total: number;
    averageTime: number;
    estimatedWait: number;
}
export declare class PublicQueueStateDto {
    current: string | null;
    next: Array<{
        code: string;
        position: number;
        estimatedWait: number;
    }>;
    total: number;
    averageTime: number;
    estimatedWait: number;
}
