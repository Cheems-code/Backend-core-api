import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(3)
  street: string;

  @IsString()
  @MinLength(2)
  city: string;

  @IsString()
  reference?: string;

  @IsUUID()
  orderId: string;
}
