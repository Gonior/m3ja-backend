import { ApiError } from '@app/common/errors';
import { HttpStatus } from '@nestjs/common';
export function mapPosgresError(error: any): never {
  if (
    error?.cause?.code === 'ECONNREFUSED' ||
    error?.cause?.code === 'ECONNREST' ||
    error?.cause?.message?.includes('connection') ||
    error?.cause?.message?.includes('timeout')
  ) {
    throw new ApiError('DB_CONNECTION_ERROR', HttpStatus.SERVICE_UNAVAILABLE);
  }

  if (error?.cause?.code) {
    const code = error?.cause?.code ?? '';
    switch (code) {
      case '23505':
        throw ApiError.Conflict('DB_DUPLICATE_ENTRY');

      case '23503':
        throw ApiError.BadRequest('DB_FOREIGN_KEY');

      case '22P02':
        throw ApiError.BadRequest('DB_INVALID_INPUT');
    }
  }
  throw ApiError.Internal('DB_UNKNOW_ERROR', undefined, error.message);
}
