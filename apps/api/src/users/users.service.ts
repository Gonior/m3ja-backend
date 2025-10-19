import { DB_PROVIDER } from '@app/shared';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { CreateUserDto } from './dto/create-user-dto';
import { AppLogger, userTable  } from '@app/common';
import { isAlreadyExists } from '@app/shared/helper/validation-message';
import { ApiError } from '@app/common/errors/api-error';
@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_PROVIDER) private readonly db : ReturnType<typeof drizzle>,
    private readonly logger : AppLogger
  ) {
    this.logger.setContext(UsersService.name)
  }
  async findAll() {
    this.logger.log('get all users')
    let result = await this.db.select().from(userTable)
    return result;
  }

  async createUser(data : CreateUserDto) {
    try {
      this.logger.warn('create a user')
      let user = await this.db.insert(userTable).values(data).returning()
      return user
    } catch (error) {
      let code = error?.cause?.code
      if (code === '23505') {
        // 23505 = duplicate key value violates unique constraint
        throw ApiError.Conflict(isAlreadyExists('email'));
      }
      throw ApiError.Internal(error)
    }
  }
}
