import { Module } from '@nestjs/common';
import { DB_PROVIDER } from '@app/shared';

import { DbService } from './db.service';

@Module({
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
