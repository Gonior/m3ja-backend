import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { GetUser } from '@app/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('w/:workspaceId/member')
export class WorkspaceMemberController {
  constructor(private readonly memberService: WorkspaceMemberService) {}

  @Get()
  findAll(@Param('workspaceId') workspaceId: string, @GetUser('id') userId: number) {
    return this.memberService.getAll(+workspaceId, userId);
  }

  @Post()
  async invite(
    @GetUser('id') actorId: number,
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateWorkspaceMemberDto,
  ) {
    return await this.memberService.invite(actorId, +workspaceId, dto);
  }

  @Patch(':id')
  async changeRole(
    @Param('id') id: string,
    @GetUser('id') actorId: number,
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateWorkspaceMemberDto,
  ) {
    return this.memberService.changeRole(+id, actorId, +workspaceId, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser('id') actorId: number,
    @Param('workspaceId') workspaceId: string,
  ) {
    let isRemoved = false;

    isRemoved = await this.memberService.remove(+id, actorId, +workspaceId);
    return { message: isRemoved ? 'Success remove member' : 'Nothing to remove', data: null };
  }
}
