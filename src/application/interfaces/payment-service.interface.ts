import Stripe from 'stripe';
import { Customer } from '../../domain/entities/customer';

export abstract class PaymentService {
  abstract createCheckoutSession(customerId: string): Promise<{ url: string } | null>;
  abstract createCustomer(customer: Customer): Promise<string>;
  abstract createIntent(stripeCustomerId: string, amount: number): Promise<Stripe.Response<Stripe.PaymentIntent>>;
  abstract createEphemeralKey(stripeCustomerId: string): Promise<Stripe.Response<Stripe.EphemeralKey>>;
  abstract getCustomerPaymentMethods(stripeCustomerId: string): Promise<Stripe.ApiListPromise<Stripe.PaymentMethod>>;
}
