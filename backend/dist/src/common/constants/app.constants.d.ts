export declare const JWT_SECRET: string;
export declare const JWT_EXPIRES_IN = "12h";
export declare const TICKET_CODE_PREFIX = "A";
export declare const TICKET_CODE_LENGTH = 3;
export declare const DEFAULT_AVERAGE_TIME = 3;
export declare enum TicketStatus {
    WAITING = "WAITING",
    CALLING = "CALLING",
    DONE = "DONE"
}
export declare enum QueueEvents {
    QUEUE_UPDATE = "queueUpdate",
    PUBLIC_QUEUE_UPDATE = "publicQueueUpdate"
}
