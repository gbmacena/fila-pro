import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'timestamp' in data &&
          typeof (data as Record<string, unknown>).success === 'boolean'
        ) {
          return data as unknown as ApiResponse<T>;
        }

        return ApiResponse.success<T>(data);
      }),
    );
  }
}
