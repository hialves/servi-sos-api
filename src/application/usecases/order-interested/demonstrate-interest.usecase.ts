import { Injectable } from '@nestjs/common';
import { OrderInterested } from '../../../domain/entities/order-interested';
import { OrderInterestedPrismaRepository } from '../../../infra/persistence/prisma/repositories/order-interested.repository';
import { DemonstrateInterestDto } from '../../order-interested/demonstrate-interest.dto';
import { ID } from '../../../domain/entities';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { AdminRepository } from '../../repositories/admin-repository.interface';

@Injectable()
export class DemonstrateInterestUsecase {
  constructor(
    private repository: OrderInterestedPrismaRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute(dto: DemonstrateInterestDto, userId: ID) {
    const serviceProvider = await this.adminRepository.getByUserId(userId);
    if (!serviceProvider) return new ApplicationError(responseMessages.user.notAdmin);

    const exists = await this.repository.findByUnique({ orderId: dto.orderId, serviceProviderId: serviceProvider.id });
    if (exists) {
      const isNewPrice = exists.isNewPrice(dto.givenPrice);
      exists.changePrice(dto.givenPrice);
      isNewPrice && (await this.repository.save(exists));
      return exists;
    }

    const entity = new OrderInterested({
      givenPrice: dto.givenPrice,
      orderId: dto.orderId,
      serviceProviderId: serviceProvider.id,
    });
    return this.repository.create(entity);
  }
}
