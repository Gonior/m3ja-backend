import { Injectable } from '@nestjs/common';
import { EnvService } from '@app/common/config/env.config.service';
import { AppLogger } from '@app/common';

@Injectable()
export class AppService {
  constructor(
    private readonly envService: EnvService,
    private readonly logger: AppLogger,
  ) {}
  getHello() {
    const { host, apiPort } = this.envService.appConfig;
    this.logger.debug(JSON.stringify(this.envService.appConfig ?? {}));
    return {
      message: 'hello',
      docs_api: `http://${host}:${apiPort}/docs`,
    };
  }
}
