import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ID } from '../../../domain/entities';
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId: ID | null;
  @ApiProperty()
  @IsNotEmpty()
  @IsLatitude()
  lat: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsLongitude()
  long: number;
  @ApiPropertyOptional()
  @IsOptional()
  description: string;

  customerId: ID;
  price: number;

  setCustomer(id: ID) {
    this.customerId = id;
    return this;
  }

  setPrice(price: number) {
    this.price = price;
    return this;
  }
}
