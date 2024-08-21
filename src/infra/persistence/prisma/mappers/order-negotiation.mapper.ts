import { OrderInterested as RawOrderInterested, Order as RawOrder } from '@prisma/client';
import { OrderNegotiation } from '../../../../domain/entities/order-negotiation';
import { OrderMapper } from './order.mapper';
import { OrderInterestedMapper } from './order-interested.mapper';

export class OrderNegotiationMapper {
  static toPrisma(entity: OrderNegotiation) {
    return {
      order: OrderMapper.toPrisma(entity.order),
      orderInterested: OrderInterestedMapper.toPrisma(entity.orderInterested),
    };
  }

  static toDomain(rawOrder: RawOrder, rawInterested: RawOrderInterested): OrderNegotiation {
    return new OrderNegotiation(OrderMapper.toDomain(rawOrder), OrderInterestedMapper.toDomain(rawInterested));
  }
}
