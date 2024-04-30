import { ID } from '../../domain/entities';

export abstract class ServiceProviderCategoryRepository {
  abstract add(serviceProviderId: ID, categoryId: ID): Promise<void>;
  abstract bulkAdd(serviceProviderId: ID, categoryIds: ID[]): Promise<void>;
  abstract exists(serviceProviderId: ID, categoryId: ID): Promise<boolean>;
  abstract remove(serviceProviderId: ID, categoryId: ID): Promise<boolean>;
}
