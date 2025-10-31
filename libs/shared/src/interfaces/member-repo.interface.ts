import { TMember } from '../entities';

export interface IMemberRepo {
  // update(userId: number, workspaceId: number, data: Partial<TMember>): Promise<TMember>;
  findOneMember(userId: number, workspaceId: number): Promise<TMember | null>;
}
