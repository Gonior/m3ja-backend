import { ApiError } from '@app/common/errors';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: any, user: any, info: any): TUser {
    // jwt expired
    // No auth token
    // invalid signature
    if (info?.message === 'jwt expired' || info?.message === 'invalid signature') {
      throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Token is invalid or expired');
    }

    if (info?.message === 'No auth token') {
      throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Token is missing');
    }
    if (err || !user) {
      console.log(err);
      throw ApiError.Unathorized('UNAUTHORIZED');
    }
    return user;
  }
}