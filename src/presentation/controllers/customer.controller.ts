import { CreateCustomerDto } from '../dto/customer/create-customer.dto';
import { CustomerService } from '../../application/services/customer/customer.service';
import { ExternalID } from '../../domain/entities';
import { UpdateCustomerDto } from '../dto/customer/update-customer.dto';
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { IsPublic } from '../decorators/public.decorator';
import { UpdateCustomerData } from '../../domain/valueobjects/update-customer-data';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { CreateCustomerData } from '../../domain/valueobjects/create-customer-data';
import { CustomerMapper } from '../mappers/customer.mapper';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
  constructor(
    private service: CustomerService,
    private prisma: PrismaService,
  ) {}

  private get repository() {
    return this.prisma.customer;
  }

  @IsPublic()
  @Post()
  async create(@Body() dto: CreateCustomerDto) {
    const { email, name, phone, password } = dto;
    const input = new CreateCustomerData({ name, email, password, phone, role: Role.customer });
    const result = await this.service.create(input);
    return this.findOne(result.externalId);
  }

  @Roles(Role.super_admin)
  @Get()
  async findAll(@Query() filters: PaginatedDto) {
    const result = await this.repository.findMany({ ...filters, include: { user: true } });
    return result.map(CustomerMapper.getToResponse);
  }

  @Roles(Role.super_admin, Role.manager, Role.customer)
  @Get(':id')
  async findOne(@Param('id') externalId: ExternalID) {
    const result = await this.repository.findUnique({ where: { externalId }, include: { user: true } });
    if (!result) throw new NotFoundException();
    return CustomerMapper.getToResponse(result);
  }

  @Roles(Role.super_admin, Role.customer)
  @Patch(':id')
  update(@Param('id') externalId: ExternalID, @Body() dto: UpdateCustomerDto) {
    const data = new UpdateCustomerData(dto);
    return this.service.update(externalId, data);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  async remove(@Param('id') externalId: ExternalID) {
    await this.repository.delete({ where: { externalId } });
  }
}
