import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExternalID } from '../../domain/entities';
import { Role } from '@prisma/client';

export class UserResponse {
  @ApiProperty()
  id: ExternalID;
  @ApiPropertyOptional()
  role: Role | null;
  @ApiPropertyOptional({ type: String })
  lastLogin: Date | null;
}
