import { Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { ServiceProviderCategoryRepository } from '../../repositories/service-provider-category.interface';
import { CategoryRepository } from '../../repositories/category-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { AdminRepository } from '../../repositories/admin-repository.interface';

@Injectable()
export class AddCategoryServiceProviderUsecase {
  constructor(
    private repository: ServiceProviderCategoryRepository,
    private categoryRepository: CategoryRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute(userId: ID, categoryId: ID): Promise<ApplicationError | void> {
    const existsCategory = await this.categoryRepository.findById(categoryId);
    if (existsCategory && !existsCategory.isFinal)
      return new ApplicationError(responseMessages.serviceProviderCategory.categoryNotFinal);

    const serviceProvider = await this.adminRepository.getByUserId(userId);
    if (!serviceProvider) return new ApplicationError(responseMessages.user.notAdmin);
    const exists = await this.repository.exists(serviceProvider.id, categoryId);
    if (exists) return new ApplicationError(responseMessages.serviceProviderCategory.alreadyAdded);

    await this.repository.add(serviceProvider.id, categoryId);
  }
}
