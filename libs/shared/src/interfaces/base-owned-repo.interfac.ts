import { IBaseRepo } from './base-repo.interface';

export interface IBaseOwnedRepo<T> extends IBaseRepo<T> {
  findAllByOwnerId(ownerId: number): Promise<T[]>;
  findOneByIdAndOwnerId(id: number, ownerId: number): Promise<T | null>;
  update(id: number, data: Partial<T>, ownedId?: number): Promise<T>;
}
