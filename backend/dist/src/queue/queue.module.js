"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const queue_service_1 = require("./queue.service");
const queue_controller_1 = require("./queue.controller");
const queue_gateway_1 = require("./queue.gateway");
const prisma_module_1 = require("../prisma/prisma.module");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'secret',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        providers: [queue_service_1.QueueService, queue_gateway_1.QueueGateway],
        controllers: [queue_controller_1.QueueController],
        exports: [queue_gateway_1.QueueGateway, queue_service_1.QueueService],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map