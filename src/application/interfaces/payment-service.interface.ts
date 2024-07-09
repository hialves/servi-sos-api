import Stripe from 'stripe';
import { Customer } from '../../domain/entities/customer';
import { ApplicationError } from '../errors/application-error';

export abstract class PaymentService {
  abstract createCheckoutSession(customerId: string): Promise<{ url: string } | null>;
  abstract createCustomer(customer: Customer): Promise<string>;
  abstract createIntent(
    stripeCustomerId: string,
    amount: number,
    orderId: number,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>>;
  abstract chargePaymentMethod(input: {
    stripeCustomerId: string;
    amount: number;
    paymentMethodId: string;
  }): Promise<Stripe.Response<Stripe.PaymentIntent> | ApplicationError>;
  abstract createEphemeralKey(stripeCustomerId: string): Promise<Stripe.Response<Stripe.EphemeralKey>>;
  abstract getCustomerPaymentMethods(stripeCustomerId: string): Promise<Stripe.ApiListPromise<Stripe.PaymentMethod>>;
  abstract getWebhookData<T extends string | Buffer>(body: T, signature: string, secret: string): Promise<any>;
}
