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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const app_constants_1 = require("../common/constants/app.constants");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let QueueService = class QueueService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQueueState(userId) {
        const tickets = await this.prisma.ticket.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
        const waiting = tickets.filter((t) => t.status === 'WAITING');
        const calling = tickets.find((t) => t.status === 'CALLING');
        const done = tickets.filter((t) => t.status === 'DONE');
        const averageTime = this.calculateAverageTime(done);
        const current = calling?.code || null;
        const next = waiting.slice(0, 20).map((t, index) => ({
            code: t.code,
            position: index + 1,
            estimatedWait: (index + 1) * averageTime,
        }));
        const total = waiting.length;
        const estimatedWait = total > 0 ? total * averageTime : 0;
        return {
            current,
            next,
            total,
            averageTime,
            estimatedWait,
        };
    }
    async callNext(userId) {
        const nextTicket = await this.prisma.ticket.findFirst({
            where: { status: 'WAITING', userId },
            orderBy: { createdAt: 'asc' },
        });
        if (!nextTicket) {
            throw new custom_exceptions_1.NoTicketsInQueueException();
        }
        const calling = await this.prisma.ticket.findFirst({
            where: { status: 'CALLING', userId },
        });
        if (calling) {
            await this.prisma.ticket.update({
                where: { id: calling.id },
                data: { status: 'DONE', finishedAt: new Date() },
            });
        }
        await this.prisma.ticket.update({
            where: { id: nextTicket.id },
            data: { status: 'CALLING', calledAt: new Date() },
        });
        return this.getQueueState(userId);
    }
    async finish(userId) {
        const calling = await this.prisma.ticket.findFirst({
            where: { status: 'CALLING', userId },
        });
        if (!calling) {
            throw new common_1.BadRequestException('Nenhum ticket em atendimento para finalizar');
        }
        await this.prisma.ticket.update({
            where: { id: calling.id },
            data: { status: 'DONE', finishedAt: new Date() },
        });
        return this.getQueueState(userId);
    }
    async getPublicQueueState(userId) {
        const tickets = await this.prisma.ticket.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
        const waiting = tickets.filter((t) => t.status === 'WAITING');
        const calling = tickets.find((t) => t.status === 'CALLING');
        const done = tickets.filter((t) => t.status === 'DONE');
        const averageTime = this.calculateAverageTime(done);
        const current = calling?.code || null;
        const next = waiting.slice(0, 5).map((t, index) => ({
            code: t.code,
            position: index + 1,
            estimatedWait: (index + 1) * averageTime,
        }));
        const total = waiting.length;
        const estimatedWait = total > 0 ? total * averageTime : 0;
        return {
            current,
            next,
            total,
            averageTime,
            estimatedWait,
        };
    }
    async getMyPosition(ticketCode, userId) {
        const ticket = await this.prisma.ticket.findFirst({
            where: {
                code: ticketCode,
                userId: userId,
            },
        });
        if (!ticket) {
            throw new custom_exceptions_1.TicketNotFoundException();
        }
        if (ticket.status === 'DONE') {
            return { message: 'Seu atendimento foi finalizado' };
        }
        if (ticket.status === 'CALLING') {
            return { message: 'Sua vez! Dirija-se ao balcão' };
        }
        const waitingTickets = await this.prisma.ticket.findMany({
            where: { status: 'WAITING', userId },
            orderBy: { createdAt: 'asc' },
        });
        const position = waitingTickets.findIndex((t) => t.code === ticketCode) + 1;
        const doneTickets = await this.prisma.ticket.findMany({
            where: { status: 'DONE', userId },
        });
        const averageTime = this.calculateAverageTime(doneTickets);
        const estimatedWait = position * averageTime;
        return {
            code: ticketCode,
            position,
            estimatedWait,
            status: ticket.status,
        };
    }
    calculateAverageTime(doneTickets) {
        if (doneTickets.length === 0)
            return app_constants_1.DEFAULT_AVERAGE_TIME;
        const totalTime = doneTickets.reduce((sum, ticket) => {
            if (ticket.calledAt && ticket.finishedAt) {
                return (sum +
                    (ticket.finishedAt.getTime() - ticket.calledAt.getTime()) / 60000);
            }
            return sum;
        }, 0);
        const averageTime = Math.round(totalTime / doneTickets.length);
        return Math.max(averageTime, 1);
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QueueService);
//# sourceMappingURL=queue.service.js.map