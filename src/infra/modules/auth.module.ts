import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth/auth.service';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { PasswordService } from '../auth/password.service';
import { CacheModule } from '../frameworks/cache/cache.module';
import { SessionService } from '../auth/session.service';
import { RepositoryModule } from './repository.module';
import { MailService } from '../../application/interfaces/mail-service.interface';
import { UserPrismaRepository } from '../persistence/prisma/repositories/user.repository';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { PrismaModule } from '../persistence/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    RepositoryModule,
    CacheModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
          global: false,
          signOptions: { expiresIn: configService.get('JWT_ACCESS_TOKEN_DURATION') },
        };
      },
    }),
  ],
  providers: [
    {
      provide: AuthService,
      useFactory: (
        mailService: MailService,
        prismaService: PrismaService,
        sessionService: SessionService,
        passwordService: PasswordService,
      ) => {
        return new AuthService(mailService, new UserPrismaRepository(prismaService), sessionService, passwordService);
      },
      inject: [
        MailService,
        { token: PrismaService, prototype: UserPrismaRepository, optional: false },
        SessionService,
        PasswordService,
      ],
    },
    SessionService,
    { provide: PasswordService, useValue: new PasswordService(12) },
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
