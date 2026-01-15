import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

const jwtSecret = process.env.JWT_SECRET;
const expiresInRaw = process.env.JWT_EXPIRES_IN;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined');
}

if (!expiresInRaw) {
  throw new Error('JWT_EXPIRES_IN is not defined');
}

const jwtExpiresIn = Number(expiresInRaw);

if (Number.isNaN(jwtExpiresIn)) {
  throw new Error('JWT_EXPIRES_IN must be a number');
}

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: jwtExpiresIn, // ✅ number
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
