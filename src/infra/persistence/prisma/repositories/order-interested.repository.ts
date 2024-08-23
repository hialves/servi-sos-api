import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderInterested } from '../../../../domain/entities/order-interested';
import { OrderInterestedMapper } from '../mappers/order-interested.mapper';
import { ExternalID, ID } from '../../../../domain/entities';

@Injectable()
export class OrderInterestedPrismaRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.orderInterested;
  }

  async create(input: OrderInterested) {
    const raw = OrderInterestedMapper.toPrisma(input);
    const result = await this.prisma.$transaction(async (tx) => {
      return tx.orderInterested.create({
        data: raw,
      });
    });

    return OrderInterestedMapper.toDomain(result);
  }

  async save(input: OrderInterested) {
    const raw = OrderInterestedMapper.toPrisma(input);
    await this.repository.update({
      where: { orderId_serviceProviderId: { orderId: raw.orderId, serviceProviderId: raw.serviceProviderId } },
      data: raw,
    });
  }

  async findByUnique(input: { orderId: ID; serviceProviderId: ID }): Promise<OrderInterested | null> {
    const result = await this.repository.findUnique({ where: { orderId_serviceProviderId: input } });
    if (result) return OrderInterestedMapper.toDomain(result);
    return null;
  }

  getInterestedServiceProviders(externalOrderId: ExternalID) {
    return this.repository.findMany({
      where: { order: { externalId: externalOrderId } },
      include: { serviceProvider: true },
    });
  }

  getSentInterestedOrders(serviceProviderId: ID) {
    return this.repository.findMany({
      where: { serviceProviderId },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
