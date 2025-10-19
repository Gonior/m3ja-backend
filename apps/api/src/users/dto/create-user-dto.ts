import {
  ERROR_MESSAGE_INVALID_EMAIL,
  MAX_LENGTH_DISPLAY_NAME,
  MAX_LENGTH_EMAIL,
  MIN_LENGTH_DISPLAY_NAME,
  MIN_LENGTH_PASSWORD,
} from '@app/shared';
import { isEmptyError, maxError, minError } from '@app/shared/helper/validation-message';
import { TUser } from '@app/shared';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto implements Omit<TUser, 'id' | 'createdAt' | 'updatedAt'> {
  @MinLength(MIN_LENGTH_DISPLAY_NAME, {
    message: minError('display name', MIN_LENGTH_DISPLAY_NAME),
  })
  @MaxLength(MAX_LENGTH_DISPLAY_NAME, {
    message: maxError('display name', MAX_LENGTH_DISPLAY_NAME),
  })
  @IsNotEmpty({ message: isEmptyError('display name') })
  displayName: string;

  @IsEmail({}, { message: ERROR_MESSAGE_INVALID_EMAIL })
  @MaxLength(MAX_LENGTH_EMAIL, { message: maxError('email', MAX_LENGTH_EMAIL) })
  @IsNotEmpty({ message: isEmptyError('email') })
  email: string;

  @MinLength(MIN_LENGTH_PASSWORD, { message: minError('password', MIN_LENGTH_PASSWORD) })
  @IsNotEmpty({ message: isEmptyError('password') })
  password: string;

  @IsOptional()
  profilePictureUrl: string | null;
}
