import { DbService, workspaceTable } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { and, eq, ne } from 'drizzle-orm';
import { IBaseOwnedRepo, TNewWorkspace, TWorkspace } from '@app/shared';

@Injectable()
export class WorkspaceRepository implements IBaseOwnedRepo<TWorkspace> {
  constructor(private readonly orm: DbService) {}

  async create(data: TNewWorkspace) {
    return await this.orm.safeExcute(async (db) => {
      const [workspace] = await db.insert(workspaceTable).values(data).returning();
      return workspace;
    }, 'WorkspaceRepository.create');
  }

  // method custom
  async existsByName(ownerId: number, name: string, excludeId?: number) {
    const conditions = [eq(workspaceTable.ownerId, ownerId), eq(workspaceTable.name, name)];
    if (excludeId) conditions.push(ne(workspaceTable.id, excludeId));
    return await this.orm.safeExcute(async (db) => {
      const workspaces = await db
        .select()
        .from(workspaceTable)
        .where(and(...conditions))
        .limit(1);
      return workspaces.length > 0;
    }, 'WorkspaceRepository.existsBySlug');
  }

  // method custom
  async existsBySlug(ownerId: number, slug: string) {
    return await this.orm.safeExcute(async (db) => {
      const workspaces = await db
        .select()
        .from(workspaceTable)
        .where(and(eq(workspaceTable.ownerId, ownerId), eq(workspaceTable.slug, slug)))
        .limit(1);
      return workspaces.length > 0;
    }, 'WorkspaceRepository.existsBySlug');
  }

  async findAll() {
    return await this.orm.safeExcute(async (db) => {
      return await db.select().from(workspaceTable);
    }, 'WorkspaceRepository.findAll');
  }
  async findOne(id: number) {
    return await this.orm.safeExcute(async (db) => {
      const [workspace] = await db.select().from(workspaceTable).where(eq(workspaceTable.id, id));
      return workspace;
    }, 'WorkspaceRepository.findOne');
  }

  async findOneByIdAndOwnerId(id: number, ownerId: number) {
    return await this.orm.safeExcute(async (db) => {
      const [workspace] = await db
        .select()
        .from(workspaceTable)
        .where(and(eq(workspaceTable.id, id), eq(workspaceTable.ownerId, ownerId)));
      return workspace;
    }, 'WorkspaceRepository.findOnebyIdAndOwner');
  }
  async findAllByOwnerId(ownerId: number) {
    return await this.orm.safeExcute(async (db) => {
      return await db.select().from(workspaceTable).where(eq(workspaceTable.ownerId, ownerId));
    }, 'WorkspaceRepository.findAllByOwnerId');
  }

  // method custom
  async findOneByOwnerIdAndSlug(ownerId: number, slug: string) {
    return await this.orm.safeExcute(async (db) => {
      const [workspace] = await db
        .select()
        .from(workspaceTable)
        .where(and(eq(workspaceTable.ownerId, ownerId), eq(workspaceTable.slug, slug)));
      return workspace;
    }, 'WorkspaceRepository.findOneByOwnerIdAndSlug');
  }

  async findOneById(id: number) {
    return await this.orm.safeExcute(async (db) => {
      const [workspace] = await db.select().from(workspaceTable).where(eq(workspaceTable.id, id));
      return workspace;
    }, 'WorkspaceRepository.findOne');
  }

  async update(id: number, data: Partial<typeof workspaceTable.$inferInsert>) {
    const now = new Date();
    return await this.orm.safeExcute(async (db) => {
      const [workspace] = await db
        .update(workspaceTable)
        .set({ ...data, updatedAt: now })
        .where(eq(workspaceTable.id, id))
        .returning();
      return workspace;
    }, 'WorkspaceRepository.update');
  }

  async delete(id: number) {
    return await this.orm.safeExcute(async (db) => {
      const deleted = await db.delete(workspaceTable).where(eq(workspaceTable.id, id)).returning();
      return deleted.length > 0;
    }, 'WorkspaceRepository.delete');
  }
}
