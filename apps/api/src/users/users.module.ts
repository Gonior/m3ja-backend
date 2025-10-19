import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto/create-user-dto';

@Module({
  providers: [UsersService, CreateUserDto],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
