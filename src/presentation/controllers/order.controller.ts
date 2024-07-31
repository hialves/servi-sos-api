import { ExternalID } from '../../domain/entities';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { Role } from '@prisma/client';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { CreateOrderUsecase } from '../../application/usecases/order/create-order.usecase';
import { CreateOrderDto } from '../../application/usecases/order/create-order.dto';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { OrderFullResponse, OrderResponse } from '../response/order.response';
import { AllRoles } from '../helpers/roles.helpers';
import { Location } from '../../domain/valueobjects/location.value-object';
import { OrderListRepository } from '../../application/repositories/order-list-repository.interface';
import { CustomerRepository } from '../../application/repositories/customer-repository.interface';
import { UpdateOrderDto } from '../dto/order/update-order.dto';
import { OrderService } from '../../application/services/order.service';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(
    private createOrderService: CreateOrderUsecase,
    private prisma: PrismaService,
    private orderListRepository: OrderListRepository,
    private customerRepository: CustomerRepository,
    private orderService: OrderService,
  ) {}

  private get repository() {
    return this.prisma.order;
  }

  @Roles(Role.customer)
  @ApiOkResponse({ type: OrderResponse })
  @Post()
  async create(@Body() dto: CreateOrderDto, @Session() session: UserSession) {
    return this.createOrderService.execute(dto, session.userId);
  }

  @Roles(...AllRoles)
  @ApiOkResponse({ type: OrderFullResponse })
  @Get()
  async findAll(@Query() filters: PaginatedDto) {
    return this.repository.findMany({
      ...filters,
      include: { category: true, customer: true, serviceProvider: true },
    });
  }

  @Roles(...AllRoles)
  @ApiOkResponse({ type: OrderFullResponse, isArray: true })
  @Get('my-orders')
  async myOrders(@Session() session: UserSession) {
    const customer = await this.customerRepository.getByUserId(session.userId);
    const result = await this.orderListRepository.customerOrders(customer!.externalId);
    return result;
  }

  @Roles(...AllRoles)
  @ApiOkResponse({ type: OrderFullResponse, isArray: true })
  @Get('active')
  async activeOrders(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('long', ParseFloatPipe) long: number,
    @Query('meters', ParseIntPipe) meters: number,
    @Query('categoryId') categoryId?: string,
  ) {
    const result = await this.orderListRepository.activeOrders(new Location({ lat, long }), meters, {
      categoryId: categoryId ? +categoryId : undefined,
    });
    return result;
  }

  @Roles(...AllRoles)
  @ApiOkResponse({ type: OrderFullResponse })
  @Get(':id')
  async findOne(@Param('id') externalId: ExternalID) {
    const result = await this.repository.findUnique({
      where: { externalId },
      include: { category: true, customer: true, serviceProvider: true },
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  @Roles(...AllRoles)
  @ApiOkResponse({ type: OrderFullResponse })
  @Patch(':id')
  async update(@Param('id') externalId: ExternalID, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(externalId, dto);
  }
}
