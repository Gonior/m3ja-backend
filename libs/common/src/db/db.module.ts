import { Module } from '@nestjs/common';
import { DB_PROVIDER } from '@app/shared';
import { drizzle } from 'drizzle-orm/postgres-js';
import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';

@Module({
  providers: [
    {
      provide: DB_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const client = postgres(config.get<string>('database.url')!);
        return drizzle(client);
      },
    },
  ],
  exports: [DB_PROVIDER],
})
export class DbModule {}
