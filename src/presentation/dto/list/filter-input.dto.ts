import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export enum OrderByDateEnum {
  DESC = 'desc',
  ASC = 'asc',
}

export class StringFilterDto {
  @IsOptional()
  @IsString()
  contains: string;

  @IsOptional()
  @IsString()
  endsWith: string;

  @IsOptional()
  @IsString()
  equals: string;

  @IsOptional()
  @IsString({ each: true })
  in: string[];

  @IsOptional()
  @IsString()
  not: string;

  @IsOptional()
  @IsString({ each: true })
  notIn: string[];

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  startsWith: string;
}

export class NumberFilterDto {
  @IsOptional()
  @IsNumber()
  equals: number;

  @IsOptional()
  @IsNumber()
  in: number[];

  @IsOptional()
  @IsNumber()
  not: number;

  @IsOptional()
  @IsNumber()
  notIn: number[];

  @IsOptional()
  @IsNumber()
  search: number;

  @IsOptional()
  @IsNumber()
  gt: number;

  @IsOptional()
  @IsNumber()
  gte: number;

  @IsOptional()
  @IsNumber()
  lt: number;

  @IsOptional()
  @IsNumber()
  lte: number;
}

export class BooleanFilterDto {
  @IsOptional()
  @IsBoolean()
  equals: boolean;

  @IsOptional()
  @IsBoolean()
  not: boolean;
}

export class PaginatedDto {
  @IsOptional()
  @IsNumber()
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  take?: number = 10;
}

export class OrderByFilterDto {
  @IsOptional()
  createdAt?: OrderByDateEnum;

  @IsOptional()
  updatedAt?: OrderByDateEnum;
}

export class FilterDto extends PaginatedDto {
  @IsOptional()
  orderBy: OrderByFilterDto;
}
