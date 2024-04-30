import { HttpStatus, Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { ServiceProviderCategoryRepository } from '../../repositories/service-provider-category.interface';
import { CategoryRepository } from '../../repositories/category-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';

@Injectable()
export class AddCategoryServiceProvider {
  constructor(
    private repository: ServiceProviderCategoryRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute(serviceProviderId: ID, categoryId: ID) {
    const exists = await this.categoryRepository.findById(categoryId);
    if (exists)
      return new ApplicationError(responseMessages.serviceProviderCategory.alreadyAdded, HttpStatus.BAD_REQUEST);
    return this.repository.add(serviceProviderId, categoryId);
  }
}
