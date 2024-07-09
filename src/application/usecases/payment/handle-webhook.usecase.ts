import { Injectable } from '@nestjs/common';
import { StripeService } from '../../../infra/frameworks/payment/stripe.service';

@Injectable()
export class HandleWebhookUsecase {
  constructor(private stripeService: StripeService) {}

  execute(body: any, signature: string) {
    return this.stripeService.getWebhookData(body, signature, '');
  }
}
