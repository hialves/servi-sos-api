import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ExternalID, ID } from '../../../../domain/entities';
import { OrderNegotiationMapper } from '../mappers/order-negotiation.mapper';
import { OrderNegotiation } from '../../../../domain/entities/order-negotiation';

@Injectable()
export class OrderNegotiationPrismaRepository {
  constructor(private prisma: PrismaService) {}

  async save(input: OrderNegotiation) {
    const raw = OrderNegotiationMapper.toPrisma(input);
    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: raw.order.id },
        data: raw.order,
      }),
      this.prisma.orderInterested.update({
        where: {
          orderId_serviceProviderId: {
            orderId: raw.orderInterested.orderId,
            serviceProviderId: raw.orderInterested.serviceProviderId,
          },
        },
        data: raw.orderInterested,
      }),
    ]);
  }

  async findNegotiation(input: { externalOrderId: ExternalID; userId: ID }): Promise<OrderNegotiation | null> {
    const result = await this.prisma.orderInterested.findFirst({
      where: { order: { externalId: input.externalOrderId }, serviceProvider: { userId: input.userId } },
      include: { order: true },
    });

    if (result) {
      const { order, ...orderInterested } = result;
      return OrderNegotiationMapper.toDomain(order, orderInterested);
    }
    return null;
  }
}
