import { Module } from '@nestjs/common';
import { DB_PROVIDER } from '@app/shared';
import { drizzle } from 'drizzle-orm/postgres-js';
import { EnvService } from '../config/env.config.service';
import postgres from 'postgres';

@Module({
  providers: [
    {
      provide: DB_PROVIDER,
      inject: [EnvService],
      useFactory: (config: EnvService) => {
        const client = postgres(config.dbConfig.url!);
        return drizzle(client);
      },
    },
  ],
  exports: [DB_PROVIDER],
})
export class DbModule {}
