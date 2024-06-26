import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { ID } from '../../domain/entities';
import { UpdateCategoryData } from '../../domain/valueobjects/update-category-data';
import { CategoryService } from '../../application/services/category.service';
import { IsPublic } from '../decorators/public.decorator';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { CategoryFullResponse, CategoryNoSubResponse } from '../response/category.response';
import { CategoryListFilterDto } from '../dto/category/category-list-filter.dto';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(
    private prisma: PrismaService,
    private service: CategoryService,
  ) {}

  private get repository() {
    return this.prisma.category;
  }

  @Roles(Role.super_admin)
  @ApiCreatedResponse({ type: CategoryNoSubResponse })
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @IsPublic()
  @ApiOkResponse({ type: CategoryFullResponse, isArray: true })
  @Get()
  async findAll(@Query() filters?: CategoryListFilterDto) {
    const parentId = filters?.parentId ? Number(filters.parentId) : null;
    let rest = {};
    if (filters) {
      const { parentId: _, ...restFilters } = filters;
      rest = restFilters;
    }

    const result = await this.repository.findMany({ ...rest, where: { parentId }, include: { children: true } });
    return result;
  }

  @IsPublic()
  @ApiOkResponse({ type: CategoryFullResponse })
  @Get(':id')
  async findOne(@Param('id') id: ID) {
    const result = await this.repository.findUnique({ where: { id }, include: { children: true } });
    if (!result) throw new NotFoundException();
    return result;
  }

  @Roles(Role.super_admin)
  @ApiOkResponse({ type: CategoryNoSubResponse })
  @Patch(':id')
  update(@Param('id') id: ID, @Body() dto: UpdateCategoryDto) {
    const data = new UpdateCategoryData(dto);
    return this.service.update(id, data);
  }

  @Roles(Role.super_admin)
  @ApiNoContentResponse()
  @Delete(':id')
  async remove(@Param('id') id: ID) {
    await this.repository.delete({ where: { id } });
  }
}
