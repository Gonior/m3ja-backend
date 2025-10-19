import { DB_PROVIDER, safeQuery, TUser } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { CreateUserDto } from './dto/create-user-dto';
import { AppLogger, userTable } from '@app/common';
import { isAlreadyExistsMessage } from '@app/shared/helper/validation-message';
import { ApiError } from '@app/common';
import { eq } from 'drizzle-orm';
@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async findAll() {
    return safeQuery(async () => {
      this.logger.log('start query find all users');
      const result = this.db.select().from(userTable);
      this.logger.log('finish query find all users');
      return result;
    });
  }

  async findByEmail(email: string) {
    return safeQuery(async () => {
      this.logger.warn('start finding user by email..');
      const [user] = await this.db.select().from(userTable).where(eq(userTable.email, email));
      this.logger.warn('finish find user by email');
      return user;
    });
  }

  async createUser(data: CreateUserDto) {
    return safeQuery(async () => {
      this.logger.warn('start creating a new user...');
      const [user] = await this.db.insert(userTable).values(data).returning();
      this.logger.log(`finish create a new user with id ${user?.id}`);
      return user;
    }, 'email');
  }
}
