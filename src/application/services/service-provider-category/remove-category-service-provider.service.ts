import { HttpStatus, Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { responseMessages } from '../../messages/response.messages';
import { CategoryRepository } from '../../repositories/category-repository.interface';
import { ServiceProviderCategoryRepository } from '../../repositories/service-provider-category.interface';
import { ApplicationError } from '../../errors/application-error';
import { AdminRepository } from '../../repositories/admin-repository.interface';

@Injectable()
export class RemoveCategoryServiceProviderService {
  constructor(
    private repository: ServiceProviderCategoryRepository,
    private categoryRepository: CategoryRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute(userId: ID, categoryId: ID) {
    const serviceProvider = await this.adminRepository.getByUserId(userId);
    if (!serviceProvider) return new ApplicationError(responseMessages.user.notAdmin);

    const existCategory = await this.categoryRepository.findById(categoryId);
    if (!existCategory)
      return new ApplicationError(responseMessages.notFound(responseMessages.category), HttpStatus.NOT_FOUND);
    const exists = await this.repository.exists(serviceProvider.id, categoryId);
    if (!exists)
      return new ApplicationError(
        responseMessages.serviceProviderCategory.alreadyRemovedOrInvalid,
        HttpStatus.NOT_FOUND,
      );

    return this.repository.remove(serviceProvider.id, categoryId);
  }
}
