import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ID } from '../../../domain/entities';

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  parentId?: ID;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFinal?: boolean;
}
