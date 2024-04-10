import { ExternalID } from '../../domain/entities';
import { Order } from '../../domain/entities/order';

export abstract class OrderRepository {
  abstract customerOrders(customerExternalId: ExternalID): Promise<Order[]>;
  abstract serviceProviderOrders(serviceProviderExternalId: ExternalID): Promise<Order[]>;
  abstract findById(externalId: ExternalID): Promise<Order | null>;
  abstract cancelOrder(externalId: ExternalID): Promise<Order | null>;
  abstract unassignServiceProvider(serviceProviderExternalId: ExternalID): Promise<Order | null>;
}
