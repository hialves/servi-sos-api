import { HttpStatus, Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { AppConfig } from '../../../infra/config/app.config';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { OrderRepository } from '../../repositories/order-repository.interface';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class CreateOrderService {
  constructor(
    private orderRepository: OrderRepository,
    private appConfig: AppConfig,
    private customerRepository: CustomerRepository,
  ) {}

  async execute(input: CreateOrderDto, userId: ID) {
    const customer = await this.customerRepository.getByUserId(userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.NOT_ACCEPTABLE);

    input.setPrice(this.appConfig.getOrderPrice()).setCustomer(customer.id);

    return this.orderRepository.createOrder(input);
  }
}
