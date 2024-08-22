import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ExternalID } from '../../domain/entities';
import { AcceptanceStatus } from '../../domain/entities/order-interested';

export class AnswerQuoteInterestDto {
  @IsNotEmpty()
  @IsEnum(AcceptanceStatus)
  status: AcceptanceStatus;

  @IsNotEmpty()
  @IsString()
  externalOrderId: ExternalID;
}
