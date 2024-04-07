import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExternalID } from '../../domain/entities';
import { CustomerFields } from '../../domain/entities/customer';
import { UserResponse } from './user.response';

export class CustomerResponse implements Omit<CustomerFields, 'id' | 'externalId' | 'userId'> {
  @ApiProperty()
  id: ExternalID;
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
  @ApiPropertyOptional({ type: UserResponse })
  user: UserResponse | null;
}
