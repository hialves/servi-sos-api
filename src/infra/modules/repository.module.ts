import { Module } from '@nestjs/common';
import { UserRepository } from '../../application/repositories/user-repository.interface';
import { UserPrismaRepository } from '../persistence/prisma/repositories/user.repository';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { AdminRepository } from '../../application/repositories/admin-repository.interface';
import { AdminPrismaRepository } from '../persistence/prisma/repositories/admin.repository';
import { CustomerRepository } from '../../application/repositories/customer-repository.interface';
import { CustomerPrismaRepository } from '../persistence/prisma/repositories/customer.repository';
import { CategoryRepository } from '../../application/repositories/category-repository.interface';
import { CategoryPrismaRepository } from '../persistence/prisma/repositories/category.repository';

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
    {
      provide: CategoryRepository,
      useClass: CategoryPrismaRepository,
    },
  ],
  exports: [UserRepository, AdminRepository, CustomerRepository, CategoryRepository],
})
export class RepositoryModule {}
