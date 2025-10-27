import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { EnvService } from '../config/env.config.service';
import { AppLogger } from '../logger/logger.service';
import { mapPosgresError } from './db-error.utils';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private client: Pool;
  private _db: ReturnType<typeof drizzle>;
  private reconnecting = false;
  private reconnectInterval?: NodeJS.Timeout;

  constructor(
    private readonly env: EnvService,
    private readonly logger: AppLogger,
  ) {
    this.client = this.createPool();
    this._db = drizzle(this.client);
  }

  private createPool() {
    const pool = new Pool({
      connectionString: this.env.dbConfig.url,
      connectionTimeoutMillis: 3000,
    });
    // venet terpicu ketika a new client connects
    pool.on('connect', () => {
      this.logger.log('✅ PostgreSQL connected', DbService.name);
      if (this.reconnecting) {
        // kalo semisal sebelumnya dalam mode reconnect, matikan interval
        clearInterval(this.reconnectInterval);
        this.reconnecting = false;
        this.logger.warn('🔄️ Reconnect watcher stopped!', DbService.name);
      }
    });

    // event terpicu ketika pool error (koneksi drop)
    pool.on('error', (err) => {
      this.logger.error(`❌ PosgtreSQL error:${err.message}`);
      this.handleDisconnect();
    });

    return pool;
  }

  private async ensuredConnected() {
    try {
      await this.client.query(`SELECT 1`);
      this.logger.warn('✅ Database connected Successfully', DbService.name);
    } catch (error) {
      this.logger.error(
        '❌ Initial Database connection failed, retry..., ',
        error?.message,
        DbService.name,
      );
      this.handleDisconnect();
    }
  }

  private async handleDisconnect() {
    if (this.reconnecting) return; // udah jalan
    this.reconnecting = true;
    this.logger.log('🚨 Database disconnected - starting reconnect watcher...');
    this.reconnectInterval = setInterval(async () => {
      this.logger.debug('try database connecting...', DbService.name);
      try {
        const testClient = new Pool({ connectionString: this.env.dbConfig.url });
        await testClient.query(`SELECT 1`);
        this.logger.log('✅ DB is back online! Reinitializing pool...');
        await this.client.end().catch(() => {});
        this.client = this.createPool();
        this._db = drizzle(this.client);
        clearInterval(this.reconnectInterval);
        this.reconnecting = false;
      } catch {}
    }, 5000);
  }
  async onModuleInit() {
    await this.ensuredConnected();
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
      console.log(error);
      this.logger.error(`Query failed in ${context}`, undefined, DbService.name);
      mapPosgresError(error);
    }
  }

  async onModuleDestroy() {
    clearInterval(this.reconnectInterval);
    this.logger.debug('🧹 Closing database connection...', DbService.name);
    await this.client.end();
  }

  async checkHealth() {
    try {
      const start = Date.now();
      await this.client.query(`SELECT 1`);
      const latency = Date.now() - start;
      return {
        status: 'ok',
        latency: `${latency}ms`,
        reconnecting: this.reconnecting,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        reconnectiong: this.reconnecting,
      };
    }
  }
}
