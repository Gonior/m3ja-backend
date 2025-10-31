import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { GetUser } from '@app/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiResponse } from '@app/shared';

@UseGuards(JwtAuthGuard)
@Controller('w')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@GetUser('id') userId: number, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(userId, createWorkspaceDto);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.workspaceService.getAll(userId);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.workspaceService.getOne(+id, userId);
  }

  @Get('slug/:slug')
  async findBySlug(@GetUser('id') userId: number, @Param('slug') slug: string) {
    console.log({ userId, slug });
    return await this.workspaceService.findOneByOwnerIdAndSlug(+userId, slug);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(+id, updateWorkspaceDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser('id') userId: number): Promise<ApiResponse> {
    let isDeleted = false;
    isDeleted = await this.workspaceService.delete(+id, userId);
    return { message: isDeleted ? 'Deleted workspace succesfully' : 'nothin to delete' };
  }
}
