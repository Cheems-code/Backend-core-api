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

  // Crear orden (USER / ADMIN)
  async create(
    user: { id: string; role: Role },
    dto: CreateOrderDto,
  ) {
    // 1 Validar que el customer exista
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // 2 Crear la orden
    return this.prisma.order.create({
      data: {
        description: dto.description,
        customerId: dto.customerId,
      },
    });
  }

  // Órdenes de un cliente específico
  async findByCustomer(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        address: true,
      },
    });
  }

  // ADMIN → todas las órdenes
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        address: true,
        customer: true,
      },
    });
  }

  // ADMIN o acceso controlado
  async findOne(orderId: string, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        customer: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Solo ADMIN puede ver cualquier orden
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have access to this order',
      );
    }

    return order;
  }

  // ADMIN ONLY
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
