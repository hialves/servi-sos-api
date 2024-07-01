import { HttpStatus, Injectable } from '@nestjs/common';
import { PaymentService } from '../../interfaces/payment-service.interface';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';

@Injectable()
export class CheckoutOrderUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private paymentService: PaymentService,
  ) {}

  async execute(userId: number): Promise<ApplicationError | string> {
    const customer = await this.customerRepository.getByUserId(userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.UNPROCESSABLE_ENTITY);

    const session = await this.paymentService.createCheckoutSession(customer.paymentCustomerId);
    if (!session) return new ApplicationError('URL inválida', HttpStatus.BAD_REQUEST);
    return session.url;
  }
}
