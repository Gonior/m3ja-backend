import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FileValidationPipe, JsonBody, UploadType } from '@app/common';
import { UploadConfigs } from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EVENT } from '@app/shared';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Register akun')
@Controller('register')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Register user akun baru' })
  @Post()
  async register(@Body() data: CreateUserDto) {
    return await this.registrationService.register(data);
  }
}
