import { Injectable, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class ClsUserInterceptor implements NestInterceptor {
  constructor(private readonly clsService: ClsService) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.user?.id) {
      this.clsService.set('userId', req.user.id);
    }
    return next.handle();
  }
}
