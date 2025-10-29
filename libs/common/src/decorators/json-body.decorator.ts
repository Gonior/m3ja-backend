import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const JsonBody = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const value = req.body[field];
    if (!value) return undefined;

    let json;
    try {
      json = JSON.parse(value);
    } catch (error) {
      throw new BadRequestException(`Invalid JSON in field '${field}'`);
    }

    // const dtoClass = Reflect.getMetadata('design:type', ctx.getHandler());
    // const dtoIntance = plainToInstance(dtoClass, json);
    // const errors = validateSync(dtoIntance);

    // if (errors.length) throw new BadRequestException(errors);
    return json;
  },
);
