import { IsEmail, IsNotEmpty } from 'class-validator';
import { isEmptyErrorMessage, emailErrorMessage } from '@app/shared';
export class AuthDto {
  @IsEmail({}, { message: emailErrorMessage({ field: 'email' }) })
  @IsNotEmpty({ message: isEmptyErrorMessage({ field: 'email' }) })
  email: string;

  @IsNotEmpty({ message: isEmptyErrorMessage({ field: 'password' }) })
  password: string;
}
