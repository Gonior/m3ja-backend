import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const JsonBody = createParamDecorator((field: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const value = req.body[field];
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new BadRequestException(`Invalid JSON in field '${field}'`);
  }
});
