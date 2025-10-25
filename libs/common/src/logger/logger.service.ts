// src/logger/logger.service.ts
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class AppLogger implements LoggerService {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger) {}

  log(message: string, context?: string) {
    this.logger.log(message, { context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  error(message: string, trance?: string, context?: string) {
    this.logger.error(`${message} ${trance || ''}`, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
