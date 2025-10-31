import { Injectable } from '@nestjs/common';
import {
  IBaseMemberRepo,
  IBaseRepo,
  TMember,
  TNewMember,
  TUser,
  type IMemberRepo,
} from '@app/shared';
import { DbService, userTable, workspaceMembersTable, WorkspaceRole } from '@app/common';
import { and, eq } from 'drizzle-orm';
@Injectable()
export class WorkspaceMemberRepository implements IMemberRepo, IBaseRepo<TMember> {
  constructor(private readonly orm: DbService) {}

  // {
  //   id: workspaceMembersTable.id,
  //   workspaceId: workspaceMembersTable.workspaceId,
  //   userId: workspaceMembersTable.userId,
  //   username: userTable.username,
  //   displayName: userTable.displayName,
  //   email: userTable.email,
  //   role: workspaceMembersTable.role,
  //   joinAt: workspaceMembersTable.joinAt,
  //   updateAt: workspaceMembersTable.updatedAt,
  // }
  async findAllByWorkspace(workspaceId: number) {
    return await this.orm.safeExcute(async (db) => {
      return await db
        .select()
        .from(workspaceMembersTable)
        // .leftJoin(userTable, eq(userTable.id, workspaceMembersTable.userId))
        .where(eq(workspaceMembersTable.workspaceId, workspaceId));
    }, 'WorkspaceMemberRepository.findAllByWorkspace');
  }

  async findOneByIdAndWorkspace(id: number, workspaceId: number) {
    return await this.orm.safeExcute(async (db) => {
      const [member] = await db
        .select()
        .from(workspaceMembersTable)
        .where(
          and(eq(workspaceMembersTable.workspaceId, workspaceId), eq(workspaceMembersTable.id, id)),
        );
      return member;
    }, 'WorkspaceMemberRepository.findAllByWorkspace');
  }

  async findAll() {
    return await this.orm.safeExcute(async (db) => {
      return await db.select().from(workspaceMembersTable);
    }, 'WorkspaceMemberRepository.findAll');
  }

  async findOneMember(userId: number, workspaceId: number): Promise<TMember | null> {
    return await this.orm.safeExcute(async (db) => {
      const [member] = await db
        .select()
        .from(workspaceMembersTable)
        .where(
          and(
            eq(workspaceMembersTable.userId, userId),
            eq(workspaceMembersTable.workspaceId, workspaceId),
          ),
        )
        .limit(1);
      return member;
    }, 'WorkspaceMemberRepository.findOneMember');
  }

  async findOneById(id: number) {
    return await this.orm.safeExcute(async (db) => {
      const [member] = await db
        .select()
        .from(workspaceMembersTable)
        .where(eq(workspaceMembersTable.id, id));
      return member;
    }, 'WorkspaceMemberRepository.findOneById');
  }

  async create(data: TNewMember) {
    return await this.orm.safeExcute(async (db) => {
      const [member] = await db.insert(workspaceMembersTable).values(data).returning();
      return member;
    }, 'WorkpaceMemberRepository.addRember');
  }

  async update(id: number, data: Partial<TMember>) {
    return await this.orm.safeExcute(async (db) => {
      const [member] = await db
        .update(workspaceMembersTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(workspaceMembersTable.id, id))
        .returning();
      return member;
    }, 'WorkspaceMembersRepository.update');
  }

  async delete(id: number): Promise<boolean> {
    return await this.orm.safeExcute(async (db) => {
      const deleted = await db
        .delete(workspaceMembersTable)
        .where(eq(workspaceMembersTable.id, id))
        .returning();
      return deleted.length > 0;
    }, 'WorkspaceMemberRepository.delete');
  }
}
