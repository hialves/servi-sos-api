import { ID } from '../../domain/entities';
import { Location } from '../../domain/valueobjects/location.value-object';
import { Transaction } from '../../infra/persistence/prisma/prisma.interface';

export abstract class ServiceProviderConfigRepository {
  abstract createEmpty(serviceProviderId: ID, tx?: Transaction): Promise<void>;
  abstract setLocation(serviceProviderId: ID, location: Location): Promise<void>;
  abstract setFirebaseIdentifier(serviceProviderId: ID, firebaseUserIdentifier: string | null): Promise<void>;
}
