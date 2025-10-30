import { IBaseRepo } from './base-repo.interface';

export interface IBaseMemberRepo<T> extends IBaseRepo<T> {
  findAllByWorkspace(workspaceId: number): Promise<T[]>;
  findOndByIdAndWorkspace(id: number, workspaceId: number): Promise<T | null>;
}
