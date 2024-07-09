import { HttpStatus, Injectable } from '@nestjs/common';
import { ExternalID } from '../../domain/entities';
import { ApplicationError } from '../errors/application-error';
import { responseMessages } from '../messages/response.messages';
import { OrderRepository } from '../repositories/order-repository.interface';
import { Order } from '../../domain/entities/order';
import { UpdateOrderDto } from '../../presentation/dto/order/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private repository: OrderRepository) {}

  async update(externalId: ExternalID, updateData: UpdateOrderDto): Promise<Order | ApplicationError> {
    const existsOrder = await this.repository.findByExternalId(externalId);
    if (!existsOrder)
      return new ApplicationError(responseMessages.notFound(responseMessages.order), HttpStatus.NOT_FOUND);

    const order = new Order({
      ...existsOrder,
      ...updateData,
    });

    return this.repository.update(order);
  }
}
