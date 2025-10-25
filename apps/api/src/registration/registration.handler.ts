import { EVENT, type IUploadEvent } from '@app/shared';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';
import { AppLogger } from '@app/common';

@Controller()
export class RegistrationHandler {
  constructor(
    private readonly userService: UsersService,
    private readonly logger: AppLogger,
  ) {}
  @EventPattern(EVENT.WORKER_UPLOAD_DONE)
  async handleDone(@Payload() data: IUploadEvent) {
    this.logger.debug(
      `receive resize image from worker with user id ${data.userId}`,
      RegistrationHandler.name,
    );
    if (data && data.userId && data.key) {
      await this.userService.updateAvatar(data.userId, data.key);
    }
  }
}
