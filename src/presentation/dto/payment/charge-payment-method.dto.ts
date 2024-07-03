import { IsNotEmpty, IsString } from 'class-validator';

export class ChargePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}
