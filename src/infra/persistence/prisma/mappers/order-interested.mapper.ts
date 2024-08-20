import { Prisma, OrderInterested as RawOrderInterested } from '@prisma/client';
import { AcceptanceStatus, OrderInterested } from '../../../../domain/entities/order-interested';
import { Replace } from '../../../../helper/replace';

type ParsedRawOrderInterested = Replace<RawOrderInterested, { history: Prisma.JsonArray }>;

export class OrderInterestedMapper {
  static toPrisma(entity: OrderInterested): ParsedRawOrderInterested {
    return {
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      givenPrice: entity.givenPrice,
      history: entity.history.map((item) => ({ date: item.date, price: item.price })),
      orderId: entity.orderId,
      serviceProviderId: entity.serviceProviderId,
      acceptanceStatus: entity.acceptanceStatus,
    };
  }

  static toDomain(raw: RawOrderInterested): OrderInterested {
    return new OrderInterested({
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      givenPrice: raw.givenPrice,
      history: (raw.history as { date: string; price: number }[]).map((item) => ({
        date: item.date,
        price: item.price,
      })),
      orderId: raw.orderId,
      serviceProviderId: raw.serviceProviderId,
      acceptanceStatus: raw.acceptanceStatus as AcceptanceStatus,
    });
  }
}
