import { ExternalID, ID } from '../../domain/entities';
import { Order } from '../../domain/entities/order';
import { CreateOrderDto } from '../usecases/order/create-order.dto';

export abstract class OrderRepository {
  abstract createOrder(input: CreateOrderDto): Promise<Order>;
  abstract findById(id: ID): Promise<Order | null>;
  abstract findByExternalId(externalId: ExternalID): Promise<Order | null>;
  abstract delete(externalId: ExternalID): Promise<void>;
  abstract update(input: Order): Promise<Order>;
}
