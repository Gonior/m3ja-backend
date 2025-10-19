import {
  ERROR_MESSAGE_INVALID_EMAIL,
  MAX_LENGTH_DISPLAY_NAME,
  MAX_LENGTH_EMAIL,
  MIN_LENGTH_DISPLAY_NAME,
  MIN_LENGTH_PASSWORD,
} from '@app/shared';
import {
  isEmptyErrorMessage,
  maxErrorMessage,
  minErrorMessage,
} from '@app/shared/helper/validation-message';
import { TUser } from '@app/shared';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto implements Omit<TUser, 'id' | 'createdAt' | 'updatedAt'> {
  @MinLength(MIN_LENGTH_DISPLAY_NAME, {
    message: minErrorMessage('display name', MIN_LENGTH_DISPLAY_NAME),
  })
  @MaxLength(MAX_LENGTH_DISPLAY_NAME, {
    message: maxErrorMessage('display name', MAX_LENGTH_DISPLAY_NAME),
  })
  @IsNotEmpty({ message: isEmptyErrorMessage('display name') })
  displayName: string;

  @IsEmail({}, { message: ERROR_MESSAGE_INVALID_EMAIL })
  @MaxLength(MAX_LENGTH_EMAIL, { message: maxErrorMessage('email', MAX_LENGTH_EMAIL) })
  @IsNotEmpty({ message: isEmptyErrorMessage('email') })
  email: string;

  @MinLength(MIN_LENGTH_PASSWORD, { message: minErrorMessage('password', MIN_LENGTH_PASSWORD) })
  @IsNotEmpty({ message: isEmptyErrorMessage('password') })
  password: string;

  @IsOptional()
  profilePictureUrl: string | null;
}
