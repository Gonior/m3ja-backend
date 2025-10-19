import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@app/common';
@Module({
  imports: [UsersModule, CommonModule, AuthModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
