import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
