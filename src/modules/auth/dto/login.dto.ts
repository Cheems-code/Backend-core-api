import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: "user@gmail.com",
    description: "Correo electrónico del usuario",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "ContraseñaSegura",
    description: "Contraseña del usuario",
  })  
  @IsString()
  password: string;
}
