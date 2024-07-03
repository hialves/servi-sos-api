import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExternalID, ID } from '../../domain/entities';
import { CustomerFields } from '../../domain/entities/customer';
import { UserResponse } from './user.response';

export class CustomerResponse
  implements Omit<CustomerFields, 'userId' | 'paymentCustomerId' | 'defaultPaymentMethodId'>
{
  @ApiProperty()
  id: ID;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiPropertyOptional()
  assetId: number | null;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  phone: string | null;
  @ApiProperty()
  externalId: ExternalID;
}

export class CustomerNoUserResponse extends CustomerResponse {}
export class CustomerWithUserResponse extends CustomerResponse {
  @ApiPropertyOptional({ type: UserResponse })
  user: UserResponse | null;
}
