// src/common/middleware/request-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ClsService } from 'nestjs-cls';
// import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: any, res: any, next: () => void) {
    this.cls.set('requestId', randomBytes(6).toString('hex'));
    this.cls.set('userId', req.user?.id ?? null);
    next();
  }
}
