import { HttpStatus, Injectable } from '@nestjs/common';
import { PaymentService } from '../../interfaces/payment-service.interface';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { ChargePaymentMethodDto } from '../../../presentation/dto/payment/charge-payment-method.dto';
import Stripe from 'stripe';

@Injectable()
export class ChargePaymentMethodUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private paymentService: PaymentService,
  ) {}

  async execute(
    dto: ChargePaymentMethodDto,
    userId: number,
  ): Promise<ApplicationError | Stripe.Response<Stripe.PaymentIntent>> {
    const customer = await this.customerRepository.getByUserId(userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer, HttpStatus.UNPROCESSABLE_ENTITY);

    // TODO: remover o 800 mockado
    try {
      const paymentIntent = await this.paymentService.chargePaymentMethod({
        stripeCustomerId: customer.paymentCustomerId,
        amount: 800,
        paymentMethodId: dto.paymentMethodId,
      });

      return paymentIntent;
    } catch (e) {
      throw e;
    }
  }
}
