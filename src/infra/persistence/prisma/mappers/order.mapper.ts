import { Order as RawOrder } from '@prisma/client';
import { Order } from '../../../../domain/entities/order';
import { Location } from '../../../../domain/valueobjects/location.value-object';

export class OrderMapper {
  static toPrisma(order: Order): RawOrder {
    return {
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      categoryId: order.categoryId,
      customerId: order.customerId,
      serviceProviderId: order.serviceProviderId,
      lat: order.location.lat,
      long: order.location.long,
      done: order.done,
      price: order.price,
      agreedPrice: order.agreedPrice,
      externalId: order.externalId,
      description: order.description,
      paymentGatewayOrderId: order.paymentGatewayOrderId,
      paymentStatus: order.paymentStatus,
      published: order.published,
      publishedAt: order.publishedAt,
    };
  }

  static toDomain(raw: RawOrder): Order {
    return new Order({
      id: raw.id,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      categoryId: raw.categoryId,
      customerId: raw.customerId,
      serviceProviderId: raw.serviceProviderId,
      location: new Location({ lat: raw.lat, long: raw.long }),
      done: raw.done,
      price: raw.price,
      agreedPrice: raw.agreedPrice,
      externalId: raw.externalId,
      description: raw.description,
      paymentGatewayOrderId: raw.paymentGatewayOrderId,
      paymentStatus: raw.paymentStatus,
      published: raw.published,
      publishedAt: raw.publishedAt,
    });
  }
}
