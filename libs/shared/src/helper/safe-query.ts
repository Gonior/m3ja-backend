import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { isAlreadyExistsMessage } from './validation-message';
export async function safeQuery<T>(fn: () => Promise<T>, field = 'field') {
  try {
    return await fn();
  } catch (error: any) {
    console.log(error);
    const code = error?.cause?.code;
    if (code === '23505') {
      // 23505 = duplicate key value violates unique constraint
      throw new ConflictException(isAlreadyExistsMessage(field));
    }

    throw new InternalServerErrorException('Database Error');
  }
}
