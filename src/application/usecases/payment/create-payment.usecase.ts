import { HttpStatus, Injectable } from '@nestjs/common';
import { PaymentService } from '../../interfaces/payment-service.interface';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';

@Injectable()
export class CreatePaymentUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private paymentService: PaymentService,
  ) {}

  async execute(userId: number): Promise<
    | ApplicationError
    | {
        paymentIntent: string | null;
        ephemeralKey?: string;
        customer: string;
        publishableKey: string;
      }
  > {
    const customer = await this.customerRepository.getByUserId(userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.UNPROCESSABLE_ENTITY);

    const ephemeralKey = await this.paymentService.createEphemeralKey(customer.paymentCustomerId);
    // TODO: remover o 800 mockado
    const paymentIntent = await this.paymentService.createIntent(customer.paymentCustomerId, 800);

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.paymentCustomerId,
      publishableKey: process.env.STRIPE_PUBLISH_KEY,
    };
  }
}
