import { Module, Global } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AppLogger } from './logger/app.logger';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { LoggingInterceptor } from './inteceptors/logging.interceptor';
import { ConfigModule } from './config/config.module';
import { ApiError } from './errors/api-error';
import { LocaleService } from './locale/locale.service';

@Global()
@Module({
  imports: [DbModule, ConfigModule, ApiError],
  providers: [AllExceptionFilter, LoggingInterceptor, AppLogger, LocaleService],
  exports: [DbModule, AllExceptionFilter, LoggingInterceptor, AppLogger, ConfigModule, ApiError],
})
export class CommonModule {}
