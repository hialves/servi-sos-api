import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ExternalID } from '../../domain/entities';

export class DemonstrateInterestDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  givenPrice: number;

  @IsNotEmpty()
  @IsString()
  externalOrderId: ExternalID;
}
