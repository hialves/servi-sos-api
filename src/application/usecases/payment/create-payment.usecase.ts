import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { OrderRepository } from '../../repositories/order-repository.interface';
import { StripeService } from '../../../infra/frameworks/payment/stripe.service';
import { AppConfig } from '../../../infra/config/app.config';

@Injectable()
export class CreatePaymentUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private stripeService: StripeService,
    private appConfig: AppConfig,
  ) {}

  async execute(input: { userId: number }): Promise<
    | ApplicationError
    | {
        paymentIntent: string | null;
        ephemeralKey?: string;
        customer: string;
      }
  > {
    const customer = await this.customerRepository.getByUserId(input.userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.UNPROCESSABLE_ENTITY);

    const ephemeralKey = await this.stripeService.createEphemeralKey(customer.paymentCustomerId);

    const paymentIntent = await this.stripeService.createIntent(
      customer.paymentCustomerId,
      this.appConfig.getOrderPrice(),
    );

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.paymentCustomerId,
    };
  }
}
