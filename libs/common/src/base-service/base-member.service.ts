import { IBaseMemberRepo, IBaseOwnedRepo, IMemberRepo, MemberRole } from '@app/shared';
import { ApiError } from '../errors';

export abstract class BaseMemberService<T extends { id: number; workspaceId: number }> {
  constructor(
    protected readonly repo: IBaseMemberRepo<T>,
    protected readonly memberRepo: IMemberRepo,
  ) {}

  protected async ensureMember(
    userId: number,
    workspaceId: number,
    allowedRoles: MemberRole[] = ['owner', 'admin', 'member'],
  ) {
    const member = await this.memberRepo.findOneMember(userId, workspaceId);

    if (!member) throw ApiError.Forbidden();

    if (!allowedRoles.includes(member.role)) throw ApiError.Forbidden(); //Insufficient role permissions

    return member;
  }

  async getAll(workspaceId: number, userId: number) {
    await this.ensureMember(userId, workspaceId);
    return this.repo.findAllByWorkspace(workspaceId);
  }
  async getOne(id: number, userId: number) {
    const resource = await this.repo.findOneById(id);
    if (!resource) throw ApiError.NotFound('NOT_FOUND', { prop: 'Workspace' });
    await this.ensureMember(resource.workspaceId, userId);
    return resource;
  }

  async create(dto: Partial<T>, userId: number, workspaceId: number) {
    await this.ensureMember(userId, workspaceId, ['admin', 'owner', 'member']);
    return this.repo.create({ ...dto, workspaceId });
  }

  async update(id: number, dto: Partial<T>, userId: number) {
    const resource = await this.repo.findOneById(id);
    if (!resource) throw ApiError.NotFound('NOT_FOUND', { prop: 'Workspace' });
    await this.ensureMember(userId, resource.workspaceId, ['owner', 'admin']);
    return this.repo.update(id, dto);
  }

  async delete(id: number, userId: number) {
    const resource = await this.repo.findOneById(id);
    if (!resource) throw ApiError.NotFound('NOT_FOUND', { prop: 'Workspace' });
    await this.ensureMember(userId, resource.workspaceId, ['owner', 'admin']);
    return this.repo.delete(id);
  }
}
