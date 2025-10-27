import { DbService } from '@app/common/db/db.service';
import { Injectable } from '@nestjs/common';
import { userTokensTable } from '@app/common';
import type { TNewUserToken } from '@app/shared';
import { eq, and, gt, isNull, or } from 'drizzle-orm';
import { UUID } from 'crypto';

@Injectable()
export class UserTokenRepository {
  constructor(private readonly orm: DbService) {}

  async findAll() {
    return this.orm.safeExcute(async (db) => {
      return await db.select().from(userTokensTable);
    }, 'UserRepository.findAll');
  }

  async findUserActiveToken(userId: number) {
    const now = new Date();
    return this.orm.safeExcute(async (db) => {
      return await db
        .select()
        .from(userTokensTable)
        .where(
          and(
            eq(userTokensTable.userId, userId),
            isNull(userTokensTable.revokedAt),
            gt(userTokensTable.expiresAt, now),
          ),
        );
    });
  }

  async findOneJtiActiveToken(jti: UUID) {
    const now = new Date();
    return this.orm.safeExcute(async (db) => {
      const [token] = await db
        .select()
        .from(userTokensTable)
        .where(
          and(
            eq(userTokensTable.jti, jti),
            isNull(userTokensTable.revokedAt),
            gt(userTokensTable.expiresAt, now),
          ),
        );
      return token;
    });
  }

  async saveToken(newToken: TNewUserToken) {
    return this.orm.safeExcute(async (db) => {
      const [token] = await db.insert(userTokensTable).values(newToken).returning();
      return token;
    }, 'UserTokenRepository.SaveToken');
  }

  async findByJti(jti: UUID) {
    return this.orm.safeExcute(async (db) => {
      const [token] = await db.select().from(userTokensTable).where(eq(userTokensTable.jti, jti));
      return token;
    }, 'UserTokenRepository.findByJti');
  }

  async revokeToken(jti: UUID) {
    return this.orm.safeExcute(async (db) => {
      const [token] = await db
        .update(userTokensTable)
        .set({ revokedAt: new Date() })
        .where(eq(userTokensTable.jti, jti))
        .returning();
      return token;
    }, 'UserRepository.findAll');
  }
}
