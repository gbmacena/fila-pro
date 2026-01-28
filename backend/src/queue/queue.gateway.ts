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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const token = client.handshake.auth?.token;
      if (token) {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
        const payload: any = this.jwtService.verify(token);
        const userId = payload.sub;
        void client.join(userId);
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
      }
    } catch {
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
