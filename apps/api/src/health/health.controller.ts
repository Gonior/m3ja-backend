import { Controller, Get } from '@nestjs/common';
import { DbService } from '@app/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(private readonly dbService: DbService) {}

  @Get('db')
  @ApiOperation({ summary: 'Cek konektivitas database' })
  async getDbHealth() {
    const status = await this.dbService.checkHealth();
    return status;
  }
}
