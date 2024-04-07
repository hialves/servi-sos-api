import { Module } from '@nestjs/common';
import { AppController } from './presentation/controllers/app.controller';
import { CustomerModule } from './infra/modules/customer.module';
import { AuthModule } from './infra/modules/auth.module';
import { NodeMailerModule } from './infra/frameworks/mail/nodemailer.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './infra/security/guards/auth.guard';
import { CacheModule } from './infra/frameworks/cache/cache.module';
import { AssetModule } from './infra/modules/asset.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { RolesGuard } from './infra/security/guards/roles.guard';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor';
import { ProfileModule } from './infra/modules/profile.module';
import { RepositoryModule } from './infra/modules/repository.module';
import { AdminModule } from './infra/modules/admin.module';
import { RateLimitModule } from './infra/security/rate-limit.module';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    RateLimitModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register(),
    AuthModule,
    CustomerModule,
    NodeMailerModule,
    CacheModule,
    AssetModule,
    ProfileModule,
    RepositoryModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
