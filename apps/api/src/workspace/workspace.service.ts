import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceRepository } from './workspace.repository';
import { AppLogger, workspaceTable } from '@app/common';
import { ApiError } from '@app/common/errors';
import { generateSlug, TWorkspace } from '@app/shared';
import { BaseOwnedService } from '@app/common/base-service/base-owned.service';

@Injectable()
export class WorkspaceService extends BaseOwnedService<TWorkspace> {
  constructor(
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly logger: AppLogger,
  ) {
    super(workspaceRepo);
  }
  async create(userId: number, createWorkspaceDto: CreateWorkspaceDto) {
    const existsByName = await this.workspaceRepo.existsByName(userId, createWorkspaceDto.name);
    if (existsByName) throw ApiError.Conflict('ALREADY_EXISTS', { field: 'Workspace Name' });
    const baseSlug = generateSlug(createWorkspaceDto.name);
    let slug = baseSlug;

    let i = 1;
    while (await this.workspaceRepo.existsBySlug(userId, slug)) {
      slug = `${baseSlug}-${i++}`;
    }
    return await super.create(userId, { ...createWorkspaceDto, slug });
  }

  async findOneByOwnerIdAndSlug(userId: number, slug: string) {
    const workspace = await this.workspaceRepo.findOneByOwnerIdAndSlug(userId, slug);
    if (!workspace) throw ApiError.NotFound('NOT_FOUND', { prop: 'workspace' });
    return workspace;
  }

  async update(id: number, updateWorkspaceDto: UpdateWorkspaceDto, userId: number) {
    const workspace = await this.workspaceRepo.findOne(id);
    if (!workspace) throw ApiError.NotFound('NOT_FOUND', { prop: 'workspace' });

    let slug = workspace.slug;
    if (updateWorkspaceDto.name && updateWorkspaceDto.name !== workspace.name) {
      if (await this.workspaceRepo.existsByName(userId, updateWorkspaceDto.name, id))
        throw ApiError.Conflict('ALREADY_EXISTS', { field: 'Workspace Name' });

      const baseSlug = generateSlug(updateWorkspaceDto.name);
      slug = baseSlug;
      let i = 1;
      while (await this.workspaceRepo.existsBySlug(userId, slug)) {
        slug = `${baseSlug}-${i}`;
      }
    }
    return super.update(id, { ...updateWorkspaceDto, slug }, userId);
  }
}
