import { HttpStatus, Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { AppConfig } from '../../../infra/config/app.config';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { OrderRepository } from '../../repositories/order-repository.interface';
import { CreateOrderDto } from './create-order.dto';
import { Location } from '../../../domain/valueobjects/location.value-object';
import { Order } from '../../../domain/entities/order';
import { ServiceProviderNotifier } from '../../../domain/services/service-provider-notifier';

@Injectable()
export class CreateOrderUsecase {
  constructor(
    private orderRepository: OrderRepository,
    private appConfig: AppConfig,
    private customerRepository: CustomerRepository,
    private serviceProviderNotifier: ServiceProviderNotifier,
  ) {}

  async execute(input: CreateOrderDto, userId: ID) {
    const customer = await this.customerRepository.getByUserId(userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.NOT_ACCEPTABLE);

    input.setPrice(this.appConfig.getOrderPrice()).setCustomer(customer.id);

    const createdOrder = await this.orderRepository.createOrder(input);

    return createdOrder;
  }

  async notifyCategories(order: Order, referencePoint: Location, meters: number, categoryId: ID) {
    await this.serviceProviderNotifier.notify(order, referencePoint, meters, categoryId);
  }
}
