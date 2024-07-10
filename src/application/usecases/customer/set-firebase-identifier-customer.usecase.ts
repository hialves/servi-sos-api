import { Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { CustomerRepository } from '../../repositories/customer-repository.interface';

@Injectable()
export class SetFirebaseIdentifierCustomerUsecase {
  constructor(private repository: CustomerRepository) {}

  async execute(userId: ID, firebaseIdentifier?: string) {
    const customer = await this.repository.getByUserId(userId);
    if (!customer) return new ApplicationError(responseMessages.user.notCustomer);

    this.repository.setFirebaseIdentifier(customer.id, firebaseIdentifier || null);
    return;
  }
}
