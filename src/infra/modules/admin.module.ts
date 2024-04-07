import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { AdminService } from '../../application/services/admin/admin.service';
import { AdminController } from '../../presentation/controllers/admin.controller';
import { AdminRepository } from '../../application/repositories/admin-repository.interface';
import { PasswordService } from '../auth/password.service';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [PrismaModule, AuthModule, RepositoryModule],
  providers: [
    {
      provide: AdminService,
      useFactory: (adminRepository: AdminRepository, passwordService: PasswordService) => {
        return new AdminService(adminRepository, passwordService);
      },
      inject: [AdminRepository, PasswordService],
    },
  ],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
