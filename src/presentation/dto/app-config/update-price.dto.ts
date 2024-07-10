import { IsNotEmpty, IsPositive, Min } from 'class-validator';

export class UpdatePriceDto {
  @IsNotEmpty()
  @Min(400)
  @IsPositive()
  newPrice: number;
}
