import { Module } from '@nestjs/common';
import { AnswerQuoteInterestUsecase } from '../../application/usecases/order-interested/answer-quote-interest.usecase';
import { OrderNegotiationController } from '../../presentation/controllers/order-negotiation.controller';

@Module({
  providers: [AnswerQuoteInterestUsecase],
  controllers: [OrderNegotiationController],
})
export class OrderNegotiationModule {}
