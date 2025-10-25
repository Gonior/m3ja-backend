import { safeQuery } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { CreateUserDto } from './dto/create-user-dto';
import { AppLogger, userTable } from '@app/common';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user-dto';
import { ApiError } from '@app/common/errors';
import { UploadService } from '@app/upload';
import { DbService } from '@app/common/db/db.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly orm: DbService,
    private readonly logger: AppLogger,
    private readonly uploadService: UploadService,
  ) {}

  async findAll() {
    return safeQuery(async () => {
      this.logger.debug('start query find all users', UsersService.name);
      const result = this.orm.db.select().from(userTable);
      this.logger.debug('finish query find all users', UsersService.name);
      return result;
    });
  }

  async findByEmail(email: string) {
    return safeQuery(async () => {
      this.logger.debug('start finding user by email..', UsersService.name);
      const [user] = await this.orm.db.select().from(userTable).where(eq(userTable.email, email));
      this.logger.debug('finish find user by email', UsersService.name);
      return user;
    });
  }

  async createUser(data: CreateUserDto) {
    return safeQuery(async () => {
      this.logger.debug('start creating a new user...', UsersService.name);
      const [user] = await this.orm.db.insert(userTable).values(data).returning();
      this.logger.debug(`finish create a new user with id ${user?.id}`, UsersService.name);
      return user;
    }, 'email');
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return safeQuery(async () => {
      this.logger.debug('start update a user..', UsersService.name);
      const [user] = await this.orm.db
        .update(userTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userTable.id, id))
        .returning();
      this.logger.debug('finish update a user..', UsersService.name);
      return user;
    });
  }

  async updateAvatar(id: number, avatarKey: string) {
    return safeQuery(async () => {
      this.logger.debug('start update avatar a user..', UsersService.name);
      const [user] = await this.orm.db
        .update(userTable)
        .set({ avatarKey, updatedAt: new Date() })
        .where(eq(userTable.id, id))
        .returning();
      this.logger.debug('finish update avatar a user..', UsersService.name);
      return user;
    });
  }

  async changePassword(id: number, password: string) {
    return safeQuery(async () => {
      this.logger.debug('start change password user..', UsersService.name);
      const [user] = await this.orm.db
        .update(userTable)
        .set({ password, updatedAt: new Date() })
        .where(eq(userTable.id, id))
        .returning();
      this.logger.debug('finish change password user..', UsersService.name);
      return user;
    });
  }
  async deleteUser(id: number) {
    return safeQuery(async () => {
      this.logger.warn(`Start Delete user id ${id}`, UsersService.name);
      const deleted = await this.orm.db.delete(userTable).where(eq(userTable.id, id)).returning();

      this.logger.debug(`finish Delete user id ${id}`, UsersService.name);
      if (deleted.length >= 1) {
        if (deleted[0].avatarKey || deleted[0].avatarKey !== null) {
          this.logger.warn(
            `start to delete avatarKey after deleted user id ${deleted[0].id}`,
            UsersService.name,
          );
          await this.uploadService.deleteFile(deleted[0].avatarKey);
        }
        return { success: true, message: `user id ${id} has been deleted!` };
      } else throw ApiError.BadRequest('DATABASE_DELETE_ERROR');
    });
  }
}
