import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [PrismaModule, AuthModule, CustomersModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
