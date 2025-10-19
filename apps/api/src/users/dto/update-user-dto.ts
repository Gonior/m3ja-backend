import {
  ERROR_MESSAGE_INVALID_EMAIL,
  MAX_LENGTH_DISPLAY_NAME,
  MAX_LENGTH_EMAIL,
  MIN_LENGTH_DISPLAY_NAME,
  MIN_LENGTH_PASSWORD,
} from '@app/shared';
import { maxErrorMessage, minErrorMessage } from '@app/shared/helper/validation-message';
import { CreateUserDto } from './create-user-dto';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
export class UpdateUserDto implements Partial<CreateUserDto> {
  @IsOptional()
  @IsNotEmpty()
  @MinLength(MIN_LENGTH_DISPLAY_NAME, {
    message: minErrorMessage('display name', MIN_LENGTH_DISPLAY_NAME),
  })
  @MaxLength(MAX_LENGTH_DISPLAY_NAME, {
    message: maxErrorMessage('display name', MAX_LENGTH_DISPLAY_NAME),
  })
  displayName?: string;

  @IsOptional()
  @IsEmail({}, { message: ERROR_MESSAGE_INVALID_EMAIL })
  @MaxLength(MAX_LENGTH_EMAIL, { message: maxErrorMessage('email', MAX_LENGTH_EMAIL) })
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(MIN_LENGTH_PASSWORD, { message: minErrorMessage('password', MIN_LENGTH_PASSWORD) })
  password?: string;

  @IsOptional()
  @IsOptional()
  profilePictureUrl?: string | null;
}
