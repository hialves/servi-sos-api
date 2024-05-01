import { Module } from '@nestjs/common';
import { ServiceProviderCategoryController } from '../../presentation/controllers/service-provider-category.controller';
import { RemoveCategoryServiceProviderService } from '../../application/services/service-provider-category/remove-category-service-provider.service';
import { AddCategoryServiceProviderService } from '../../application/services/service-provider-category/add-category-service-provider.service';

@Module({
  providers: [AddCategoryServiceProviderService, RemoveCategoryServiceProviderService],
  controllers: [ServiceProviderCategoryController],
})
export class ServiceProviderCategoryModule {}
