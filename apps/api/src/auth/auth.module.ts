import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EnvService } from '@app/common/config/env.config.service';
import { JwtAuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { UserTokenRepository } from './user-token/user-token.repository';
import { TTL } from '@app/shared';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        return {
          secret: env.secretConfig.jwtAccessSecret,
          signOptions: { expiresIn: TTL.STR_ACCESS_TOKEN },
        };
      },
    }),
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy, UserTokenRepository],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
