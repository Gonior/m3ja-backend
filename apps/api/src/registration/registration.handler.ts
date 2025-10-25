import { EVENT, type IUploadEvent } from '@app/shared';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserService } from '../user/user.service';
import { AppLogger } from '@app/common';

@Controller()
export class RegistrationHandler {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {}
  @EventPattern(EVENT.WORKER_UPLOAD_DONE)
  async handleDone(@Payload() data: IUploadEvent) {
    this.logger.debug(
      `➡️ Receive new avatar from worker (id: ${data.userId})`,
      RegistrationHandler.name,
    );
    if (data && data.userId && data.key) {
      await this.userService.updateAvatar(data.userId, data.key);
    }
  }
}
