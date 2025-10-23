import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { FileValidationPipe, JsonBody, UploadType } from '@app/common';
import { UploadConfigs } from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WORKER_UPLOAD_DONE } from '@app/shared';
@Controller('register')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @UploadType({ type: 'avatar' })
  async register(
    @JsonBody('data') createUserDto: CreateUserDto,
    @UploadedFile(new FileValidationPipe({ ...UploadConfigs.avatar, optional: true }))
    file?: Express.Multer.File,
  ) {
    return await this.registrationService.register(createUserDto, file);
  }

  @EventPattern(WORKER_UPLOAD_DONE)
  handleDone(@Payload() data: any) {
    console.log({ form: 'api', data });
  }
}
