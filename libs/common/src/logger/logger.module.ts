// src/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import chalk from 'chalk';
import { AppLogger } from './logger.service';

import { EnvService } from '../config/env.config.service';
import { ClsServiceManager } from 'nestjs-cls';

// 🎨 Warna level log
function colorizeLevel(level: string) {
  switch (level) {
    case 'error':
      return chalk.redBright.bold(`[${level.toUpperCase()}]`);
    case 'warn':
      return chalk.yellowBright.bold(`[${level.toUpperCase()}]`);
    case 'info':
      return chalk.greenBright.bold(`[${level.toUpperCase()}]`);
    case 'debug':
      return chalk.gray(`[${level.toUpperCase()}]`);
    default:
      return chalk.white(`[${level.toUpperCase()}]`);
  }
}

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        level: env.loggerConfig.level || 'debug',
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              winston.format.printf((info) => {
                const cls = ClsServiceManager.getClsService();
                const requestId = cls?.get('requestId');
                const userId = cls?.get('userId');
                const hasContext = 'context' in info && typeof info.context !== 'undefined';
                const context = hasContext ? (info.context as any) : null;

                let ctx = '';
                let rid = requestId ? chalk.cyan(`[reqId:${requestId}]`) : '';
                let uid = userId ? chalk.cyanBright(`[userId:${userId}]`) : '';

                if (context && typeof context === 'object' && 'context' in context) {
                  ctx = context.context
                    ? chalk.magenta(`[${context.context}]`)
                    : chalk.magenta(`[APP]`);
                }

                const level = colorizeLevel(`${info.level}`);
                const time = chalk.gray(`[${info.timestamp}]`);

                return `${time} ${level} ${ctx}${rid}${uid} ${info.message}`;
              }),
            ),
          }),
        ],
      }),
    }),
  ],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
