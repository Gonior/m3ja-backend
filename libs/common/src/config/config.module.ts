import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.valdation';
import appConfig from './app.config';
import databaseConfig from './database.config';
import loggerConfig from './logger.config';
import secretConfig from './secret.config';
import { loadEnv } from './env-loader';
import r2Config from './r2.config';

loadEnv();
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
      load: [appConfig, databaseConfig, loggerConfig, secretConfig, r2Config],
      validationSchema: configValidationSchema,
    }),
  ],
  providers: [],
  exports: [NestConfigModule],
})
export class ConfigModule {}
