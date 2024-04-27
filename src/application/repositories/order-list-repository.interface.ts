import { Prisma } from '@prisma/client';
import { ExternalID, ID } from '../../domain/entities';
import { Location } from '../../domain/valueobjects/location.value-object';

export type OrderFullPayload = Prisma.OrderGetPayload<{
  include: { category: true; customer: true; serviceProvider: true };
}>;

export abstract class OrderListRepository {
  abstract customerOrders(customerExternalId: ExternalID): Promise<OrderFullPayload[]>;
  abstract serviceProviderOrders(serviceProviderExternalId: ExternalID): Promise<OrderFullPayload[]>;
  abstract activeOrders(coords: Location, range: number, filters: { categoryId?: ID }): Promise<OrderFullPayload[]>;
}
