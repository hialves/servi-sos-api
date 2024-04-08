import {
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
import { CategoryService } from '../../application/services/category/category.service';
import { IsPublic } from '../decorators/public.decorator';
import { CreateCategoryData } from '../../domain/valueobjects/create-category-data';
import { ApplicationError } from '../../application/errors/application-error';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { CategoryGetResponse, CategoryUpsertResponse } from '../response/category.response';

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
  @ApiCreatedResponse({ type: CategoryUpsertResponse })
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const { name, parentId, isFinal } = dto;
    const input = new CreateCategoryData({ name, parentId, isFinal });
    const result = await this.service.create(input);
    if (result instanceof ApplicationError) {
      throw new HttpException({ message: result.message, data: result.data }, result.httpStatus);
    }
    return this.findOne(result.id);
  }

  @IsPublic()
  @ApiOkResponse({ type: CategoryGetResponse, isArray: true })
  @Get()
  async findAll(@Query() filters?: PaginatedDto) {
    const result = await this.repository.findMany({ ...filters, include: { children: true } });
    return result;
  }

  @IsPublic()
  @ApiOkResponse({ type: CategoryGetResponse })
  @Get(':id')
  async findOne(@Param('id') id: ID) {
    const result = await this.repository.findUnique({ where: { id }, include: { children: true } });
    if (!result) throw new NotFoundException();
    return result;
  }

  @Roles(Role.super_admin)
  @ApiOkResponse({ type: CategoryUpsertResponse })
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