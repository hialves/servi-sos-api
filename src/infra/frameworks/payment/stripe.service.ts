import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { PaymentService } from '../../../application/interfaces/payment-service.interface';
import { Customer } from '../../../domain/entities/customer';

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

  async createIntent(stripeCustomerId: string, amount: number) {
    const paymentIntent = await this.client.paymentIntents.create({
      amount,
      currency: 'brl',
      customer: stripeCustomerId,
      setup_future_usage: 'off_session',
      // payment_method_types: ['card'],
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  }

  async createEphemeralKey(stripeCustomerId: string): Promise<Stripe.Response<Stripe.EphemeralKey>> {
    return this.client.ephemeralKeys.create({ customer: stripeCustomerId }, { apiVersion: '2020-08-27' });
  }

  async getCustomerPaymentMethods(stripeCustomerId: string): Promise<Stripe.ApiListPromise<Stripe.PaymentMethod>> {
    return this.client.customers.listPaymentMethods(stripeCustomerId);
  }
}
