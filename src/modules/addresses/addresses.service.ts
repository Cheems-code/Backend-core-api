import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAddressDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { address: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
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
        orderId: dto.orderId,
      },
    });
  }
}
