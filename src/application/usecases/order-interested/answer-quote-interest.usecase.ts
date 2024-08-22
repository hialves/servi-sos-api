import { Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { AnswerQuoteInterestDto } from '../../order-negotiation/answer-quote-interest.dto';
import { OrderNegotiationPrismaRepository } from '../../../infra/persistence/prisma/repositories/order-negotiation.repository';

@Injectable()
export class AnswerQuoteInterestUsecase {
  constructor(private repository: OrderNegotiationPrismaRepository) {}

  async execute(dto: AnswerQuoteInterestDto, userId: ID) {
    const entity = await this.repository.findNegotiation({
      externalOrderId: dto.externalOrderId,
      userId: userId,
    });
    if (!entity) return new ApplicationError(responseMessages.notFound(responseMessages.order));

    entity.answerQuote(dto.status);

    await this.repository.save(entity);
    return entity;
  }
}
