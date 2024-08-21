import { Module } from '@nestjs/common';
import { OrderInterestedController } from '../../presentation/controllers/order-interested.controller';
import { DemonstrateInterestUsecase } from '../../application/usecases/order-interested/demonstrate-interest.usecase';
import { GetSentInterestedOrdersUsecase } from '../../application/usecases/order-interested/get-sent-interested-orders.usecase';
import { AnswerQuoteInterestUsecase } from '../../application/usecases/order-interested/answer-quote-interest.usecase';

@Module({
  providers: [DemonstrateInterestUsecase, GetSentInterestedOrdersUsecase, AnswerQuoteInterestUsecase],
  controllers: [OrderInterestedController],
})
export class OrderInterestedModule {}
