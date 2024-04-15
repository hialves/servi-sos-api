import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ID } from '../../domain/entities';
import { Role } from '@prisma/client';

export class UserResponse {
  @ApiProperty()
  id: ID;
  @ApiPropertyOptional()
  role: Role | null;
  @ApiPropertyOptional({ type: String })
  lastLogin: Date | null;
}
