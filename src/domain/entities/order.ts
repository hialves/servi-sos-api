import { ExternalID, ID } from '.';

export interface OrderFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  categoryId: ID | null;
  customerId: ID | null;
  serviceProviderId: number | null;
  lat: number;
  long: number;
  done: boolean;
  price: number;
  agreedPrice: number | null;
  externalId: ExternalID;
}

export class Order implements OrderFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  categoryId: ID | null;
  customerId: ID | null;
  serviceProviderId: ID | null;
  lat: number;
  long: number;
  done: boolean;
  price: number;
  agreedPrice: number | null;
  externalId: ExternalID;

  constructor(input: OrderFields) {
    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.categoryId = input.categoryId;
    this.customerId = input.customerId;
    this.serviceProviderId = input.serviceProviderId;
    this.lat = input.lat;
    this.long = input.long;
    this.done = input.done;
    this.price = input.price;
    this.agreedPrice = input.agreedPrice;
    this.externalId = input.externalId;
  }

  changeCategory(categoryId: ID) {
    this.categoryId = categoryId;
  }

  setAgreedPrice(agreedPrice: number) {
    this.agreedPrice = agreedPrice;
  }

  setCustomerLocation(coords: { lat: number; long: number }) {
    this.lat = coords.lat;
    this.long = coords.long;
  }

  assignServiceProvider(serviceProviderId: ID) {
    this.serviceProviderId = serviceProviderId;
  }

  unassignServiceProvider() {
    this.serviceProviderId = null;
    this.agreedPrice = null;
  }
}
