import { Controller, Get } from '@nestjs/common';
import { DbService } from '@app/common';

@Controller('health')
export class HealthController {
  constructor(private readonly dbService: DbService) {}

  @Get('db')
  async getDbHealth() {
    const status = await this.dbService.checkHealth();
    return status;
  }
}
