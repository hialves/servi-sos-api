import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ID } from '../../../domain/entities';

export class UpdateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId: ID | null;
  @ApiProperty()
  @IsOptional()
  @IsLatitude()
  lat: number;
  @ApiProperty()
  @IsOptional()
  @IsLongitude()
  long: number;
  @ApiPropertyOptional()
  @IsOptional()
  description: string;
}
