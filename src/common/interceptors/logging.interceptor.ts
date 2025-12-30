// FILE: apps/user-service/src/common/interceptors/logging.interceptor.ts
// ============================================================================
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Global logging interceptor for RPC messages
 * Logs incoming requests and outgoing responses
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const rpcContext = context.switchToRpc();
    const pattern = rpcContext.getContext().args[1]?.pattern;
    const data = rpcContext.getData();

    const now = Date.now();
    this.logger.log(`📨 Incoming RPC: ${pattern}`);
    this.logger.debug(`Payload: ${JSON.stringify(data)}`);

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - now;
          this.logger.log(`✅ Response sent for ${pattern} (+${duration}ms)`);
          this.logger.debug(`Response: ${JSON.stringify(response)}`);
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `❌ Error in ${pattern} (+${duration}ms): ${error.message}`,
          );
        },
      }),
    );
  }
}
