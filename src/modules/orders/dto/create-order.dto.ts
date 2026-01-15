import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(5)
  description: string;

  @IsUUID()
  customerId: string;
}
