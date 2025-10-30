import { IBaseOwnedRepo } from '@app/shared';
import { ApiError } from '../errors';

export abstract class BaseOwnedService<T extends { id: number; ownerId: number }> {
  constructor(protected readonly repo: IBaseOwnedRepo<T>) {}

  protected ensureOwnership(resource: T, userId: number) {
    if (resource.ownerId !== userId) {
      throw ApiError.Forbidden();
    }
  }

  async create(userId: number, dto: Partial<T>) {
    return this.repo.create({ ...dto, ownerId: userId });
  }

  async getAll(userId: number) {
    return this.repo.findAllByOwnerId(userId);
  }

  async getOne(id: number, userId: number) {
    const resource = await this.repo.findOneByIdAndOwnerId(id, userId);
    if (!resource) throw ApiError.NotFound('NOT_FOUND', { prop: 'Workspace' });
    this.ensureOwnership(resource, userId);
    return resource;
  }

  async update(id: number, dto: Partial<T>, userId: number) {
    const resource = await this.repo.findOneById(id);
    if (!resource) throw ApiError.NotFound('NOT_FOUND', { prop: 'Workspace' });
    this.ensureOwnership(resource, userId);
    return this.repo.update(id, dto);
  }

  async delete(id: number, userId: number) {
    const resource = await this.repo.findOneById(id);
    if (!resource) return false;
    this.ensureOwnership(resource, userId);
    return this.repo.delete(id);
  }
}
