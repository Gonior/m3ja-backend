import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AuthDto {
  @ApiProperty({
    example: 'nom.test@example.com',
    description: 'Alamat email pengguna',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongpassword',
    description: 'kata sandi pengguna',
  })
  @IsNotEmpty()
  password: string;
}
