import { PartialType } from '@nestjs/swagger';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { MAX_LENGTH_EMAIL, MAX_LENGTH_WORKSPACE_NAME } from '@app/shared';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
  @IsNotEmpty()
  @MaxLength(MAX_LENGTH_EMAIL, { context: { max: MAX_LENGTH_WORKSPACE_NAME } })
  name?: string | undefined;

  @IsOptional()
  description?: string | null | undefined;
}
