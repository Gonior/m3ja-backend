import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { FileValidationPipe, JsonBody, UploadType } from '@app/common';
import { UploadConfigs } from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EVENT } from '@app/shared';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Register akun')
@Controller('register')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          example: JSON.stringify({
            displayName: 'Nom Rekayasa',
            email: 'nom.test@example.com',
            password: 'strongpassword',
          }),
          description:
            'JSON.stringify() berisi data registrasi { displayName : string, email : string, password : string }',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File avatar user opsional',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Register user akun baru (dengan avatar opsional)' })
  @Post()
  @UploadType({ type: 'avatar' })
  async register(
    @JsonBody('data') data: CreateUserDto,
    @UploadedFile(
      new FileValidationPipe({ ...UploadConfigs.avatar, optional: true }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.registrationService.register(data, file);
  }
}
