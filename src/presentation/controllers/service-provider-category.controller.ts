import { Body, Controller, Delete, Param, Post, Session } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { AddCategoryServiceProviderUsecase } from '../../application/usecases/service-provider-category/add-category-service-provider.usecase';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { RemoveCategoryServiceProviderUsecase } from '../../application/usecases/service-provider-category/remove-category-service-provider.usecase';
import { ID } from '../../domain/entities';

@ApiTags('Service provider')
@Controller('service-provider-category')
export class ServiceProviderCategoryController {
  constructor(
    private addCategoryService: AddCategoryServiceProviderUsecase,
    private removeCategoryService: RemoveCategoryServiceProviderUsecase,
  ) {}

  @ApiOperation({ summary: 'Adiciona nova categoria ao prestador de serviço' })
  @Roles(Role.super_admin, Role.manager, Role.admin)
  @ApiNoContentResponse()
  @Post(':categoryId')
  add(@Param('categoryId') categoryId: ID, @Session() session: UserSession) {
    return this.addCategoryService.execute(session.userId, categoryId);
  }

  @ApiOperation({ summary: 'Remove categoria do prestador de serviço' })
  @Roles(Role.super_admin, Role.manager, Role.admin)
  @ApiNoContentResponse()
  @Delete(':categoryId')
  remove(@Body() categoryId: ID, @Session() session: UserSession) {
    return this.removeCategoryService.execute(session.userId, categoryId);
  }
}
