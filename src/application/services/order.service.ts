import { HttpStatus, Injectable } from '@nestjs/common';
import { ExternalID } from '../../domain/entities';
import { ApplicationError } from '../errors/application-error';
import { responseMessages } from '../messages/response.messages';
import { OrderRepository } from '../repositories/order-repository.interface';
import { Order } from '../../domain/entities/order';
import { UpdateOrderDto } from '../../presentation/dto/order/update-order.dto';
import { Location } from '../../domain/valueobjects/location.value-object';

@Injectable()
export class OrderService {
  constructor(private repository: OrderRepository) {}

  async update(externalId: ExternalID, updateData: UpdateOrderDto): Promise<Order | ApplicationError> {
    const order = await this.repository.findByExternalId(externalId);
    if (!order) return new ApplicationError(responseMessages.notFound(responseMessages.order), HttpStatus.NOT_FOUND);

    if (updateData.categoryId !== undefined) order.categoryId;
    if (updateData.description !== undefined) order.description;
    if (updateData.lat !== undefined && updateData.long !== undefined)
      order.location = new Location({ lat: updateData.lat, long: updateData.long });

    return this.repository.update(order);
  }
}
