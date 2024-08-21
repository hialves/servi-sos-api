import { Injectable } from '@nestjs/common';
import { OrderInterested } from '../../../domain/entities/order-interested';
import { OrderInterestedPrismaRepository } from '../../../infra/persistence/prisma/repositories/order-interested.repository';
import { DemonstrateInterestDto } from '../../order-interested/demonstrate-interest.dto';
import { ID } from '../../../domain/entities';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { AdminRepository } from '../../repositories/admin-repository.interface';
import { OrderRepository } from '../../repositories/order-repository.interface';

@Injectable()
export class DemonstrateInterestUsecase {
  constructor(
    private repository: OrderInterestedPrismaRepository,
    private adminRepository: AdminRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute(dto: DemonstrateInterestDto, userId: ID) {
    const serviceProvider = await this.adminRepository.getByUserId(userId);
    if (!serviceProvider) return new ApplicationError(responseMessages.user.notAdmin);
    const order = await this.orderRepository.findByExternalId(dto.externalOrderId);
    if (!order) return new ApplicationError(responseMessages.notFound(responseMessages.order));

    const newPrice = dto.givenPrice * 100;
    const exists = await this.repository.findByUnique({ orderId: order.id, serviceProviderId: serviceProvider.id });
    if (exists) {
      const isNewPrice = exists.isNewPrice(newPrice);
      exists.changePrice(newPrice);
      isNewPrice && (await this.repository.save(exists));
      return exists;
    }

    const entity = new OrderInterested({
      givenPrice: newPrice,
      orderId: order.id,
      serviceProviderId: serviceProvider.id,
    });
    return this.repository.create(entity);
  }
}
