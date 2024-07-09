import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentSheetDto {
  @IsNotEmpty()
  @IsString()
  externalOrderId: string;
}
