export interface IAuthService {
    register(username: string, email: string, password: string): Promise<{
        message: string;
    }>;
    login(username: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
    }>;
}
export interface ITicketsService {
    createTicket(userId: string): Promise<any>;
    getWaitingTickets(userId: string): Promise<any[]>;
}
export interface IQueueService {
    getQueueState(userId: string): Promise<any>;
    getPublicQueueState(userId: string): Promise<any>;
    getMyPosition(ticketCode: string, userId: string): Promise<any>;
    callNext(userId: string): Promise<any>;
    finish(userId: string): Promise<any>;
}
export interface IQueueGateway {
    emitQueueUpdate(userId: string): Promise<void>;
    emitPublicQueueUpdate(userId: string): Promise<void>;
}
