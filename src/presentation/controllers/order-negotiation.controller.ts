import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AnswerQuoteInterestDto } from '../../application/order-negotiation/answer-quote-interest.dto';
import { AnswerQuoteInterestUsecase } from '../../application/usecases/order-interested/answer-quote-interest.usecase';

@ApiTags('Order negotiation')
@Controller('order-negotiations')
@Injectable()
export class OrderNegotiationController {
  constructor(private answerQuote: AnswerQuoteInterestUsecase) {}

  @ApiOperation({ summary: 'Responde o orçamento do provedor de serviço' })
  @Roles(Role.customer)
  @Post('answer-quote')
  answerServiceProviderQuote(@Body() dto: AnswerQuoteInterestDto) {
    return this.answerQuote.execute(dto);
  }
}
