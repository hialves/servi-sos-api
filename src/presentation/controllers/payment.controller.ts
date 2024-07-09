import { Body, Controller, Headers, Param, Patch, Post, Res, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutOrderUsecase } from '../../application/usecases/payment/checkout-order.usecase';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { ApplicationError } from '../../application/errors/application-error';
import { CreatePaymentUsecase } from '../../application/usecases/payment/create-payment.usecase';
import { ChargePaymentMethodDto } from '../dto/payment/charge-payment-method.dto';
import { ChargePaymentMethodUsecase } from '../../application/usecases/payment/charge-payment-method.usecase';
import { IsPublic } from '../decorators/public.decorator';
import { HandleWebhookUsecase } from '../../application/usecases/payment/handle-webhook.usecase';
import { PaymentSheetDto } from '../dto/payment/payment-sheet.dto';
import { UpdateOrderIdUsecase } from '../../application/usecases/payment/update-order-id.usecase';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private checkoutOrder: CheckoutOrderUsecase,
    private createPayment: CreatePaymentUsecase,
    private chargePaymentMethod: ChargePaymentMethodUsecase,
    private handleWebhook: HandleWebhookUsecase,
    private updateOrderId: UpdateOrderIdUsecase,
  ) {}

  @Roles(Role.customer)
  @Post('checkout-session')
  async createCheckoutSession(@Session() session: UserSession, @Res({ passthrough: true }) res: Response) {
    const redirectUrl = await this.checkoutOrder.execute(session.userId);
    if (redirectUrl instanceof ApplicationError) return redirectUrl;

    res.redirect(redirectUrl);
  }

  @Roles(Role.customer)
  @Post('payment-sheet')
  async paymentSheet(@Session() session: UserSession) {
    return this.createPayment.execute({ userId: session.userId });
  }

  @Roles(Role.customer)
  @Patch('order-id/:paymentIntentId')
  async updateIntentOrderId(
    @Session() session: UserSession,
    @Param('paymentIntentId') paymentIntentId: string,
    @Body() body: PaymentSheetDto,
  ) {
    console.log({ body });
    return this.updateOrderId.execute({
      userId: session.userId,
      externalOrderId: body.externalOrderId,
      paymentIntentId,
    });
  }

  @Roles(Role.customer)
  @Post('charge-payment-method')
  async _chargePaymentMethod(@Body() dto: ChargePaymentMethodDto, @Session() session: UserSession) {
    const result = await this.chargePaymentMethod.execute(dto, session.userId);
    if (result instanceof ApplicationError) return result;
  }

  @IsPublic()
  @Post('webhook')
  async webhook(@Body() body, @Headers('stripe-signature') stripeSignature: string): Promise<void> {
    this.handleWebhook.execute(body, stripeSignature);
  }
}
