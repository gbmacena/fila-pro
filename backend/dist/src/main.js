"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const swagger_1 = require("@nestjs/swagger");
const winston = __importStar(require("winston"));
async function bootstrap() {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
        defaultMeta: { service: 'filapro-backend' },
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
            }),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: {
            log: (message, context) => logger.info(message, { context }),
            error: (message, trace, context) => logger.error(message, { trace, context }),
            warn: (message, context) => logger.warn(message, { context }),
            debug: (message, context) => logger.debug(message, { context }),
            verbose: (message, context) => logger.verbose(message, { context }),
        },
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FilaPro API')
        .setDescription('API para gerenciamento de filas de atendimento em tempo real')
        .setVersion('1.0')
        .addTag('auth', 'Endpoints de autenticação')
        .addTag('tickets', 'Gerenciamento de tickets/senhas')
        .addTag('queue', 'Estado e controle da fila')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`);
}
void bootstrap();
//# sourceMappingURL=main.js.map