import { Body, Controller, Injectable, Post, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { UserSession } from '../../infra/interfaces/user-session.interface';
import { Role } from '@prisma/client';
import { AnswerQuoteInterestDto } from '../../application/order-negotiation/answer-quote-interest.dto';
import { AnswerQuoteInterestUsecase } from '../../application/usecases/order-interested/answer-quote-interest.usecase';

@ApiTags('Order negotiation')
@Controller('order-negotiation')
@Injectable()
export class OrderNegotiationController {
  constructor(private answerQuote: AnswerQuoteInterestUsecase) {}

  @ApiOperation({ summary: 'Responde o orçamento do provedor de serviço' })
  @Roles(Role.customer)
  @Post('answer-quote')
  answerServiceProviderQuote(@Body() dto: AnswerQuoteInterestDto, @Session() session: UserSession) {
    return this.answerQuote.execute(dto, session.userId);
  }
}
