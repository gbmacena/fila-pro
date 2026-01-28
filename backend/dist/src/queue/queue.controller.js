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
exports.QueueController = void 0;
const common_1 = require("@nestjs/common");
const queue_service_1 = require("./queue.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_id_decorator_1 = require("../common/decorators/user-id.decorator");
const queue_gateway_1 = require("./queue.gateway");
const queue_dto_1 = require("./dto/queue.dto");
const ticket_dto_1 = require("../tickets/dto/ticket.dto");
const swagger_1 = require("@nestjs/swagger");
let QueueController = class QueueController {
    queueService;
    gateway;
    constructor(queueService, gateway) {
        this.queueService = queueService;
        this.gateway = gateway;
    }
    async getState(userId) {
        return this.queueService.getQueueState(userId);
    }
    async getPublicState(userId) {
        return this.queueService.getPublicQueueState(userId);
    }
    async getMyPosition(ticketCode, userId) {
        return this.queueService.getMyPosition(ticketCode, userId);
    }
    async callNext(userId) {
        const result = await this.queueService.callNext(userId);
        await this.gateway.emitQueueUpdate(userId);
        await this.gateway.emitPublicQueueUpdate(userId);
        return result;
    }
    async finish(userId) {
        const result = await this.queueService.finish(userId);
        await this.gateway.emitQueueUpdate(userId);
        await this.gateway.emitPublicQueueUpdate(userId);
        return result;
    }
};
exports.QueueController = QueueController;
__decorate([
    (0, common_1.Get)('state'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estado completo da fila (atendente)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estado da fila retornado com sucesso',
        type: queue_dto_1.QueueStateDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getState", null);
__decorate([
    (0, common_1.Get)('public-state/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estado público da fila' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID do estabelecimento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estado público da fila retornado com sucesso',
        type: queue_dto_1.PublicQueueStateDto,
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getPublicState", null);
__decorate([
    (0, common_1.Get)('my-position/:ticketCode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar posição de uma senha na fila' }),
    (0, swagger_1.ApiParam)({ name: 'ticketCode', description: 'Código da senha' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Posição da senha retornada com sucesso',
        type: ticket_dto_1.TicketPositionDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Senha não encontrada' }),
    __param(0, (0, common_1.Param)('ticketCode')),
    __param(1, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getMyPosition", null);
__decorate([
    (0, common_1.Post)('call-next'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Chamar próxima senha da fila' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Próxima senha chamada com sucesso',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "callNext", null);
__decorate([
    (0, common_1.Post)('finish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "finish", null);
exports.QueueController = QueueController = __decorate([
    (0, swagger_1.ApiTags)('queue'),
    (0, common_1.Controller)('queue'),
    __metadata("design:paramtypes", [queue_service_1.QueueService,
        queue_gateway_1.QueueGateway])
], QueueController);
//# sourceMappingURL=queue.controller.js.map