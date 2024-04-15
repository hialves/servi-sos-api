import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExternalID, ID } from '../../domain/entities';
import { OrderFields } from '../../domain/entities/order';
import { CustomerNoUserResponse } from './customer.response';
import { CategoryNoSubResponse } from './category.response';
import { AdminNoUserResponse } from './admin.response';

export class OrderResponse
  implements Omit<OrderFields, 'id' | 'categoryId' | 'userId' | 'customerId' | 'serviceProviderId'>
{
  @ApiProperty()
  id: ID;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  lat: number;
  @ApiProperty()
  long: number;
  @ApiProperty()
  done: boolean;
  @ApiProperty()
  price: number;
  @ApiPropertyOptional()
  agreedPrice: number | null;
  @ApiProperty()
  externalId: ExternalID;
  @ApiPropertyOptional()
  description: string | null;
}

export class OrderFullResponse extends OrderResponse {
  @ApiPropertyOptional()
  category: CategoryNoSubResponse | null;
  @ApiPropertyOptional()
  customer: CustomerNoUserResponse | null;
  @ApiPropertyOptional()
  serviceProvider: AdminNoUserResponse | null;
}
