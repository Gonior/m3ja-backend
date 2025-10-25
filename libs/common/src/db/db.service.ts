import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { EnvService } from '../config/env.config.service';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof postgres>;
  private _db: PostgresJsDatabase;

  constructor(
    private readonly env: EnvService,
    private readonly logger: AppLogger,
  ) {}

  onModuleInit() {
    this.client = postgres(this.env.dbConfig.url!, {});
    this._db = drizzle(this.client);
    this.logger.warn('✅ Database connected (postgres-js)', DbService.name);
  }

  get db() {
    return this._db;
  }

  async onModuleDestroy() {
    this.logger.warn('❌ Closing databse connection...', DbService.name);
    await this.client.end({ timeout: 5 });
  }
}
