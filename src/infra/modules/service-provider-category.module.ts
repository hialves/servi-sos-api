import { Module } from '@nestjs/common';
import { ServiceProviderCategoryController } from '../../presentation/controllers/service-provider-category.controller';
import { RemoveCategoryServiceProviderUsecase } from '../../application/usecases/service-provider-category/remove-category-service-provider.usecase';
import { AddCategoryServiceProviderUsecase } from '../../application/usecases/service-provider-category/add-category-service-provider.usecase';

@Module({
  providers: [AddCategoryServiceProviderUsecase, RemoveCategoryServiceProviderUsecase],
  controllers: [ServiceProviderCategoryController],
})
export class ServiceProviderCategoryModule {}
