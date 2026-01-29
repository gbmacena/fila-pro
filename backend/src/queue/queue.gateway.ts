import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { QueueService } from './queue.service';
import { IQueueGateway } from '../common/interfaces/services.interface';
import { QueueEvents } from '../common/constants/app.constants';

interface JwtPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['*'] },
})
export class QueueGateway
  implements OnGatewayConnection, OnGatewayDisconnect, IQueueGateway
{
  @WebSocketServer()
  server: Server;

  constructor(
    private queueService: QueueService,
    private jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      const userId = client.handshake.auth?.userId as string | undefined;

      if (token) {
        try {
          const payload = this.jwtService.verify<JwtPayload>(token);
          const userIdFromToken = payload.sub;
          void client.join(userIdFromToken);
        } catch (error) {
          console.error('Invalid JWT token:', error);
          client.disconnect();
          return;
        }
      } else if (userId) {
        void client.join(userId);
        void this.emitPublicQueueUpdate(userId);
      } else {
        client.disconnect();
      }
    } catch (error) {
      console.error('WebSocket connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect() {}

  async emitQueueUpdate(userId: string) {
    const state = await this.queueService.getQueueState(userId);
    this.server.to(userId).emit(QueueEvents.QUEUE_UPDATE, state);
  }

  async emitPublicQueueUpdate(userId: string) {
    const state = await this.queueService.getPublicQueueState(userId);
    this.server.to(userId).emit(QueueEvents.PUBLIC_QUEUE_UPDATE, state);
  }
}
