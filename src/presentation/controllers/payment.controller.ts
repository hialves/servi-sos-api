import { Controller, Post, Res, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutOrderUsecase } from '../../application/usecases/payment/checkout-order.usecase';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { ApplicationError } from '../../application/errors/application-error';
import { CreatePaymentUsecase } from '../../application/usecases/payment/create-payment.usecase';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private checkoutOrder: CheckoutOrderUsecase,
    private createPayment: CreatePaymentUsecase,
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
    return this.createPayment.execute(session.userId);
  }
}
