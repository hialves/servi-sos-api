import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../../domain/entities';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  parentId?: ID;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isFinal?: boolean;
}
