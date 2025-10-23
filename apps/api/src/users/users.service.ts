import { DB_PROVIDER, safeQuery, TUser } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { CreateUserDto } from './dto/create-user-dto';
import { AppLogger, userTable } from '@app/common';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user-dto';

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
      this.logger.debug('start query find all users');
      const result = this.db.select().from(userTable);
      this.logger.debug('finish query find all users');
      return result;
    });
  }

  async findByEmail(email: string) {
    return safeQuery(async () => {
      this.logger.debug('start finding user by email..');
      const [user] = await this.db.select().from(userTable).where(eq(userTable.email, email));
      this.logger.debug('finish find user by email');
      return user;
    });
  }

  async createUser(data: CreateUserDto) {
    return safeQuery(async () => {
      this.logger.debug('start creating a new user...');
      const [user] = await this.db.insert(userTable).values(data).returning();
      this.logger.debug(`finish create a new user with id ${user?.id}`);
      return user;
    }, 'email');
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return safeQuery(async () => {
      this.logger.debug('start update a user..');
      const [user] = await this.db
        .update(userTable)
        .set({ ...data })
        .where(eq(userTable.id, id))
        .returning();
      this.logger.debug('finish update a user..');
      return user;
    });
  }

  async updateAvatar(id: number, avatarKey: string) {
    return safeQuery(async () => {
      this.logger.debug('start update avatar a user..');
      const [user] = await this.db
        .update(userTable)
        .set({ avatarKey })
        .where(eq(userTable.id, id))
        .returning();
      this.logger.debug('finish update avatar a user..');
      return user;
    });
  }

  async changePassword(id: number, password: string) {
    return safeQuery(async () => {
      this.logger.debug('start change password user..');
      const [user] = await this.db
        .update(userTable)
        .set({ password })
        .where(eq(userTable.id, id))
        .returning();
      this.logger.debug('finish change password user..');
      return user;
    });
  }
}
