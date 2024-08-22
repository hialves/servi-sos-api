import { Module } from '@nestjs/common';
import { OrderInterestedController } from '../../presentation/controllers/order-interested.controller';
import { DemonstrateInterestUsecase } from '../../application/usecases/order-interested/demonstrate-interest.usecase';
import { GetSentInterestedOrdersUsecase } from '../../application/usecases/order-interested/get-sent-interested-orders.usecase';

@Module({
  providers: [DemonstrateInterestUsecase, GetSentInterestedOrdersUsecase],
  controllers: [OrderInterestedController],
})
export class OrderInterestedModule {}
