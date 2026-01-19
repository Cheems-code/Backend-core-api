import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../common/enums/role.enum';

describe('AddressesService', () => {
  let service: AddressesService;
  let prisma: PrismaService;

  const prismaMock = {
    order: {
      findUnique: jest.fn(),
    },
    address: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
    it('should create an address for its own order', async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({
      id: 'order-1',
      customerId: 'customer-1',
      address: null,
    });

    (prisma.address.create as jest.Mock).mockResolvedValue({
      id: 'address-1',
    });

    const dto = {
      street: 'Av. Siempre Viva',
      city: 'Lima',
      reference: 'Frente al parque',
    };

    const user = {
      role: Role.USER,
      customerId: 'customer-1',
    };

    const result = await service.create(dto, 'order-1', user);

    expect(prisma.address.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'address-1' });
  });
});
