import { ConfigService } from '@nestjs/config';
import { type IEnv } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  constructor(private config: ConfigService<IEnv>) {}

  get appConfig() {
    return {
      env: this.config.get('NODE_ENV', { infer: true }),
      apiPort: this.config.get('API_PORT', { infer: true }),
      workerPort: this.config.get('WORKER_PORT', { infer: true }),
      name: this.config.get('APP_NAME', { infer: true }),
      host: this.config.get('HOST', { infer: true }),
    };
  }

  get isProduction() {
    return this.appConfig.env === 'production';
  }

  get dbConfig() {
    return {
      url: this.config.get('DB_URL', { infer: true }),
    };
  }

  get loggerConfig() {
    return {
      level: this.config.get('LOG_LEVELS'),
    };
  }

  get rabbitmqConfig() {
    return {
      url: this.config.get('RABBITMQ_URL'),
    };
  }

  get r2Config() {
    return {
      accountId: this.config.get('R2_ACCOUNT_ID'),
      accessKeyId: this.config.get('R2_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('R2_SECRET_ACCESS_KEY'),
      bucketName: this.config.get('R2_BUCKET_NAME'),
      tokenValue: this.config.get('R2_TOKEN_VALUE'),
      endpoint: this.config.get('R2_ENDPOINT'),
      publicUrl: this.config.get('R2_PUBLIC_URL'),
    };
  }

  get redisConfig() {
    return {
      url: this.config.get('REDIS_URL'),
    };
  }
  get secretConfig() {
    return {
      jwtAccessSecret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
      jwtRefreshSecret: this.config.get('JWT_REFRESH_SECRET', { infer: true }),
    };
  }
}
