import { LoggerService, Injectable } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable()
export class AppLogger implements LoggerService {
  private context = 'App';
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}] [${this.context}] ${message}`;
        }),
      ),
      transports: [new transports.Console()],
    });
  }
  setContext(context: string) {
    // ganti context sesuai class pemakai
    this.context = context;
  }
  log(message: string) {
    this.logger.info(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} ${trace || ''}`);
  }
}
