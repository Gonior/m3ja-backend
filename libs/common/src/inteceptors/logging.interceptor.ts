import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../logger/logger.service';
import chalk from 'chalk';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;

    const now = Date.now();

    this.logger.log(`➡️ ${method} ${url}`, 'HTTP');

    return next
      .handle()
      .pipe(tap(() => this.logger.log(`☑️ ${method} ${url} (${Date.now() - now}ms)`, 'HTTP')));
  }
}
