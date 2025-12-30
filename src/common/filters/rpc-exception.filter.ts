// FILE: apps/user-service/src/common/filters/rpc-exception.filter.ts
import {
  Catch,
  RpcExceptionFilter as NestRpcExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
 * Global RPC exception filter
 * Catches all RPC exceptions and formats them consistently
 */
@Catch(RpcException)
export class RpcExceptionFilter implements NestRpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<unknown> {
    const error = exception.getError();
    this.logger.error('RPC Exception caught:', error);

    return throwError(() => ({
      status: 'error',
      message:
        typeof error === 'string'
          ? error
          : (error as { message?: string }).message || 'Unknown error',
      timestamp: new Date().toISOString(),
    }));
  }
}
