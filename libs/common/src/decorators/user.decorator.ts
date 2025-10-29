import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUser } from '@app/shared';
export const GetUser = createParamDecorator(
  (data: keyof TUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as TUser;
    return data ? user?.[data] : user;
  },
);
