import { Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { ServiceProviderConfigRepository } from '../../repositories/service-provider-config.interface';
import { AdminRepository } from '../../repositories/admin-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';

@Injectable()
export class SetFirebaseIdentifierServiceProviderUsecase {
  constructor(
    private repository: ServiceProviderConfigRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute(userId: ID, firebaseIdentifier?: string) {
    const serviceProvider = await this.adminRepository.getByUserId(userId);
    if (!serviceProvider) return new ApplicationError(responseMessages.user.notAdmin);

    await this.repository.setFirebaseIdentifier(serviceProvider.id, firebaseIdentifier || null);
  }
}
