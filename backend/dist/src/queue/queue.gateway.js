"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const queue_service_1 = require("./queue.service");
const app_constants_1 = require("../common/constants/app.constants");
let QueueGateway = class QueueGateway {
    queueService;
    jwtService;
    server;
    constructor(queueService, jwtService) {
        this.queueService = queueService;
        this.jwtService = jwtService;
    }
    handleConnection(client) {
        try {
            const token = client.handshake.auth?.token;
            if (token) {
                const payload = this.jwtService.verify(token);
                const userId = payload.sub;
                void client.join(userId);
            }
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect() { }
    async emitQueueUpdate(userId) {
        const state = await this.queueService.getQueueState(userId);
        this.server.to(userId).emit(app_constants_1.QueueEvents.QUEUE_UPDATE, state);
    }
    async emitPublicQueueUpdate(userId) {
        const state = await this.queueService.getPublicQueueState(userId);
        this.server.to(userId).emit(app_constants_1.QueueEvents.PUBLIC_QUEUE_UPDATE, state);
    }
};
exports.QueueGateway = QueueGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], QueueGateway.prototype, "server", void 0);
exports.QueueGateway = QueueGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['*'] },
    }),
    __metadata("design:paramtypes", [queue_service_1.QueueService,
        jwt_1.JwtService])
], QueueGateway);
//# sourceMappingURL=queue.gateway.js.map