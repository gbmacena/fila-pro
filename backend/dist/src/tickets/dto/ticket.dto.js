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
exports.TicketPositionDto = exports.CreateTicketResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateTicketResponseDto {
    code;
    position;
    estimatedWait;
}
exports.CreateTicketResponseDto = CreateTicketResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código único da senha gerada',
        example: 'A001',
    }),
    __metadata("design:type", String)
], CreateTicketResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Posição atual na fila',
        example: 3,
    }),
    __metadata("design:type", Number)
], CreateTicketResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tempo estimado de espera em minutos',
        example: 15,
    }),
    __metadata("design:type", Number)
], CreateTicketResponseDto.prototype, "estimatedWait", void 0);
class TicketPositionDto {
    message;
    code;
    position;
    estimatedWait;
    status;
}
exports.TicketPositionDto = TicketPositionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensagem informativa',
        example: 'Sua posição na fila foi atualizada',
        required: false,
    }),
    __metadata("design:type", String)
], TicketPositionDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código da senha',
        example: 'A001',
        required: false,
    }),
    __metadata("design:type", String)
], TicketPositionDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Posição atual na fila',
        example: 2,
        required: false,
    }),
    __metadata("design:type", Number)
], TicketPositionDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tempo estimado de espera em minutos',
        example: 10,
        required: false,
    }),
    __metadata("design:type", Number)
], TicketPositionDto.prototype, "estimatedWait", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da senha',
        example: 'waiting',
        enum: ['waiting', 'serving', 'completed'],
        required: false,
    }),
    __metadata("design:type", String)
], TicketPositionDto.prototype, "status", void 0);
//# sourceMappingURL=ticket.dto.js.map