import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { QueueService } from './queue.service';
import { IQueueGateway } from '../common/interfaces/services.interface';
export declare class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect, IQueueGateway {
    private queueService;
    private jwtService;
    server: Server;
    constructor(queueService: QueueService, jwtService: JwtService);
    handleConnection(client: Socket): void;
    handleDisconnect(): void;
    emitQueueUpdate(userId: string): Promise<void>;
    emitPublicQueueUpdate(userId: string): Promise<void>;
}
