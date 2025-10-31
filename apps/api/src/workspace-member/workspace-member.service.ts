import { TMember } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { WorkspaceMemberRepository } from './workspace-member.repository';
import { WorkspaceRole, BaseMemberService, AppLogger } from '@app/common';
import { ApiError } from '@app/common/errors';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UserService } from '../user/user.service';

// tingkatan  role
// 1. owner
// 2. admin
// 3. member
// 4. viewer
//
// aturan role :
// 1. satu workpace hanya boleh terdiri dari satu owner
// 2. role owner tidak bisa di transfer
// 3. semua operasi role hanya bekerja pada workspace masing masing
// 4. owner tidak bisa menghapus role ownernya sendiri
// 5. role owner bisa melakukan operasi role dibawahnya
// 6. role admin hanya bisa operasi role dibawahnya (tidak bisa menghapus role sesama admin)
// 7. role admin tidak dapat merubah role dibawahnya menjadi role admin
// 8. role member tidak dapat melakukan operasi role kecuali hapus diri sendiri
// 9. role viewer tidak dapat melakukan operasi role kecuali hapus diri sendiri
// 10. tidak dapat merubah atau menambahkn role diri sendiri, kecuali hapus diri sendiri bisa
// catatan :
// operasi role = menambahkan, menghapus, mengubah

@Injectable()
export class WorkspaceMemberService extends BaseMemberService<TMember> {
  constructor(
    protected readonly repo: WorkspaceMemberRepository,
    protected readonly memberRepo: WorkspaceMemberRepository,
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {
    super(repo, memberRepo);
  }
  async setOwner(userId: number, workspaceId: number) {
    return await this.repo.create({ userId, workspaceId, role: 'owner' });
  }

  async changeRole(
    id: number,
    actorId: number,
    workspaceId: number,
    dto: CreateWorkspaceMemberDto,
  ) {
    if (dto.role === 'owner') {
      this.logger.warn(`Access Denied: workspaceId(${workspaceId}) cannot change role to owner`);
      throw ApiError.Forbidden();
    }
    if (!(await this.userService.findById(dto.userId)))
      throw ApiError.NotFound('NOT_FOUND', { prop: 'Target User Id' });

    // apakah kamu member workspace ini??
    const actor = await this.repo.findOneMember(actorId, workspaceId);
    const target = await this.repo.findOneMember(dto.userId, workspaceId);
    if (!actor || !target) {
      this.logger.warn(
        `Access Denied: actorId(${actor?.userId}) or targetId(${target?.userId}) not member of workspaceId(${workspaceId})`,
      );
      throw ApiError.Forbidden();
    }

    if (actor.userId === target.userId && actor.role === 'owner') {
      this.logger.warn(`Access Denied: Cannot modify owner role`);
      throw ApiError.Forbidden();
    }

    if (actor.userId === target.userId) {
      this.logger.warn(`Access Denied: Cannot modify own role`);
      throw ApiError.Forbidden();
    }

    // kamu juga, maaf
    if (actor.role === 'admin' && dto.role === 'admin') {
      this.logger.warn(
        `Access Denied: actorId(${actorId}) role (${actor.role}) has same role as targetId(${dto.userId}) role (${dto.role})`,
      );
      throw ApiError.Forbidden();
    }

    if (!this.canOperate(actor.role, target.role)) {
      this.logger.warn(
        `Access Denied: actorId(${actor.userId})[${actor.role}] cannot operate targetId(${target.userId})[${target.role}]`,
      );
      throw ApiError.Forbidden();
    }

    return await this.repo.update(id, { ...dto, workspaceId });
  }

  async invite(actorId: number, workspaceId: number, dto: CreateWorkspaceMemberDto) {
    // kamu ga boleh invite role owner
    if (dto.role === 'owner') {
      this.logger.warn(`Access Denied: workspaceId(${workspaceId}) cannot invite role owner`);
      throw ApiError.Forbidden();
    }

    if (!(await this.userService.findById(dto.userId)))
      throw ApiError.NotFound('NOT_FOUND', { prop: 'Target User Id' });

    // apakah kamu member workspace ini??
    const actor = await this.repo.findOneMember(actorId, workspaceId);
    if (!actor) {
      this.logger.warn(
        `Access Denied: actorId(${actorId}) not member of workspaceId(${workspaceId})`,
      );
      throw ApiError.Forbidden();
    }

    // kalo ga punya otoritas, maaf ya
    if (actor.role === 'member' || actor.role === 'viewer') {
      this.logger.warn(
        `Access Denied: actorId(${actorId}) has role ${actor.role}, required role admin or higher`,
      );
      throw ApiError.Forbidden();
    }
    if (actor.userId === dto.userId) {
      this.logger.warn(`Access Denied: Cannot invite themselves`);
      throw ApiError.Forbidden();
    }

    // kamu juga, maaf
    if (actor.role === 'admin' && dto.role === 'admin') {
      this.logger.warn(
        `Access Denied: actorId(${actorId}) role (${actor.role}) has same role as targetId(${dto.userId}) role (${dto.role})`,
      );
      throw ApiError.Forbidden();
    }

    // cek target user sudah gabung atau belum
    const target = await this.repo.findOneMember(dto.userId, workspaceId);
    if (target) throw ApiError.Conflict('ALREADY_EXISTS', { field: 'Member' });

    return await this.repo.create({ ...dto, workspaceId });
  }

  async remove(id: number, actorId: number, workspaceId: number): Promise<boolean> {
    const actor = await this.repo.findOneMember(actorId, workspaceId);
    if (!actor) throw ApiError.Forbidden();
    const target = await this.repo.findOneById(id);
    if (!target) throw ApiError.NotFound('NOT_FOUND', { prop: 'member' });
    if (target.role === 'owner') {
      this.logger.warn(
        `Access Denied: actorId(${actor.userId}) Cannot remove role 'owner' on targetId(${target.userId})`,
      );
      throw ApiError.Forbidden();
    }
    if (actor.userId === target.userId && actor.role === 'owner') {
      this.logger.warn(`Access Denied: Owner cannot remove themselves`);
      throw ApiError.Forbidden();
    }

    if (actor.userId !== target.userId && !this.canOperate(actor.role, target.role)) {
      this.logger.warn(
        `Access Denied: actorId(${actor.userId})[${actor.role}] cannot operate targetId(${target.userId})[${target.role}]`,
      );
      throw ApiError.Forbidden();
    }

    return await this.repo.delete(id);
  }
  private hierarchy: Record<WorkspaceRole, number> = { viewer: 0, member: 1, admin: 2, owner: 3 };
  private canOperate = (actorRole: WorkspaceRole, tagetRole: WorkspaceRole) =>
    this.hierarchy[actorRole] > this.hierarchy[tagetRole];
}
