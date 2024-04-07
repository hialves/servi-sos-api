import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from '../dto/admin/create-admin.dto';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { ExternalID } from '../../domain/entities';
import { UpdateAdminDto } from '../dto/admin/update-admin.dto';
import { UpdateAdminData } from '../../domain/valueobjects/update-admin-data';
import { AdminService } from '../../application/services/admin/admin.service';
import { IsPublic } from '../decorators/public.decorator';
import { CreateAdminData } from '../../domain/valueobjects/create-admin-data';
import { AdminMapper } from '../mappers/admin.mapper';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private service: AdminService,
  ) {}

  private get repository() {
    return this.prisma.admin;
  }

  @IsPublic()
  @Post()
  async create(@Body() dto: CreateAdminDto) {
    const { email, name, password } = dto;
    const input = new CreateAdminData({ email, name, password, role: Role.admin });
    const result = await this.service.create(input);
    return this.findOne(result.externalId);
  }

  @Roles(Role.super_admin)
  @Get()
  async findAll(@Query() filters?: PaginatedDto) {
    const result = await this.repository.findMany({ ...filters, include: { user: true } });
    return result.map(AdminMapper.getToResponse);
  }

  @Roles(Role.super_admin)
  @Get(':id')
  async findOne(@Param('id') externalId: ExternalID) {
    const result = await this.repository.findUnique({ where: { externalId }, include: { user: true } });
    if (!result) throw new NotFoundException();
    return AdminMapper.getToResponse(result);
  }

  @Roles(Role.super_admin, Role.admin, Role.manager)
  @Patch(':id')
  update(@Param('id') externalId: ExternalID, @Body() dto: UpdateAdminDto) {
    const data = new UpdateAdminData(dto);
    return this.service.update(externalId, data);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  async remove(@Param('id') externalId: ExternalID) {
    await this.repository.delete({ where: { externalId } });
  }
}
