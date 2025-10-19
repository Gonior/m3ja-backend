import { IsEmail, IsNotEmpty } from 'class-validator';
import { isEmptyErrorMessage, emailErrorMessage } from '@app/shared';
export class AuthDto {
  @IsEmail({}, { message: emailErrorMessage })
  @IsNotEmpty({ message: isEmptyErrorMessage('email') })
  email: string;

  @IsNotEmpty({ message: isEmptyErrorMessage('password') })
  password: string;
}
