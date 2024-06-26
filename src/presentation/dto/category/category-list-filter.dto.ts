import { PaginatedDto } from '../list/filter-input.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryListFilterDto extends PaginatedDto {
  @ApiPropertyOptional()
  parentId?: number;
}
