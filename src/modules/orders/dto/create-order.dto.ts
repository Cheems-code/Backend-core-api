import { IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: "Pedido de prueba",
    description: "Descripción del pedido",
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "ID del cliente",
  })
  @IsUUID()
  customerId: string;
}
