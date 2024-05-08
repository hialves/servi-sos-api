import { Body, Controller, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { ExternalID } from '../../domain/entities';
import { IsPublic } from '../decorators/public.decorator';
import { AdminMapper } from '../mappers/admin.mapper';
import { CreateServiceProviderDto } from '../dto/service-provider/create-service-provider.dto';
import { CreateServiceProviderUsecase } from '../../application/usecases/service-provider/create-service-provider.usecase';

@ApiTags('Service provider')
@Controller('service-provider')
export class ServiceProviderController {
  constructor(
    private prisma: PrismaService,
    private createServiceProviderUsecase: CreateServiceProviderUsecase,
  ) {}

  private get repository() {
    return this.prisma.admin;
  }

  @IsPublic()
  @Post()
  async create(@Body() dto: CreateServiceProviderDto) {
    const result = await this.createServiceProviderUsecase.execute(dto);
    return this.findOne(result.externalId);
  }

  async findOne(@Param('id') externalId: ExternalID) {
    const result = await this.repository.findUnique({ where: { externalId }, include: { user: true } });
    if (!result) throw new NotFoundException();
    return AdminMapper.getToResponse(result);
  }
}
