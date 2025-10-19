import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config'
import { AppLogger, CommonModule  } from '@app/common';
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal : true,
      ignoreEnvFile : true,
      load : [
        () => {
          const dotenvflow = require('dotenv-flow')
          dotenvflow.config()
          return process.env
        }
      ]
    }),
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
