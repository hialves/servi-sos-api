import { ID } from '../../domain/entities';
import { Location } from '../../domain/valueobjects/location.value-object';

export abstract class ServiceProviderConfigRepository {
  abstract setLocation(serviceProviderId: ID, location: Location): Promise<void>;
  abstract setFirebaseIdentifier(serviceProviderId: ID, firebaseUserIdentifier: string | null): Promise<void>;
}
