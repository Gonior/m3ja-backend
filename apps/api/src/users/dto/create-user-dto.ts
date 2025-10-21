import {
  MAX_LENGTH_DISPLAY_NAME,
  MAX_LENGTH_EMAIL,
  MIN_LENGTH_DISPLAY_NAME,
  MIN_LENGTH_PASSWORD,
} from '@app/shared';
import {
  isEmptyErrorMessage,
  maxErrorMessage,
  minErrorMessage,
  emailErrorMessage,
} from '@app/shared/helper/validation-message';
import { TUser } from '@app/shared';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto implements Omit<TUser, 'id' | 'createdAt' | 'updatedAt'> {
  @MinLength(MIN_LENGTH_DISPLAY_NAME, {
    message: minErrorMessage({ field: 'display name', value: MIN_LENGTH_DISPLAY_NAME }),
  })
  @MaxLength(MAX_LENGTH_DISPLAY_NAME, {
    message: maxErrorMessage({ field: 'display name', value: MAX_LENGTH_DISPLAY_NAME }),
  })
  @IsNotEmpty({ message: isEmptyErrorMessage({ field: 'display name' }) })
  displayName: string;

  @IsEmail({}, { message: emailErrorMessage({ field: 'email' }) })
  @MaxLength(MAX_LENGTH_EMAIL, {
    message: maxErrorMessage({ field: 'email', value: MAX_LENGTH_EMAIL }),
  })
  @IsNotEmpty({ message: isEmptyErrorMessage({ field: 'email' }) })
  email: string;

  @MinLength(MIN_LENGTH_PASSWORD, {
    message: minErrorMessage({ field: 'password', value: MIN_LENGTH_PASSWORD }),
  })
  @IsNotEmpty({ message: isEmptyErrorMessage({ field: 'password' }) })
  password: string;

  @IsOptional()
  profilePictureUrl: string | null;
}
