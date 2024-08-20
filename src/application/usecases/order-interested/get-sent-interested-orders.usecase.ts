import { Injectable } from '@nestjs/common';
import { OrderInterestedPrismaRepository } from '../../../infra/persistence/prisma/repositories/order-interested.repository';
import { ID } from '../../../domain/entities';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { AdminRepository } from '../../repositories/admin-repository.interface';

@Injectable()
export class GetSentInterestedOrdersUsecase {
  constructor(
    private repository: OrderInterestedPrismaRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute(userId: ID) {
    const serviceProvider = await this.adminRepository.getByUserId(userId);
    if (!serviceProvider) return new ApplicationError(responseMessages.user.notAdmin);

    return this.repository.getSentInterestedOrders(serviceProvider.id);
  }
}
