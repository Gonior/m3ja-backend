import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '@app/common/logger/app.logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('HTTP');
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context.switchToHttp().getRequest();
    const now = Date.now();

    this.logger.log(`➡️  ${method} ${url}`);

    return next
      .handle()
      .pipe(tap(() => this.logger.log(`✅ ${method} ${url} (${Date.now() - now}ms)`)));
  }
}
