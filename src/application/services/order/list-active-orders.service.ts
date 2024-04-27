import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../repositories/order-repository.interface';
import { Location } from '../../../domain/valueobjects/location.value-object';

@Injectable()
export class ListActiveOrdersService {
  constructor(private orderRepository: OrderRepository) {}

  async execute(coords: Location) {
    // return this.orderRepository.activeOrders(coords, 30);
  }
}
