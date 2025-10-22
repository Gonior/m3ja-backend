import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class BaseValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || this.isPrimitive(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true, // auto hapus field yang tidak ada di DTO,
      forbidNonWhitelisted: true, // error kalo ada field "liar"
      transform: true, // auto transfrom data
    });
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return object;
  }

  private isPrimitive(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }
}
