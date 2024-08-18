import { Global, Module } from '@nestjs/common';
import { UserRepository } from '../../application/repositories/user-repository.interface';
import { UserPrismaRepository } from '../persistence/prisma/repositories/user.repository';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { AdminRepository } from '../../application/repositories/admin-repository.interface';
import { AdminPrismaRepository } from '../persistence/prisma/repositories/admin.repository';
import { CustomerRepository } from '../../application/repositories/customer-repository.interface';
import { CustomerPrismaRepository } from '../persistence/prisma/repositories/customer.repository';
import { CategoryRepository } from '../../application/repositories/category-repository.interface';
import { CategoryPrismaRepository } from '../persistence/prisma/repositories/category.repository';
import { OrderRepository } from '../../application/repositories/order-repository.interface';
import { OrderPrismaRepository } from '../persistence/prisma/repositories/order.repository';
import { OrderListRepository } from '../../application/repositories/order-list-repository.interface';
import { OrderListPrismaRepository } from '../persistence/prisma/repositories/order-list.repository';
import { ServiceProviderCategoryPrismaRepository } from '../persistence/prisma/repositories/service-provider-category.repository';
import { ServiceProviderCategoryRepository } from '../../application/repositories/service-provider-category.interface';
import { ServiceProviderConfigRepository } from '../../application/repositories/service-provider-config.interface';
import { ServiceProviderConfigPrismaRepository } from '../persistence/prisma/repositories/service-provider-config.repository';
import { OrderInterestedPrismaRepository } from '../persistence/prisma/repositories/order-interested.repository';

@Global()
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
    {
      provide: OrderRepository,
      useClass: OrderPrismaRepository,
    },
    {
      provide: OrderListRepository,
      useClass: OrderListPrismaRepository,
    },
    {
      provide: ServiceProviderCategoryRepository,
      useClass: ServiceProviderCategoryPrismaRepository,
    },
    {
      provide: ServiceProviderConfigRepository,
      useClass: ServiceProviderConfigPrismaRepository,
    },
    {
      provide: OrderInterestedPrismaRepository,
      useClass: OrderInterestedPrismaRepository,
    },
  ],
  exports: [
    UserRepository,
    AdminRepository,
    CustomerRepository,
    CategoryRepository,
    OrderRepository,
    OrderListRepository,
    ServiceProviderCategoryRepository,
    ServiceProviderConfigRepository,
    OrderInterestedPrismaRepository,
  ],
})
export class RepositoryModule {}
