import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        let statusCode = 500;
        let message = 'Erro interno do servidor';

        if (error instanceof BadRequestException) {
          statusCode = 400;
          message = error.message || 'Requisição inválida';
        } else if (error instanceof UnauthorizedException) {
          statusCode = 401;
          message = error.message || 'Não autorizado';
        } else if (error instanceof ForbiddenException) {
          statusCode = 403;
          message = error.message || 'Acesso proibido';
        } else if (error instanceof NotFoundException) {
          statusCode = 404;
          message = error.message || 'Não encontrado';
        } else if (error instanceof ConflictException) {
          statusCode = 409;
          message = error.message || 'Conflito';
        } else if (error instanceof InternalServerErrorException) {
          statusCode = 500;
          message = error.message || 'Erro interno do servidor';
        } else if (error instanceof HttpException) {
          statusCode = error.getStatus();
          message = error.message;
          const response = context.switchToHttp().getResponse<Response>();
          response.status(statusCode).json({
            statusCode,
            message,
          });
          return throwError(() => error);
        } else if (error && typeof error === 'object' && 'response' in error) {
          const httpError = error as {
            status?: number;
            response?: { message?: string };
            message?: string;
          };
          statusCode = httpError.status || 500;
          message =
            httpError.response?.message ||
            httpError.message ||
            'Internal server error';
        }

        const response = context.switchToHttp().getResponse<Response>();
        response.status(statusCode);

        return throwError(() => ApiResponse.error(message));
      }),
    );
  }
}
