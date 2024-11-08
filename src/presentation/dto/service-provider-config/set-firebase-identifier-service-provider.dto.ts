import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SetFirebaseIdentifierServiceProviderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firebaseIdentifier?: string;
}
