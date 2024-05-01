import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetConfigServiceProviderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsLongitude()
  long: number;
}
