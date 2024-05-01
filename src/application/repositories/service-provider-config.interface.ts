import { ID } from '../../domain/entities';
import { Location } from '../../domain/valueobjects/location.value-object';

export abstract class ServiceProviderConfigRepository {
  abstract set(serviceProviderId: ID, input: { location: Location }): Promise<void>;
}
