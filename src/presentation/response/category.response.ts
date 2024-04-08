import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ID } from '../../domain/entities';
import { CategoryFields } from '../../domain/entities/category';

class CategoryChildren {
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
  parentId: ID;
}

export class CategoryGetResponse implements CategoryFields {
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
  parentId: ID;
  @ApiPropertyOptional()
  children: CategoryChildren[];
}

export class CategoryUpsertResponse extends CategoryChildren implements CategoryFields {}
