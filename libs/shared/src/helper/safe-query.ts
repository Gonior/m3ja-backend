import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { isAlreadyExistsMessage } from './validation-message';
import { ApiError } from '@app/common/errors';
export async function safeQuery<T>(fn: () => Promise<T>, field = 'field') {
  try {
    return await fn();
  } catch (error: any) {
    console.log(error);
    const code = error?.cause?.code;
    if (code === '23505') {
      // 23505 = duplicate key value violates unique constraint
      throw ApiError.Conflict(isAlreadyExistsMessage({ field }, true));
    }

    throw ApiError.Internal('Database Error');
  }
}

console.log('');
