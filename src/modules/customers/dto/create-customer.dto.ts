import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    example: "John Doe",
    description: "Nombre del cliente",
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: "user@gmail.com",
    description: "Correo electrónico del cliente",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "123-456-7890",
    description: "Número de teléfono del cliente",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
