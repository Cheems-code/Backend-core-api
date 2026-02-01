import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SecurityExceptionFilter } from './modules/common/filters/security-exception.filter';
import { SecurityLogService } from './modules/security/security-log.service';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.setGlobalPrefix('api'); 

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedOrigins = [
    process.env.FRONTEND_DEV_URL,
    process.env.FRONTEND_PROD_URL,
    process.env.BACKEND_URL,
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const securityLogService = app.get(SecurityLogService);
  app.useGlobalFilters(new SecurityExceptionFilter(securityLogService));

  const config = new DocumentBuilder()
    .setTitle('Backend Core API')
    .setDescription('API de gestión de usuarios, clientes, pedidos y direcciones')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
