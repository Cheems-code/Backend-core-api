import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Crear orden (USER / ADMIN)
  async create(userId: string, dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        description: dto.description,
        customerId: userId,
      },
    });
  }

  // 🔹 USER → solo sus órdenes
  async findByCustomer(userId: string) {
    return this.prisma.order.findMany({
      where: {
        customerId: userId,
      },
      include: {
        address: true,
      },
    });
  }

  // 🔒 ADMIN → todas las órdenes
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        address: true,
        customer: true,
      },
    });
  }

  // 🔹 USER (ownership) / ADMIN
  async findOne(orderId: string, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Ownership check
    if (user.role !== Role.ADMIN && order.customerId !== user.customerId) {
      throw new ForbiddenException(
        'You do not have access to this order',
      );
    }

    return order;
  }

  // 🔒 ADMIN ONLY 
  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: dto.status,
      },
    });
  }
}
