import { CreateCustomerDto } from '../dto/customer/create-customer.dto';
import { CustomerService } from '../../application/services/customer.service';
import { ExternalID } from '../../domain/entities';
import { UpdateCustomerDto } from '../dto/customer/update-customer.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { IsPublic } from '../decorators/public.decorator';
import { UpdateCustomerData } from '../../domain/valueobjects/update-customer-data';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { CreateCustomerData } from '../../domain/valueobjects/create-customer-data';
import { CustomerMapper } from '../mappers/customer.mapper';
import { CreateFromGoogleDto } from '../dto/auth/create-from-google.dto';
import admin from 'firebase-admin';
import { Request, Response } from 'express';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { PaymentService } from '../../application/interfaces/payment-service.interface';
import { GetCustomerPaymentMethodsUsecase } from '../../application/usecases/customer/get-customer-payment-methods.usecase';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
  constructor(
    private service: CustomerService,
    private prisma: PrismaService,
    private paymentService: PaymentService,
    private getCustomerPaymentMethods: GetCustomerPaymentMethodsUsecase,
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

  @IsPublic()
  @Post('google')
  async handleGoogleAuth(
    @Body() dto: CreateFromGoogleDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await admin.auth().verifyIdToken(dto.idToken);
    const input = new CreateCustomerData({
      name: user.name,
      email: user.email!,
      role: Role.customer,
      googleId: user.uid,
    });
    const session = await this.service.handleGoogleAuth(input, request);
    if (session) {
      response.cookie('access_token', `Bearer ${session.accessToken}`, { expires: new Date(session.accessExpiresAt) });
      response.cookie('refresh_token', `Bearer ${session.refreshToken}`, {
        expires: new Date(session.refreshExpiresAt),
      });
      response.status(201).json({ accessToken: session.accessToken, refreshToken: session.refreshToken });
    }
  }

  @Roles(Role.customer)
  @Get('payment-methods')
  async customerPaymentMethods(@Session() session: UserSession) {
    return this.getCustomerPaymentMethods.execute(session.userId);
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
