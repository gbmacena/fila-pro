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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
const queue_service_1 = require("../queue/queue.service");
const queue_gateway_1 = require("../queue/queue.gateway");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_id_decorator_1 = require("../common/decorators/user-id.decorator");
const ticket_dto_1 = require("./dto/ticket.dto");
const swagger_1 = require("@nestjs/swagger");
let TicketsController = class TicketsController {
    ticketsService;
    queueService;
    gateway;
    constructor(ticketsService, queueService, gateway) {
        this.ticketsService = ticketsService;
        this.queueService = queueService;
        this.gateway = gateway;
    }
    async create(userId) {
        const ticket = await this.ticketsService.createTicket(userId);
        const state = await this.queueService.getQueueState(userId);
        const waitingTickets = await this.ticketsService.getWaitingTickets(userId);
        const position = waitingTickets.findIndex((t) => t.id === ticket.id) + 1;
        const estimatedWait = position * state.averageTime;
        await this.gateway.emitQueueUpdate(userId);
        await this.gateway.emitPublicQueueUpdate(userId);
        return {
            code: ticket.code,
            position,
            estimatedWait,
        };
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova senha/ticket na fila' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Ticket criado com sucesso',
        type: ticket_dto_1.CreateTicketResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "create", null);
exports.TicketsController = TicketsController = __decorate([
    (0, swagger_1.ApiTags)('tickets'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService,
        queue_service_1.QueueService,
        queue_gateway_1.QueueGateway])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map