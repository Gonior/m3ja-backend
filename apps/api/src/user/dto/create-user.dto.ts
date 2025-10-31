import {
  MAX_LENGTH_DISPLAY_NAME,
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_USERNAME,
  MIN_LENGTH_DISPLAY_NAME,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_USERNAME,
} from '@app/shared';
import { TUser } from '@app/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto
  implements Omit<TUser, 'id' | 'createdAt' | 'updatedAt' | 'avatarResizeStatus' | 'avatarKey'>
{
  @ApiProperty({
    example: 'Nom Rekayasa',
    description: 'Nama yang akan ditampilkan',
  })
  @MinLength(MIN_LENGTH_DISPLAY_NAME, {
    context: { min: MIN_LENGTH_DISPLAY_NAME },
  })
  @MaxLength(MAX_LENGTH_DISPLAY_NAME, {
    context: { max: MAX_LENGTH_DISPLAY_NAME },
  })
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    example: 'nom.rekayasa@example.com',
    description: 'Alamat email pengguna',
  })
  @IsEmail()
  @MaxLength(MAX_LENGTH_EMAIL, { context: { max: MAX_LENGTH_EMAIL } })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'nom.rekayasa',
    description: 'username',
  })
  // penjelasan regex:
  // ^(?!.*[_.]{2}) tidak boleh dua simbol underscore (_) dan dot (.) berurutan
  // (?![.]) tidak boleh diawali simbol dot (.)
  // (?!.*[.]$) tidak boleh diakhiri dengan simbol dot (.)
  // [a-zA-Z0-9._]{3,30} hanya boleh huruf (besar/kecil), angka, underscore (_) dan dot (.) dengan minimal 3-30 karakter.
  @MaxLength(MAX_LENGTH_USERNAME, { context: { max: MAX_LENGTH_USERNAME } })
  @MinLength(MIN_LENGTH_USERNAME, { context: { min: MIN_LENGTH_USERNAME } })
  @Matches(/^(?!.*[_.]{2})(?![.])(?!.*[.]$)[a-zA-Z0-9._]{3,30}$/)
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'str@ngPassw000rdd',
    description: 'Kata sandi anda',
  })
  @MinLength(MIN_LENGTH_PASSWORD, { context: { min: MIN_LENGTH_PASSWORD } })
  @IsNotEmpty()
  password: string;
}
