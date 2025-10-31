import { type WorkspaceRole, workspaceRoleEnum } from '@app/common';
import { TMember } from '@app/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
export class CreateWorkspaceMemberDto
  implements Omit<TMember, 'workspaceId' | 'id' | 'joinAt' | 'updatedAt'>
{
  @ApiProperty({
    description: 'target user id',
    required: true,
  })
  @IsNotEmpty()
  userId: number;

  // workspaceRoleEnum.enumValues
  @ApiProperty({
    description: 'target role',
    enumName: 'WorkspaceRole',
    enum: workspaceRoleEnum.enumValues,
  })
  @IsEnum(Object.fromEntries(workspaceRoleEnum.enumValues.map((v) => [v, v])))
  role: WorkspaceRole;
}
