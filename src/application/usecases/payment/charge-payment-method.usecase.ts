import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { ChargePaymentMethodDto } from '../../../presentation/dto/payment/charge-payment-method.dto';
import Stripe from 'stripe';
import { StripeService } from '../../../infra/frameworks/payment/stripe.service';
import { OrderRepository } from '../../repositories/order-repository.interface';
import { AppConfig } from '../../../infra/config/app.config';

@Injectable()
export class ChargePaymentMethodUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private stripeService: StripeService,
    private orderRepository: OrderRepository,
    private appConfig: AppConfig,
  ) {}

  async execute(
    dto: ChargePaymentMethodDto,
    userId: number,
  ): Promise<ApplicationError | Stripe.Response<Stripe.PaymentIntent>> {
    const customer = await this.customerRepository.getByUserId(userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.UNPROCESSABLE_ENTITY);
    if (!dto.externalOrderId)
      return new ApplicationError(responseMessages.order.orderIdInvalid, HttpStatus.INTERNAL_SERVER_ERROR);
    const order = await this.orderRepository.findByExternalId(dto.externalOrderId);
    if (!order) return new ApplicationError(responseMessages.notFound(responseMessages.order), HttpStatus.NOT_FOUND);

    try {
      const paymentIntent = await this.stripeService.chargePaymentMethod({
        stripeCustomerId: customer.paymentCustomerId,
        amount: this.appConfig.getOrderPrice(),
        paymentMethodId: dto.paymentMethodId,
        orderId: order.id,
      });

      return paymentIntent;
    } catch (e) {
      throw e;
    }
  }
}
