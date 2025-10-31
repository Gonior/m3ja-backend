import { Module } from '@nestjs/common';
import { WorkspaceMemberRepository } from './workspace-member.repository';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [WorkspaceMemberService, WorkspaceMemberRepository],
  exports: [WorkspaceMemberService],
  controllers: [WorkspaceMemberController],
})
export class WorkspaceMemberModule {}
