import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { AppLogger } from '@app/common';
import { UpdateUserDto } from './dto/update-user-dto';
import { ApiError } from '@app/common/errors';
import { UserRepository } from './user.repository';
import * as argon2 from 'argon2';
import { type TUser } from '@app/shared';
import { FileService } from '@app/file';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: AppLogger,
    private readonly userRepo: UserRepository,
    private readonly fileService: FileService,
  ) {}

  async findAll() {
    return await this.userRepo.findAll();
  }

  async findByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  async findById(id: number) {
    return await this.userRepo.findById(id);
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
      await this.fileService.deleteFile(deleted.avatarKey);
    }

    this.logger.debug(`✅ User deleted successfully user (id: ${id})`, UserService.name);

    return { success: true, message: `user has been deleted!`, data: deleted };
  }

  async updateAvatar(
    id: number,
    avatarData: {
      avatarKey: string;
      avatarResizeStatus: TUser['avatarResizeStatus'];
    },
  ) {
    avatarData.avatarResizeStatus = avatarData.avatarResizeStatus ?? 'none';
    this.logger.debug(
      `🔧 Updating avatarKey (id: ${id}) (${avatarData.avatarResizeStatus})`,
      UserService.name,
    );
    const user = await this.userRepo.updateAvatar(id, avatarData);
    this.logger.debug(`✅ User AvatarKey updated (id: ${id})`, UserService.name);
    return user;
  }

  async updateUser(id: number, data: UpdateUserDto) {}
  async changePassword(id: number, password: string) {}
}
