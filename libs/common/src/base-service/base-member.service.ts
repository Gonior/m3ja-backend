import { IBaseMemberRepo, IBaseOwnedRepo, IMemberRepo } from '@app/shared';
import { WorkspaceRole } from '../db/schema/workspace-members.schema';
import { ApiError } from '../errors';

export abstract class BaseMemberService<T extends { id: number; workspaceId: number }> {
  constructor(
    protected readonly repo: IBaseMemberRepo<T>,
    protected readonly memberRepo: IMemberRepo,
  ) {}

  protected async ensureMember(
    actorId: number,
    workspaceId: number,
    allowedRoles: WorkspaceRole[] = ['owner', 'admin', 'member'],
  ) {
    const member = await this.memberRepo.findOneMember(actorId, workspaceId);

    if (!member) throw ApiError.Forbidden();

    if (!allowedRoles.includes(member.role)) throw ApiError.Forbidden(); //Insufficient role permissions

    return member;
  }

  async getAll(workspaceId: number, actorId: number) {
    await this.ensureMember(actorId, workspaceId);
    return this.repo.findAllByWorkspace(workspaceId);
  }
  async getOne(id: number, actorId: number, errorProp: string) {
    const resource = await this.repo.findOneById(id);
    if (!resource) throw ApiError.NotFound('NOT_FOUND', { prop: errorProp });
    await this.ensureMember(resource.workspaceId, actorId);
    return resource;
  }

  async create(
    dto: Partial<T>,
    actorId: number,
    workspaceId: number,
    allowedRoles: WorkspaceRole[] = ['owner'],
  ) {
    await this.ensureMember(actorId, workspaceId, allowedRoles);
    return this.repo.create({ ...dto, workspaceId });
  }

  async update(
    id: number,
    dto: Partial<T>,
    actorId: number,
    allowedRoles: WorkspaceRole[] = ['owner'],
    errorProp: string,
  ) {
    const resource = await this.repo.findOneById(id);
    if (!resource) throw ApiError.NotFound('NOT_FOUND', { prop: errorProp });
    await this.ensureMember(actorId, resource.workspaceId, allowedRoles);
    return this.repo.update(id, dto);
  }

  async delete(
    id: number,
    actorId: number,
    allowedRoles: WorkspaceRole[] = ['owner'],
    errorProp: string,
  ) {
    const resource = await this.repo.findOneById(id);
    if (!resource) throw ApiError.NotFound('NOT_FOUND', { prop: errorProp });
    await this.ensureMember(actorId, resource.workspaceId, allowedRoles);
    return this.repo.delete(id);
  }
}
