import { Module } from '@nestjs/common';
import { ProfileController } from '../../presentation/controllers/profile.controller';
import { ProfileService } from '../../application/services/profile/profile.service';
import { UserRepository } from '../../application/repositories/user-repository.interface';
import { AdminRepository } from '../../application/repositories/admin-repository.interface';
import { CustomerRepository } from '../../application/repositories/customer-repository.interface';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: ProfileService,
      useFactory: (
        userRepository: UserRepository,
        adminRepository: AdminRepository,
        customerRepository: CustomerRepository,
      ) => {
        return new ProfileService(userRepository, adminRepository, customerRepository);
      },
      inject: [UserRepository, AdminRepository, CustomerRepository],
    },
  ],
})
export class ProfileModule {}
