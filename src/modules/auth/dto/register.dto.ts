import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: "user@gmail.com",
    description: "Correo electrónico del usuario",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "ContraseñaSegura",
    description: "Contraseña del usuario",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
