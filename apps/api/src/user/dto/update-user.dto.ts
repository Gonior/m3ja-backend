import {
  MAX_LENGTH_DISPLAY_NAME,
  MAX_LENGTH_EMAIL,
  MIN_LENGTH_DISPLAY_NAME,
  MIN_LENGTH_PASSWORD,
} from '@app/shared';

import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
export class UpdateUserDto implements Partial<CreateUserDto> {
  @IsOptional()
  @MinLength(MIN_LENGTH_DISPLAY_NAME, { context: { min: MIN_LENGTH_DISPLAY_NAME } })
  @MaxLength(MAX_LENGTH_DISPLAY_NAME, { context: { min: MAX_LENGTH_DISPLAY_NAME } })
  @IsNotEmpty()
  displayName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(MAX_LENGTH_EMAIL, { context: { max: MAX_LENGTH_EMAIL } })
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(MIN_LENGTH_PASSWORD, { context: { min: MIN_LENGTH_PASSWORD } })
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsOptional()
  avatarKey?: string | null;
}
