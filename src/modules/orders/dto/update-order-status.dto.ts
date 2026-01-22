import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    description: 'Nuevo estado del pedido',
  })

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
