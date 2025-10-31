import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceRepository } from './workspace.repository';
import { WorkspaceMemberModule } from '../workspace-member/workspace-member.module';

@Module({
  imports: [WorkspaceMemberModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
