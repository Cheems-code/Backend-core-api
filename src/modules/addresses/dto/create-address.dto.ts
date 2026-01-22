import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    example: "Av. Los Incas 115",
    description: "Dirección del cliente",
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  street: string;

  @ApiProperty({
    example: "Arequipa",
    description: "Ciudad del cliente",
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  city: string;

  @ApiProperty({
    example: "Cerca a un Colegio",
    description: "Referencia de la dirección",
    required: false,
  })
  @IsString()
  reference?: string;
}
