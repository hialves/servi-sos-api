import { HttpStatus, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { PaymentService } from '../../../application/interfaces/payment-service.interface';
import { Customer } from '../../../domain/entities/customer';
import { ApplicationError } from '../../../application/errors/application-error';

@Injectable()
export class StripeService implements PaymentService {
  private client = new Stripe(process.env.STRIPE_SECRET_KEY);

  async createCheckoutSession(stripeCustomerId: string) {
    const session = await this.client.checkout.sessions.create({
      line_items: [
        {
          price: process.env.NORMAL_SOLICITATION_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://10.0.2.2:3000/success.html`,
      cancel_url: `http://10.0.2.2:3000/cancel.html`,
      customer: stripeCustomerId,
    });

    if (!session.url) return null;

    return { url: session.url };
  }

  async createCustomer(customer: Customer) {
    const result = await this.client.customers.create({
      name: customer.name,
      email: customer.email,
      metadata: { id: customer.id, externalId: customer.externalId },
    });
    return result.id;
  }

  async createIntent(stripeCustomerId: string, amount: number, orderId?: number) {
    const paymentIntent = await this.client.paymentIntents.create({
      amount,
      currency: 'brl',
      customer: stripeCustomerId,
      setup_future_usage: 'off_session',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: orderId || null },
    });
    return paymentIntent;
  }

  async updateIntentOrderId({
    paymentCustomerId,
    intentId,
    orderId,
  }: {
    intentId: string;
    orderId: number;
    paymentCustomerId: string;
  }): Promise<void> {
    if ((await this.client.paymentIntents.retrieve(intentId)).customer === paymentCustomerId)
      await this.client.paymentIntents.update(intentId, { metadata: { orderId } });
  }

  async createEphemeralKey(stripeCustomerId: string): Promise<Stripe.Response<Stripe.EphemeralKey>> {
    return this.client.ephemeralKeys.create({ customer: stripeCustomerId }, { apiVersion: '2024-06-20' });
  }

  async getCustomerPaymentMethods(stripeCustomerId: string): Promise<Stripe.ApiListPromise<Stripe.PaymentMethod>> {
    return this.client.customers.listPaymentMethods(stripeCustomerId);
  }

  async chargePaymentMethod(input: {
    stripeCustomerId: string;
    amount: number;
    paymentMethodId: string;
    orderId?: number;
  }) {
    if (input.amount < 800) return new ApplicationError('Valor inválido', HttpStatus.BAD_REQUEST);
    if ((await this.client.paymentMethods.retrieve(input.paymentMethodId)).customer !== input.stripeCustomerId)
      return new ApplicationError('Método de pagamento não pertence ao usuário', HttpStatus.BAD_REQUEST);

    const paymentIntent = await this.client.paymentIntents.create({
      amount: input.amount,
      currency: 'brl',
      customer: input.stripeCustomerId,
      automatic_payment_methods: { enabled: true },
      payment_method: input.paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: { orderId: input.orderId || null },
    });
    return paymentIntent;
  }

  async getWebhookData<T extends string | Buffer>(
    body: T,
    signature: string,
    secret: string,
  ): Promise<Stripe.Event | undefined> {
    try {
      const event = this.client.webhooks.constructEvent(body, signature, secret);
      return event;
    } catch (e) {
      console.log(e);
    }
  }

  async getProductPrice(productId: string) {
    const product = await this.client.products.retrieve(productId);

    const price = await this.client.prices.retrieve(product.default_price as string);
    return price;
  }
}
