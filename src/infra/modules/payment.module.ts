import { Module } from '@nestjs/common';
import { StripeService } from '../frameworks/payment/stripe.service';
import { PaymentController } from '../../presentation/controllers/payment.controller';
import { CheckoutOrderUsecase } from '../../application/usecases/payment/checkout-order.usecase';
import { CreatePaymentUsecase } from '../../application/usecases/payment/create-payment.usecase';
import { ChargePaymentMethodUsecase } from '../../application/usecases/payment/charge-payment-method.usecase';
import { HandleWebhookUsecase } from '../../application/usecases/payment/handle-webhook.usecase';
import { UpdateOrderIdUsecase } from '../../application/usecases/payment/update-order-id.usecase';
import { NotificationModule } from '../frameworks/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [PaymentController],
  providers: [
    StripeService,
    CheckoutOrderUsecase,
    CreatePaymentUsecase,
    ChargePaymentMethodUsecase,
    HandleWebhookUsecase,
    UpdateOrderIdUsecase,
  ],
  exports: [StripeService],
})
export class PaymentModule {}
