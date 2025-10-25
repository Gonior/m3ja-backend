import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { EnvService } from '../config/env.config.service';
import { AppLogger } from '../logger/logger.service';
import { mapPosgresError } from './db-error.utils';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof postgres>;
  private _db: ReturnType<typeof drizzle>;

  constructor(
    private readonly env: EnvService,
    private readonly logger: AppLogger,
  ) {}

  async onModuleInit() {
    this.client = postgres(this.env.dbConfig.url!, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    try {
      this.logger.warn('⚙️ Test database connection...', DbService.name);
      await this.client`SELECT 1`;
      this._db = drizzle(this.client);
      this.logger.warn('✅ Database connected (postgres-js)', DbService.name);
    } catch (error) {
      this.logger.error('❌ Database connection fail', error, DbService.name);
      this.logger.warn('❌ Closing database connection...', DbService.name);
      await this.client.end({ timeout: 10 });
    }
  }

  get db() {
    return this._db;
  }

  async safeExcute<T>(
    queryFn: (db: ReturnType<typeof drizzle>) => Promise<T>,
    context: string = 'Unkwon query',
  ): Promise<T> {
    try {
      return await queryFn(this._db);
    } catch (error) {
      this.logger.error(`Query failed in ${context}`, undefined, DbService.name);
      mapPosgresError(error);
    }
  }

  async onModuleDestroy() {
    this.logger.warn('❌ Closing database connection...', DbService.name);
    await this.client.end({ timeout: 5 });
  }
}
