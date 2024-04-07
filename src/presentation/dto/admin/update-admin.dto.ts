import { IsEmail, IsOptional } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}
