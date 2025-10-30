export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface MemberEntity {
  userId: number;
  worspaceId: number;
  role: MemberRole;
  joinAt: Date;
}

export interface IMemberRepo {
  findOneMember(userId: number, workspaceId: number): Promise<MemberEntity | null>;
}
