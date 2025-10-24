import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Delete(':id')
  async createUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
