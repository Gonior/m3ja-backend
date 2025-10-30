import {
  MAX_LENGTH_DISPLAY_NAME,
  MAX_LENGTH_EMAIL,
  MIN_LENGTH_DISPLAY_NAME,
  MIN_LENGTH_PASSWORD,
} from '@app/shared';
import { TUser } from '@app/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto
  implements
    Omit<TUser, 'id' | 'createdAt' | 'updatedAt' | 'avatarResizeStatus'>
{
  @ApiProperty({
    example: 'nom.rekayasa@example.com',
    description: 'Alamat email pengguna',
  })
  @MinLength(MIN_LENGTH_DISPLAY_NAME, {
    context: { min: MIN_LENGTH_DISPLAY_NAME },
  })
  @MaxLength(MAX_LENGTH_DISPLAY_NAME, {
    context: { max: MAX_LENGTH_DISPLAY_NAME },
  })
  @IsNotEmpty()
  displayName: string;

  @IsEmail()
  @MaxLength(MAX_LENGTH_EMAIL, { context: { max: MAX_LENGTH_EMAIL } })
  @IsNotEmpty()
  email: string;

  @MinLength(MIN_LENGTH_PASSWORD, { context: { min: MIN_LENGTH_PASSWORD } })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  avatarKey: string | null;
}
