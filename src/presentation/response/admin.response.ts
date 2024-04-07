import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExternalID } from '../../domain/entities';
import { AdminFields } from '../../domain/entities/admin';
import { UserResponse } from './user.response';

export class AdminResponse implements Omit<AdminFields, 'id' | 'externalId' | 'userId'> {
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
  @ApiPropertyOptional({ type: UserResponse })
  user: UserResponse | null;
}
