import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ID } from '../../domain/entities';
import { CategoryFields } from '../../domain/entities/category';

export class CategoryChildren {
  @ApiProperty()
  id: ID;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  name: string;
  @ApiProperty()
  isFinal: boolean;
  @ApiPropertyOptional()
  parentId: ID | null;
}

export class CategoryFullResponse extends CategoryChildren implements CategoryFields {
  @ApiPropertyOptional()
  children: CategoryChildren[];
}

export class CategoryNoSubResponse extends CategoryChildren implements CategoryFields {}
