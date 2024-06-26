import { IsNotEmpty } from 'class-validator';

export class CreateFromGoogleDto {
  @IsNotEmpty()
  idToken: string;
}
