import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { OrderRepository } from '../../repositories/order-repository.interface';
import { StripeService } from '../../../infra/frameworks/payment/stripe.service';

@Injectable()
export class UpdateOrderIdUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private stripeService: StripeService,
    private orderRepository: OrderRepository,
  ) {}

  async execute(input: {
    externalOrderId: string;
    userId: number;
    paymentIntentId: string;
  }): Promise<ApplicationError | void> {
    const customer = await this.customerRepository.getByUserId(input.userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.UNPROCESSABLE_ENTITY);
    const order = await this.orderRepository.findByExternalId(input.externalOrderId);
    if (!order) return new ApplicationError(responseMessages.notFound(responseMessages.order), HttpStatus.NOT_FOUND);

    await this.stripeService.updateIntentOrderId({
      intentId: input.paymentIntentId,
      orderId: order.id,
      paymentCustomerId: customer.paymentCustomerId,
    });
  }
}
