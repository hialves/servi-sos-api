import { ExternalID, ID } from '../../domain/entities';
import { Customer } from '../../domain/entities/customer';
import { CreateCustomerData } from '../../domain/valueobjects/create-customer-data';

export abstract class CustomerRepository {
  abstract create(input: CreateCustomerData): Promise<Customer>;
  abstract findById(id: ID): Promise<Customer | null>;
  abstract findByExternalId(externalId: ExternalID): Promise<Customer | null>;
  abstract findByEmail(email: string): Promise<Customer | null>;
  abstract update(input: Customer): Promise<Customer>;
  abstract getByUserId(userId: ID): Promise<Customer | null>;
}
