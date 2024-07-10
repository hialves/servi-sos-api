import { ExternalID, ID } from '.';

export interface CustomerFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phone: string | null;
  assetId: ID | null;
  userId: ID | null;
  externalId: ExternalID;
  paymentCustomerId: string | null;
  defaultPaymentMethodId: string | null;
  firebaseUserIdentifier: string | null;
}

export class Customer implements CustomerFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phone: string | null;
  assetId: ID | null;
  userId: ID | null;
  externalId: ExternalID;
  paymentCustomerId: string;
  defaultPaymentMethodId: string | null;
  firebaseUserIdentifier: string | null;

  constructor(input: CustomerFields) {
    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.name = input.name;
    this.email = input.email;
    this.phone = input.phone;
    this.assetId = input.assetId;
    this.userId = input.userId;
    this.externalId = input.externalId;
    this.paymentCustomerId = input.paymentCustomerId!;
    this.defaultPaymentMethodId = input.defaultPaymentMethodId;
    this.firebaseUserIdentifier = input.firebaseUserIdentifier;
  }
}
