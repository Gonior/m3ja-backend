import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { AppLogger } from '@app/common';
import { UpdateUserDto } from './dto/update-user-dto';
import { ApiError } from '@app/common/errors';
import { UploadService } from '@app/upload';
import { UserRepository } from './user.repository';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: AppLogger,
    private readonly uploadService: UploadService,
    private readonly userRepo: UserRepository,
  ) {}

  async findAll() {
    return await this.userRepo.findAll();
  }

  async findByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  async registerUser(createUserDto: CreateUserDto) {
    this.logger.debug('🔧 Checking email...', UserService.name);
    const existsUser = await this.userRepo.findByEmail(createUserDto.email);
    if (existsUser) throw ApiError.Conflict('ALREADY_EXISTS', { field: 'Email' });

    this.logger.debug('🔧 Hashing password...', UserService.name);
    const hashedPassword = await argon2.hash(createUserDto.password);
    createUserDto.password = hashedPassword;

    const user = await this.userRepo.createUser(createUserDto);

    return user;
  }

  async deleteUser(id: number) {
    this.logger.debug(`➡️ Start Delete user (id: ${id})`, UserService.name);

    const deleted = await this.userRepo.removeById(id);
    if (!deleted) {
      throw ApiError.NotFound('NOT_FOUND', { prop: `user id ${id}` });
    }
    if (deleted.avatarKey) {
      this.logger.debug(`🔧 AvatarKey detected...`, UserService.name);
      await this.uploadService.deleteFile(deleted.avatarKey);
    }

    this.logger.debug(`✅ User deleted successfully user (id: ${id})`, UserService.name);

    return { success: true, message: `user has been deleted!`, data: deleted };
  }

  async updateAvatar(id: number, avatarKey: string) {
    this.logger.debug(`🔧 Updating avatarKey (id: ${id})`, UserService.name);
    const user = await this.userRepo.updateAvatar(id, avatarKey);
    this.logger.debug(`✅ User AvatarKey updated (id: ${id})`, UserService.name);
    return user;
  }

  async updateUser(id: number, data: UpdateUserDto) {}
  async changePassword(id: number, password: string) {}
}
