import { ExternalID } from '../../domain/entities';
import { Body, Controller, Get, NotFoundException, Param, Post, Query, Session } from '@nestjs/common';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { Role } from '@prisma/client';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { CreateOrderService } from '../../application/services/order/create-order.service';
import { CreateOrderDto } from '../../application/services/order/create-order.dto';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { OrderFullResponse, OrderResponse } from '../response/order.response';
import { AllRoles } from '../helpers/roles.helpers';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(
    private createOrderService: CreateOrderService,
    private prisma: PrismaService,
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
}
