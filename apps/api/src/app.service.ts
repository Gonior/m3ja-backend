import { Injectable } from '@nestjs/common';
import { EnvService } from '@app/common/config/env.config.service';
@Injectable()
export class AppService {
  constructor(private readonly envService: EnvService) {}
  getHello() {
    const { host, apiPort } = this.envService.appConfig;
    console.log(this.envService.appConfig);
    return {
      message: 'hello',
      docs_api: `http://${host}:${apiPort}/docs`,
    };
  }
}
