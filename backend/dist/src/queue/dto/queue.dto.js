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
exports.PublicQueueStateDto = exports.QueueStateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class QueueStateDto {
    current;
    next;
    total;
    averageTime;
    estimatedWait;
}
exports.QueueStateDto = QueueStateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código da senha sendo atendida atualmente',
        example: 'A001',
        nullable: true,
    }),
    __metadata("design:type", Object)
], QueueStateDto.prototype, "current", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Próximas senhas na fila',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: { type: 'string', example: 'A002' },
                position: { type: 'number', example: 1 },
                estimatedWait: { type: 'number', example: 5 },
            },
        },
    }),
    __metadata("design:type", Array)
], QueueStateDto.prototype, "next", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total de pessoas na fila',
        example: 15,
    }),
    __metadata("design:type", Number)
], QueueStateDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tempo médio de atendimento em minutos',
        example: 8,
    }),
    __metadata("design:type", Number)
], QueueStateDto.prototype, "averageTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tempo estimado total de espera em minutos',
        example: 40,
    }),
    __metadata("design:type", Number)
], QueueStateDto.prototype, "estimatedWait", void 0);
class PublicQueueStateDto {
    current;
    next;
    total;
    averageTime;
    estimatedWait;
}
exports.PublicQueueStateDto = PublicQueueStateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código da senha sendo atendida atualmente',
        example: 'A001',
        nullable: true,
    }),
    __metadata("design:type", Object)
], PublicQueueStateDto.prototype, "current", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Próximas senhas na fila (visão pública)',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                code: { type: 'string', example: 'A002' },
                position: { type: 'number', example: 1 },
                estimatedWait: { type: 'number', example: 5 },
            },
        },
    }),
    __metadata("design:type", Array)
], PublicQueueStateDto.prototype, "next", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total de pessoas na fila',
        example: 15,
    }),
    __metadata("design:type", Number)
], PublicQueueStateDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tempo médio de atendimento em minutos',
        example: 8,
    }),
    __metadata("design:type", Number)
], PublicQueueStateDto.prototype, "averageTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tempo estimado total de espera em minutos',
        example: 40,
    }),
    __metadata("design:type", Number)
], PublicQueueStateDto.prototype, "estimatedWait", void 0);
//# sourceMappingURL=queue.dto.js.map