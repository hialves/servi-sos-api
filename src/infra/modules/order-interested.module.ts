import { Module } from '@nestjs/common';
import { OrderInterestedController } from '../../presentation/controllers/order-interested.controller';
import { DemonstrateInterestUsecase } from '../../application/usecases/order-interested/demonstrate-interest.usecase';

@Module({
  providers: [DemonstrateInterestUsecase],
  controllers: [OrderInterestedController],
})
export class OrderInterestedModule {}
