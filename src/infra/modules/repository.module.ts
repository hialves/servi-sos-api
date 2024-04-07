import { Module } from '@nestjs/common';
import { UserRepository } from '../../application/repositories/user-repository.interface';
import { UserPrismaRepository } from '../persistence/prisma/repositories/user.repository';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { AdminRepository } from '../../application/repositories/admin-repository.interface';
import { AdminPrismaRepository } from '../persistence/prisma/repositories/admin.repository';
import { CustomerRepository } from '../../application/repositories/customer-repository.interface';
import { CustomerPrismaRepository } from '../persistence/prisma/repositories/customer.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    {
      provide: AdminRepository,
      useClass: AdminPrismaRepository,
    },
    {
      provide: CustomerRepository,
      useClass: CustomerPrismaRepository,
    },
  ],
  exports: [UserRepository, AdminRepository, CustomerRepository],
})
export class RepositoryModule {}
