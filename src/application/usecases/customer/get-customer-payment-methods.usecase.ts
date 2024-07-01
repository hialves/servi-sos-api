import { Injectable } from '@nestjs/common';
import { PaymentService } from '../../interfaces/payment-service.interface';
import { CustomerRepository } from '../../repositories/customer-repository.interface';

@Injectable()
export class GetCustomerPaymentMethodsUsecase {
  constructor(
    private customerRepository: CustomerRepository,
    private paymentService: PaymentService,
  ) {}

  async execute(userId: number): Promise<{ id: string; brand: string; last4: string }[]> {
    const customer = await this.customerRepository.getByUserId(userId);
    const paymentMethods = await this.paymentService.getCustomerPaymentMethods(customer!.paymentCustomerId);
    return paymentMethods.data.map((item) => ({ id: item.id, brand: item.card!.brand, last4: item.card!.last4 }));
  }
}
