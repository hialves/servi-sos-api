import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExternalID, ID } from '../../domain/entities';
import { AdminFields } from '../../domain/entities/admin';
import { UserResponse } from './user.response';

export class AdminResponse implements Omit<AdminFields, 'id' | 'externalId' | 'userId'> {
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
  @ApiProperty()
  externalId: ExternalID;
}

export class AdminNoUserResponse extends AdminResponse {}
export class AdminWithUserResponse extends AdminResponse {
  @ApiPropertyOptional({ type: UserResponse })
  user: UserResponse | null;
}
