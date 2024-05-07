import { ID } from '.';

export interface ServiceProviderConfigFields {
  serviceProviderId: ID;
  createdAt: Date;
  updatedAt: Date;
  lat: number;
  long: number;
  coordinates: string;
  firebaseUserIdentifier: string | null;
}

export class ServiceProviderConfig {
  serviceProviderId: ID;
  createdAt: Date;
  updatedAt: Date;
  lat: number;
  long: number;
  coordinates: string;
  firebaseUserIdentifier: string | null;

  constructor(input: ServiceProviderConfigFields) {
    this.serviceProviderId = input.serviceProviderId;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.lat = input.lat;
    this.long = input.long;
    this.coordinates = input.coordinates;
    this.firebaseUserIdentifier = input.firebaseUserIdentifier;
  }

  setFirebaseIdentifier(value: string | null) {
    this.firebaseUserIdentifier = value;
    return this;
  }
}
