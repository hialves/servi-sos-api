import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ID } from '../../domain/entities';

export class DemonstrateInterestDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  givenPrice: number;

  @IsNotEmpty()
  orderId: ID;
}
