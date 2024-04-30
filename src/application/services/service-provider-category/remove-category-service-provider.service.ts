import { HttpStatus } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { responseMessages } from '../../messages/response.messages';
import { CategoryRepository } from '../../repositories/category-repository.interface';
import { ServiceProviderCategoryRepository } from '../../repositories/service-provider-category.interface';
import { ApplicationError } from '../../errors/application-error';

export class RemoveCategoryServiceProvider {
  constructor(
    private repository: ServiceProviderCategoryRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute(serviceProviderId: ID, categoryId: ID) {
    const exists = await this.categoryRepository.findById(categoryId);
    if (exists) return new ApplicationError(responseMessages.notFound(responseMessages.category), HttpStatus.NOT_FOUND);
    return this.repository.remove(serviceProviderId, categoryId);
  }
}
