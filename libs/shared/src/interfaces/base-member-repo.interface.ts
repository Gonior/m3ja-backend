import { IBaseRepo } from './base-repo.interface';

export interface IBaseMemberRepo<T> extends IBaseRepo<T> {
  findAllByWorkspace(workspaceId: number): Promise<T[]>;
  findOneByIdAndWorkspace(id: number, workspaceId: number): Promise<T | null>;
}
