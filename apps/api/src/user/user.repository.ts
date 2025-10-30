import { userTable } from '@app/common';
import { DbService } from '@app/common/db/db.service';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadService } from '@app/upload';
import { TUser } from '@app/shared';

@Injectable()
export class UserRepository {
  constructor(private readonly orm: DbService) {}

  async findAll() {
    return await this.orm.safeExcute(async (db) => {
      return await db.select().from(userTable);
    }, 'UserRepository.findAll');
  }
  async findByEmail(email: string) {
    return await this.orm.safeExcute(async (db) => {
      const [user] = await db.select().from(userTable).where(eq(userTable.email, email));
      return user;
    }, 'UserRepository.findByEmail');
  }
  async findById(id: number) {
    return await this.orm.safeExcute(async (db) => {
      const [user] = await db.select().from(userTable).where(eq(userTable.id, id));
      return user;
    }, 'UserRepository.findById');
  }
  async createUser(createUserDto: CreateUserDto) {
    return await this.orm.safeExcute(async (db) => {
      const [user] = await db.insert(userTable).values(createUserDto).returning();
      return user;
    }, 'UserRepository.createUser');
  }
  async updateAvatar(
    id: number,
    avatarData: { avatarKey: string; avatarResizeStatus: TUser['avatarResizeStatus'] },
  ) {
    return await this.orm.safeExcute(async (db) => {
      const [user] = await db
        .update(userTable)
        .set({ ...avatarData, updatedAt: new Date() })
        .where(eq(userTable.id, id))
        .returning();

      return user;
    }, 'UserRepository.UpdateAvatar');
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return await this.orm.safeExcute(async (db) => {
      const [user] = await db
        .update(userTable)
        .set({ ...updateUserDto, updatedAt: new Date() })
        .where(eq(userTable.id, id))
        .returning();
      return user;
    }, 'UserRepository.UpdateUser');
  }

  async changePassword(id: number, password: string) {
    return await this.orm.safeExcute(async (db) => {
      const [user] = await db
        .update(userTable)
        .set({ password, updatedAt: new Date() })
        .where(eq(userTable.id, id))
        .returning();
      return user;
    }, 'UserRepository.changePassword');
  }

  async removeById(id: number) {
    return await this.orm.safeExcute(async (db) => {
      const [deleted] = await db.delete(userTable).where(eq(userTable.id, id)).returning();
      return deleted;
    }, 'UserRepository.removeById');
  }
}
