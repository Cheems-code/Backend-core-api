import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateAddressDto,
    orderId: string,
    user: any,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // 🔐 Ownership: USER solo puede agregar address a su orden
    if (user.role !== Role.ADMIN && order.customerId !== user.customerId) {
      throw new ForbiddenException(
        'You do not own this order',
      );
    }

    if (order.address) {
      throw new BadRequestException(
        'Order already has an address',
      );
    }

    return this.prisma.address.create({
      data: {
        street: dto.street,
        city: dto.city,
        reference: dto.reference,
        orderId: orderId,
      },
    });
  }
}
