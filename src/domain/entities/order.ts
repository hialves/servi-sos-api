import { ExternalID, ID } from '.';
import { Location } from '../valueobjects/location.value-object';

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
  description: string | null;
}

export class Order {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  categoryId: ID | null;
  customerId: ID | null;
  serviceProviderId: ID | null;
  location: Location;
  done: boolean;
  price: number;
  agreedPrice: number | null;
  externalId: ExternalID;
  description: string | null;

  constructor(input: OrderFields) {
    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.categoryId = input.categoryId;
    this.customerId = input.customerId;
    this.serviceProviderId = input.serviceProviderId;
    this.location = new Location({ lat: input.lat, long: input.long });
    this.done = input.done;
    this.price = input.price;
    this.agreedPrice = input.agreedPrice;
    this.externalId = input.externalId;
    this.description = input.description;
  }

  changeCategory(categoryId: ID) {
    this.categoryId = categoryId;
  }

  setAgreedPrice(agreedPrice: number) {
    this.agreedPrice = agreedPrice;
  }

  setCustomerLocation(coords: { lat: number; long: number }) {
    this.location = new Location(coords);
  }

  assignServiceProvider(serviceProviderId: ID) {
    this.serviceProviderId = serviceProviderId;
  }

  unassignServiceProvider() {
    this.serviceProviderId = null;
    this.agreedPrice = null;
  }
}
