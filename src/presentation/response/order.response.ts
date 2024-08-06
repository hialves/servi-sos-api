import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExternalID, ID } from '../../domain/entities';
import { OrderFields } from '../../domain/entities/order';
import { CustomerNoUserResponse } from './customer.response';
import { CategoryNoSubResponse } from './category.response';
import { AdminNoUserResponse } from './admin.response';
import { PaymentStatus } from '@prisma/client';

export class OrderResponse
  implements
    Omit<
      OrderFields,
      'id' | 'categoryId' | 'userId' | 'customerId' | 'serviceProviderId' | 'paymentGatewayOrderId' | 'location'
    >
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
  published: boolean;
  @ApiProperty()
  publishedAt: Date;
  @ApiProperty()
  price: number;
  @ApiPropertyOptional()
  agreedPrice: number | null;
  @ApiProperty()
  externalId: ExternalID;
  @ApiPropertyOptional()
  description: string | null;
  @ApiProperty()
  paymentStatus: PaymentStatus;
}

export class OrderFullResponse extends OrderResponse {
  @ApiPropertyOptional()
  category: CategoryNoSubResponse | null;
  @ApiPropertyOptional()
  customer: CustomerNoUserResponse | null;
  @ApiPropertyOptional()
  serviceProvider: AdminNoUserResponse | null;
}
