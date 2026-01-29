import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
  PrismaModule,
  AuthModule,
  CustomersModule,
  OrdersModule,

  ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60,   //ventana de tiempo en segundos
        limit: 10, //máximo requests por IP en esa ventana
      },
    ],
  }),
],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule,
    },
  ]
})
export class AppModule {}
