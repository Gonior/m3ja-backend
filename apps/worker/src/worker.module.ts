import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [
        () => {
          const dotenvflow = require('dotenv-flow');
          dotenvflow.config();
          return process.env;
        },
      ],
    }),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
