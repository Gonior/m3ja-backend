import { MAX_LENGTH_WORKSPACE_NAME, TNewWorkspace } from '@app/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
export class CreateWorkspaceDto
  implements Omit<TNewWorkspace, 'createdAt' | 'updatedAt' | 'userId' | 'slug' | 'ownerId'>
{
  @ApiProperty({
    example: 'my-workspace',
    description: 'nama sebuah workspace',
    required: true,
  })
  @MaxLength(MAX_LENGTH_WORKSPACE_NAME, { context: { max: MAX_LENGTH_WORKSPACE_NAME } })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'menyimpan ide, catatan, dana something-to-do harian untuk pengembangan aplikasi m3ja',
    description: 'deskripsi sebuah workspace',
    required: false,
  })
  @IsOptional()
  description?: string | null | undefined;
}
