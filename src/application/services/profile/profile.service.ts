import { HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { responseMessages } from '../../messages/response.messages';
import { ApplicationError } from '../../errors/application-error';
import { AdminRepository } from '../../repositories/admin-repository.interface';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ID } from '../../../domain/entities';
import { UserRepository } from '../../repositories/user-repository.interface';

export class ProfileService {
  constructor(
    private userRepository: UserRepository,
    private adminRepository: AdminRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async getProfile(userId: ID) {
    const user = await this.userRepository.findById(userId);
    if (!user) return this.notFoundError();

    if (user.role && [Role.admin, Role.manager, Role.super_admin].includes(user.role as any)) {
      const admin = await this.adminRepository.getByUserId(userId);
      return { ...admin, user };
    }

    if (user.role === Role.customer) {
      const customer = await this.customerRepository.getByUserId(userId);
      return { ...customer, user };
    }

    return this.notFoundError();
  }

  private notFoundError() {
    return new ApplicationError(
      responseMessages.notFound(responseMessages.user.entity),
      undefined,
      HttpStatus.NOT_FOUND,
    );
  }
}
