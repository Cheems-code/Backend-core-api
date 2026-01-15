import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.order.create({
      data: {
        description: dto.description,
        customerId: dto.customerId,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        address: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    this.validateStatusTransition(order.status, dto.status);

    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });
  }

  private validateStatusTransition(
    current: OrderStatus,
    next: OrderStatus,
  ) {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      CONFIRMED: [OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED],
      IN_TRANSIT: [OrderStatus.DELIVERED],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new BadRequestException(
        `Invalid status transition from ${current} to ${next}`,
      );
    }
  }
}
