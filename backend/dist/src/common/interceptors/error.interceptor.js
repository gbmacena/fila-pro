"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const api_response_dto_1 = require("../dto/api-response.dto");
let ErrorInterceptor = class ErrorInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            let statusCode = 500;
            let message = 'Internal server error';
            if (error instanceof common_1.BadRequestException) {
                statusCode = 400;
                message = error.message || 'Bad request';
            }
            else if (error instanceof common_1.UnauthorizedException) {
                statusCode = 401;
                message = error.message || 'Unauthorized';
            }
            else if (error instanceof common_1.ForbiddenException) {
                statusCode = 403;
                message = error.message || 'Forbidden';
            }
            else if (error instanceof common_1.NotFoundException) {
                statusCode = 404;
                message = error.message || 'Not found';
            }
            else if (error instanceof common_1.ConflictException) {
                statusCode = 409;
                message = error.message || 'Conflict';
            }
            else if (error instanceof common_1.InternalServerErrorException) {
                statusCode = 500;
                message = error.message || 'Internal server error';
            }
            else if (error instanceof common_1.HttpException) {
                statusCode = error.getStatus();
                message = error.message;
            }
            else if (error && typeof error === 'object' && 'response' in error) {
                const httpError = error;
                statusCode = httpError.status || 500;
                message =
                    httpError.response?.message ||
                        httpError.message ||
                        'Internal server error';
            }
            const response = context.switchToHttp().getResponse();
            response.status(statusCode);
            return (0, rxjs_1.throwError)(() => api_response_dto_1.ApiResponse.error(message));
        }));
    }
};
exports.ErrorInterceptor = ErrorInterceptor;
exports.ErrorInterceptor = ErrorInterceptor = __decorate([
    (0, common_1.Injectable)()
], ErrorInterceptor);
//# sourceMappingURL=error.interceptor.js.map