import { TicketsService } from './tickets.service';
import { QueueService } from '../queue/queue.service';
import { QueueGateway } from '../queue/queue.gateway';
export declare class TicketsController {
    private readonly ticketsService;
    private readonly queueService;
    private readonly gateway;
    constructor(ticketsService: TicketsService, queueService: QueueService, gateway: QueueGateway);
    create(userId: string): Promise<{
        code: string;
        position: number;
        estimatedWait: number;
    }>;
}
