import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { StripeService } from '../../../infra/frameworks/payment/stripe.service';

@Injectable()
export class CheckoutOrderUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private stripeService: StripeService,
  ) {}

  async execute(userId: number): Promise<ApplicationError | string> {
    const customer = await this.customerRepository.getByUserId(userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.UNPROCESSABLE_ENTITY);

    const session = await this.stripeService.createCheckoutSession(customer.paymentCustomerId);
    if (!session) return new ApplicationError('URL inválida', HttpStatus.BAD_REQUEST);
    return session.url;
  }
}
