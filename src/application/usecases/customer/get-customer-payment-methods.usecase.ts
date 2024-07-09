import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { StripeService } from '../../../infra/frameworks/payment/stripe.service';

@Injectable()
export class GetCustomerPaymentMethodsUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private stripeService: StripeService,
  ) {}

  async execute(userId: number): Promise<{ id: string; brand: string; last4: string; isDefault: boolean }[]> {
    const customer = await this.customerRepository.getByUserId(userId);
    const paymentMethods = await this.stripeService.getCustomerPaymentMethods(customer!.paymentCustomerId);

    return paymentMethods.data.map((item) => ({
      id: item.id,
      brand: item.card!.brand,
      last4: item.card!.last4,
      isDefault: customer?.defaultPaymentMethodId !== undefined && customer.defaultPaymentMethodId === item.id,
    }));
  }
}
