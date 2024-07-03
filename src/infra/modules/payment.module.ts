import { Module } from '@nestjs/common';
import { StripeService } from '../frameworks/payment/stripe.service';
import { PaymentController } from '../../presentation/controllers/payment.controller';
import { PaymentService } from '../../application/interfaces/payment-service.interface';
import { CheckoutOrderUsecase } from '../../application/usecases/payment/checkout-order.usecase';
import { CreatePaymentUsecase } from '../../application/usecases/payment/create-payment.usecase';
import { ChargePaymentMethodUsecase } from '../../application/usecases/payment/charge-payment-method.usecase';

@Module({
  controllers: [PaymentController],
  providers: [
    { provide: PaymentService, useClass: StripeService },
    CheckoutOrderUsecase,
    CreatePaymentUsecase,
    ChargePaymentMethodUsecase,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
