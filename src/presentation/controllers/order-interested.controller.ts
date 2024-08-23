import { Body, Controller, Get, Injectable, Param, Post, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { ExternalID } from '../../domain/entities';
import { OrderInterestedPrismaRepository } from '../../infra/persistence/prisma/repositories/order-interested.repository';
import { AllRoles } from '../helpers/roles.helpers';
import { DemonstrateInterestDto } from '../../application/order-interested/demonstrate-interest.dto';
import { DemonstrateInterestUsecase } from '../../application/usecases/order-interested/demonstrate-interest.usecase';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { Role } from '@prisma/client';
import { GetSentInterestedOrdersUsecase } from '../../application/usecases/order-interested/get-sent-interested-orders.usecase';

@ApiTags('Order interested')
@Controller('order-interesteds')
@Injectable()
export class OrderInterestedController {
  constructor(
    private orderInterestedRepository: OrderInterestedPrismaRepository,
    private demonstrateInterest: DemonstrateInterestUsecase,
    private getSentInterestedOrders: GetSentInterestedOrdersUsecase,
  ) {}

  @ApiOperation({ summary: 'Demonstra interesse no pedido' })
  @Roles(Role.admin, Role.manager)
  @Post()
  addInterest(@Body() dto: DemonstrateInterestDto, @Session() session: UserSession) {
    return this.demonstrateInterest.execute(dto, session.userId);
  }

  @ApiOperation({ summary: 'Obtém os provedores de serviços interessados no pedido' })
  @Roles(...AllRoles)
  @Get('/sent')
  getServiceProviderSentInterestedOrders(@Session() session: UserSession) {
    return this.getSentInterestedOrders.execute(session.userId);
  }

  @ApiOperation({ summary: 'Obtém os provedores de serviços interessados no pedido' })
  @Roles(...AllRoles)
  @Get(':externalOrderId')
  getInterestedServiceProviders(@Param('externalOrderId') externalOrderId: ExternalID) {
    return this.orderInterestedRepository.getInterestedServiceProviders(externalOrderId);
  }
}
