import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddressesService } from '../addresses/addresses.service';
import { CreateAddressDto } from '../addresses/dto/create-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly addressesService: AddressesService,
  ) {}

  // 🔹 USER + ADMIN → crear orden
  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.sub, dto);
  }

  // 🔒 ADMIN ONLY → ver todas las órdenes
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // 🔹 USER + ADMIN → ownership en service
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.ordersService.findOne(id, req.user);
  }

  // 🔒 ADMIN ONLY → cambiar estado
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  // 🔹 USER + ADMIN → ownership en service
  @Post(':id/address')
  addAddress(
      @Req() req,
      @Param('id') orderId: string,
      @Body() dto: CreateAddressDto,
    ) {
      return this.addressesService.create(dto, orderId, req.user);
    }

}
